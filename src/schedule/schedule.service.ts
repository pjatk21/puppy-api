/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common'
import { DateTime } from 'luxon'
import { PrismaService } from 'src/prisma/prisma.service'
import { EventType, Prisma, ScheduledEvent } from '@prisma/client'
import { JSDOM } from 'jsdom'

export type ScheduledEventsQuery = {
  groups?: string[]
  hosts?: string[]
  type?: EventType
}

export type ScheduledEventsRangeQuery = ScheduledEventsQuery & {
  begin: DateTime
  end: DateTime
}

class Extractor {
  private readonly fragment: DocumentFragment

  public constructor(html: string) {
    this.fragment = JSDOM.fragment(html)
  }

  public extract(id: string): string | null {
    const text = this.fragment
      .querySelector(`[id*="${id}"]`)
      ?.textContent?.trim()
    // if (!text) throw new Error(`Specified "${id}" selector not found!`)
    if (text === '---') return null
    return text ?? null
  }

  public extractMany(id: string): string[] | null {
    const data = this.extract(id)
    if (!data) return null
    return data.split(', ').map((s) => s.trim())
  }

  public extractDateTime(date: string, time: string): DateTime | null {
    const rawDate = this.extract(date)
    const rawTime = this.extract(time)
    if (!rawDate || !rawTime) return null
    return DateTime.fromFormat(`${rawDate} ${rawTime}`, 'dd.MM.yyyy HH:mm:ss')
  }
}

@Injectable()
export class ScheduleService {
  public constructor(private readonly prisma: PrismaService) {}

  /**
   * Simple parser for processing fragments of HTML provided by scrapers.
   * @param html HTML to be parsed.
   * @return Direct parsed data from database.
   */
  public async processShard(html: string): Promise<ScheduledEvent> {
    const extractor = new Extractor(html)

    let describedType =
      extractor.extract('TypRezerwacjiLabel') ??
      extractor.extract('TypZajecLabel')

    if (!describedType) throw new BadRequestException('No type filed found')
    describedType = describedType.toLowerCase()
    const type: EventType =
      (
        {
          ćwiczenia: 'workshop',
          wykład: 'lecture',
          egzamin: 'exam',
        } as Record<string, EventType>
      )[describedType] ?? 'other'

    try {
      switch (type) {
        case 'workshop':
        case 'lecture':
          return this.prisma.scheduledEvent.create({
            data: {
              type,
              title: extractor.extract('NazwaPrzedmiotyLabel')!,
              code: extractor.extract('KodPrzedmiotuLabel')!,
              room: extractor.extract('SalaLabel')!,
              begin: extractor
                .extractDateTime('DataZajecLabel', 'GodzRozpLabel')!
                .toJSDate(),
              end: extractor
                .extractDateTime('DataZajecLabel', 'GodzZakonLabel')!
                .toJSDate(),
              hosts: extractor.extractMany('DydaktycyLabel') ?? [],
              groups: extractor.extractMany('GrupyLabel') ?? [],
            },
          })
        case 'exam':
          return this.prisma.scheduledEvent.create({
            data: {
              type,
              title: extractor.extract('NazwyPrzedmiotowLabel')!,
              code: extractor.extract('KodyPrzedmiotowLabel')!,
              room: extractor.extract('SalaLabel')!,
              begin: extractor
                .extractDateTime('DataZajecLabel', 'GodzRozpLabel')!
                .toJSDate(),
              end: extractor
                .extractDateTime('DataZajecLabel', 'GodzZakonLabel')!
                .toJSDate(),
              hosts: extractor.extractMany('OsobaRezerwujacaLabel') ?? [],
              groups: extractor.extractMany('GrupyStudenckieLabel') ?? [],
            },
          })
        default:
          throw new NotImplementedException(`Unknown type: ${describedType}`)
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
        throw new ConflictException(e)
      }
      throw e
    }
  }

  public async availableGroups(): Promise<string[]> {
    const groupsArrays = await this.prisma.scheduledEvent.findMany({
      select: {
        groups: true,
      },
      distinct: ['groups'],
    })
    return groupsArrays.map((e) => e.groups).flat()
  }

  public async availableHosts(): Promise<string[]> {
    const hostsArrays = await this.prisma.scheduledEvent.findMany({
      select: {
        hosts: true,
      },
      distinct: ['hosts'],
    })
    return hostsArrays.map((e) => e.hosts).flat()
  }

  public allEvents(query: ScheduledEventsQuery): Promise<ScheduledEvent[]> {
    return this.prisma.scheduledEvent.findMany({
      where: {
        type: query.type,
        OR: [
          {
            groups: {
              hasSome: query.groups ?? [],
            },
          },
          {
            hosts: {
              hasSome: query.hosts ?? [],
            },
          },
        ],
      },
      orderBy: [
        {
          begin: 'asc',
        },
        { code: 'asc' },
      ],
    })
  }

  public rangeEvents(query: ScheduledEventsRangeQuery) {
    return this.prisma.scheduledEvent.findMany({
      where: {
        begin: { gte: query.begin.toJSDate() },
        end: { lte: query.end.toJSDate() },
        type: query.type,
        OR: [
          {
            groups: {
              hasSome: query.groups ?? [],
            },
          },
          {
            hosts: {
              hasSome: query.hosts ?? [],
            },
          },
        ],
      },
      orderBy: [{ begin: 'asc' }, { code: 'asc' }],
    })
  }
}
