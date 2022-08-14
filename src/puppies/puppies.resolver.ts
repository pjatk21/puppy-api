import { Puppy } from '../_autogen/graphql'
import { ResolveField, Resolver, Query, Parent, Args, Mutation } from '@nestjs/graphql'

const myPuppies: Puppy[] = [
  {
    id: 'puppy-1',
    name: 'Fido',
    age: 2,
  },
  {
    id: 'puppy-2',
    name: 'Spot',
    age: 3,
  },
  {
    id: 'puppy-2137',
    name: 'Papiezyk',
    age: 12,
  },
]

@Resolver('Puppy')
export class PuppiesResolver {
  @Query()
  puppy(@Args('id') id: string): Partial<Puppy> | null {
    return myPuppies.find((puppy) => puppy.id === id) ?? null
  }

  @Query()
  puppies(@Args('id') ids: [string]): Puppy[] {
    return myPuppies.filter((puppy) => ids.includes(puppy.id))
  }

  @Query()
  allPuppies(): Puppy[] {
    return myPuppies
  }

  @Mutation()
  createPuppy(@Args('name') name: string, @Args('age') age: number): Puppy {
    const id = `puppy-${myPuppies.length + 1}`
    const puppy = { id, name, age }
    myPuppies.push(puppy)
    return puppy
  }
}
