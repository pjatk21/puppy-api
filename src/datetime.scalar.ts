import { CustomScalar, Scalar } from '@nestjs/graphql'
import { ValueNode, Kind } from 'graphql'
import { DateTime } from 'luxon'

@Scalar('DateTime')
export class DateTimeScalar implements CustomScalar<string, DateTime> {
  description = 'Scalar representing a datetime as an ISO string'

  parseValue(value: string): DateTime {
    return DateTime.fromISO(value)
  }

  serialize(value: DateTime | Date): string {
    if (value instanceof Date) {
      value = DateTime.fromJSDate(value)
    }
    return value.toISO()
  }

  parseLiteral(value: ValueNode): DateTime {
    if (value.kind !== Kind.STRING) {
      throw new Error('Expected string literal')
    }
    return DateTime.fromISO(value.value)
  }
}
