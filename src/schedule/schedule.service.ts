/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common'
import { DateTime } from 'luxon'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, ScheduledEvent } from '@prisma/client'
import { JSDOM } from 'jsdom'

class Extractor {
  private readonly fragment: DocumentFragment

  constructor(html: string) {
    this.fragment = JSDOM.fragment(html)
  }

  extract(id: string): string | null {
    const text = this.fragment
      .querySelector(`[id*="${id}"]`)
      ?.textContent?.trim()
    // if (!text) throw new Error(`Specified "${id}" selector not found!`)
    if (text === '---') return null
    return text ?? null
  }

  extractMany(id: string): string[] | null {
    const data = this.extract(id)
    if (!data) return null
    return data.split(', ').map((s) => s.trim())
  }

  extractDateTime(date: string, time: string): DateTime | null {
    const rawDate = this.extract(date)
    const rawTime = this.extract(time)
    if (!rawDate || !rawTime) return null
    return DateTime.fromFormat(`${rawDate} ${rawTime}`, 'dd.MM.yyyy HH:mm:ss')
  }
}

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async processShard(html: string): Promise<ScheduledEvent> {
    const extractor = new Extractor(html)

    const kind =
      extractor.extract('TypRezerwacjiLabel') ??
      extractor.extract('TypZajecLabel')

    if (!kind) throw new BadRequestException('No type filed found')

    try {
      switch (kind.toLowerCase()) {
        case 'ćwiczenia':
          return this.prisma.scheduledEvent.create({
            data: {
              type: 'workshop',
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
        case 'egzamin':
          return this.prisma.scheduledEvent.create({
            data: {
              type: 'reservation',
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
          throw new NotImplementedException()
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
        throw new ConflictException(e)
      }
      throw e
    }
  }
}
