import { GraphQLDefinitionsFactory } from '@nestjs/graphql'
import { join } from 'path'

const definitionsFactory = new GraphQLDefinitionsFactory()
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql', './src/**/*.gql'],
  path: join(process.cwd(), 'src/_autogen/graphql.ts'),
  outputAs: 'class',
})
