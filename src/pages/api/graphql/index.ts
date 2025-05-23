// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createYoga } from 'graphql-yoga'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createContext } from '../../../../graphql/context'
import { schema } from '../../../../graphql/schema'

// Docs: https://vercel.com/docs/concepts/functions/serverless-functions

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
}

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema,
  context: createContext,
  graphqlEndpoint: '/api/graphql',
})
