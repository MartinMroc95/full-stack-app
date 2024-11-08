import React from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  HStack,
  Input,
  Spinner,
  Text,
  useToast,
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
          userId {
            id
            email
          }
        }
      }
    }
  }
`

const CreateLinkMutation = gql`
  mutation createLink(
    $title: String!
    $url: String!
    $imageUrl: String!
    $category: String!
    $description: String!
  ) {
    createLink(
      title: $title
      url: $url
      imageUrl: $imageUrl
      category: $category
      description: $description
    ) {
      title
      url
      imageUrl
      category
      description
    }
  }
`

type LinkData = {
  links: {
    pageInfo: { endCursor: string; hasNextPage: boolean }
    edges: Array<{ node: Link }>
  }
}

type FormValues = {
  category: string
  description: string
  image: FileList
  title: string
  url: string
}

export const Main = () => {
  const toast = useToast()
  const {
    data,
    loading: isLinksQueryLoading,
    error: linksQueryError,
    fetchMore: fetchMoreLinks,
  } = useQuery<LinkData>(AllLinksQuery, {
    variables: { first: 2 },
  })

  const { register, getValues, reset } = useForm<FormValues>()

  const [createLink, { loading }] = useMutation(CreateLinkMutation, {
    onCompleted: () => reset(),
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const { title, url, category, description } = getValues()
    const imageUrl = `https://via.placeholder.com/300`
    const variables = { title, url, category, description, imageUrl }
    try {
      const response = await createLink({ variables })
      if (response.data) {
        toast({
          title: 'Link has been created successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        })
      }
    } catch (error) {
      console.log('error', error)
      toast({
        title: 'Error!',
        description: 'Something went wrong...',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  if (isLinksQueryLoading) {
    return (
      <Center w="full" h="full">
        <Spinner>Loading...</Spinner>
      </Center>
    )
  }

  const { endCursor, hasNextPage } = data?.links.pageInfo || {}

  return (
    <VStack w="full" h="full">
      <Flex p="20px">NextJS App</Flex>
      <Box>{linksQueryError?.message}</Box>
      <HStack flexWrap="wrap" gap="10px">
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
            void fetchMoreLinks({
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
        <Text>{`You've reached the end!`}</Text>
      )}
      <form
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
      >
        <Text>Title</Text>
        <Input
          placeholder="Title"
          {...register('title', { required: true })}
          name="title"
          type="text"
        />
        <Text>Description</Text>
        <Input
          placeholder="Description"
          {...register('description', { required: true })}
          name="description"
          type="text"
        />
        <Text>Url</Text>
        <Input
          placeholder="https://example.com"
          {...register('url', { required: true })}
          name="url"
          type="text"
        />
        <Text>Category</Text>
        <Input
          placeholder="Name"
          {...register('category', { required: true })}
          name="category"
          type="text"
        />
        <Button disabled={loading} type="submit">
          {loading ? <Text> Creating...</Text> : <Text>Create Link</Text>}
        </Button>
      </form>
    </VStack>
  )
}
