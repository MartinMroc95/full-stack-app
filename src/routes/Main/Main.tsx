import React from 'react'
import { gql, useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import type { Link } from '@prisma/client'

const AllLinksQuery = gql`
  query allLinksQuery($first: Int, $after: String) {
    links(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          imageUrl
          url
          title
          category
          description
          id
        }
      }
    }
  }
`

type Data = {
  links: {
    pageInfo: { endCursor: string; hasNextPage: boolean }
    edges: Array<{ node: Link }>
  }
}

export const Main = () => {
  const { data, loading, error, fetchMore } = useQuery<Data>(AllLinksQuery, {
    variables: { first: 2 },
  })

  if (loading) {
    return (
      <Center w="full" h="full">
        <Spinner>Loading...</Spinner>
      </Center>
    )
  }

  if (error) {
    return <Box>{error.message}</Box>
  }

  const { endCursor, hasNextPage } = data?.links.pageInfo || {}

  return (
    <VStack w="full" h="full">
      <Flex p="20px">NextJS App</Flex>
      <HStack gap="10px">
        {data?.links.edges.map(({ node }) => (
          <Card key={node.id}>
            <CardBody>
              <Text>{node.title}</Text>
              <Text>{node.description}</Text>
            </CardBody>
          </Card>
        ))}
      </HStack>
      {hasNextPage ? (
        <Button
          onClick={() => {
            void fetchMore({
              variables: { after: endCursor },
              updateQuery: (prevResult, { fetchMoreResult }) => ({
                links: {
                  pageInfo: fetchMoreResult.links.pageInfo,
                  edges: [...prevResult.links.edges, ...fetchMoreResult.links.edges],
                },
              }),
            })
          }}
        >
          More
        </Button>
      ) : (
        <Text className="my-10 text-center font-medium">{`You've reached the end!`}</Text>
      )}
    </VStack>
  )
}
