import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { gql, useMutation, useQuery } from '@apollo/client'
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

type FormValues = {
  category: string
  description: string
  image: FileList
  title: string
  url: string
}

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

export const Main = () => {
  const {
    data,
    loading: isLinksQueryLoading,
    error: linksQueryError,
    fetchMore,
  } = useQuery<Data>(AllLinksQuery, {
    variables: { first: 2 },
  })

  const { register, handleSubmit, reset } = useForm<FormValues>()

  const [createLink, { loading }] = useMutation(CreateLinkMutation, {
    onCompleted: () => reset(),
  })

  // eslint-disable-next-line @typescript-eslint/require-await
  const onSubmit: SubmitHandler<FormValues> = async (submitData, event) => {
    console.log('event', event)
    event?.preventDefault()
    const { title, url, category, description } = submitData
    const imageUrl = `https://via.placeholder.com/300`
    // const userIds = user?.email
    const variables = { title, url, category, description, imageUrl }
    try {
      void toast.promise(createLink({ variables }), {
        loading: 'Creating new link..',
        success: 'Link successfully created!🎉',
        error: `Something went wrong 😥 Please try again`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (isLinksQueryLoading) {
    return (
      <Center w="full" h="full">
        <Spinner>Loading...</Spinner>
      </Center>
    )
  }

  if (linksQueryError) {
    return <Box>{linksQueryError.message}</Box>
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
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
        onSubmit={() => handleSubmit(onSubmit)}
      >
        <span className="text-gray-700">Title</span>
        <input
          placeholder="Title"
          {...register('title', { required: true })}
          name="title"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />

        <span className="text-gray-700">Description</span>
        <input
          placeholder="Description"
          {...register('description', { required: true })}
          name="description"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />

        <span className="text-gray-700">Url</span>
        <input
          placeholder="https://example.com"
          {...register('url', { required: true })}
          name="url"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />

        <span className="text-gray-700">Category</span>
        <input
          placeholder="Name"
          {...register('category', { required: true })}
          name="category"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />

        <button
          disabled={loading}
          type="submit"
          className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-6 h-6 animate-spin mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              Creating...
            </span>
          ) : (
            <span>Create Link</span>
          )}
        </button>
      </form>
    </VStack>
  )
}
