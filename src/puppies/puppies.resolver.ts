import { Puppy } from '@auto/graphql'
import { ResolveField, Resolver, Query } from '@nestjs/graphql'

@Resolver('Puppy')
export class PuppiesResolver {
  @Query()
  puppies(): Puppy[] {
    return [
      {
        id: 1,
        name: 'Fido',
        age: 2,
      },
    ]
  }
}
