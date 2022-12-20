/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common'
import { DateTime } from 'luxon'
import { PrismaService } from 'src/prisma/prisma.service'
import { JSDOM } from 'jsdom'
import { ScrapJob } from '@prisma/client'

export type ScheduledEventsQuery = {
  groups?: string[]
  hosts?: string[]
  type?: unknown
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

  public storePayload(payload: string, jobId: number) {
    return this.prisma.scheduleShard.create({
      data: {
        receivedPayload: Buffer.from(payload),
        sourceJobId: jobId,
      },
    })
  }
}
