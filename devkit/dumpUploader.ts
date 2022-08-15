import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import path, { join } from 'path'
import fs from 'fs/promises'
import {
  ApolloClient,
  ApolloError,
  gql,
  InMemoryCache,
} from '@apollo/client/core'

await yargs(hideBin(process.argv))
  .command(
    'upload',
    'Uploads a dump to the server over HTTP.',
    (yargs) => yargs,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async () => {
      const client = new ApolloClient({
        uri: 'http://localhost:3000/graphql',
        cache: new InMemoryCache(),
      })

      const PROCESS_FRAGMENT = gql`
        mutation Mutation($html: String!) {
          processFragment(html: $html) {
            id
          }
        }
      `

      const dumpPath = path.join(process.cwd(), 'dump')
      const dates = await fs.readdir(dumpPath)
      for (const date of dates) {
        const datePath = path.join(dumpPath, date)
        for (const eventNo of await fs.readdir(datePath)) {
          const eventPath = path.join(datePath, eventNo)
          const dumpFilePath = path.join(eventPath, 'dump.html')
          try {
            await fs.access(dumpFilePath)
          } catch (e) {
            continue
          }

          // read file
          const dumpFile = await fs.readFile(dumpFilePath, 'utf8')
          try {
            await client.mutate({
              mutation: PROCESS_FRAGMENT,
              variables: {
                html: dumpFile,
              },
            })
            console.log(new Date(), 'uploaded', `${date}/${eventNo}`)
          } catch (e) {
            if (e instanceof ApolloError) {
              console.warn(new Date(), `${date}/${eventNo}`, e.message)
            }
          }
        }
      }
    },
  )
  .parse()
