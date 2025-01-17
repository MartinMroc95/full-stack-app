import React from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Heading,
  HStack,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import type { Car } from '@prisma/client'
import EditForm from 'components/EditForm'
import FormField from 'components/FormField'
import LabeledValue from 'components/LabeledValue'
import { carSchema, formFields } from './constants'

const GetUserCarsQuery = gql`
  query allCarsQuery($first: Int, $after: String) {
    cars(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          brand
          model
          year
          mileage
          fuelType
          enginePower
          price
          description
        }
      }
    }
  }
`

const CreateCarMutation = gql`
  mutation addCar(
    $brand: String!
    $model: String!
    $year: Int!
    $mileage: Int!
    $fuelType: String!
    $enginePower: Int!
    $price: Int!
    $description: String!
  ) {
    addCar(
      brand: $brand
      model: $model
      year: $year
      mileage: $mileage
      fuelType: $fuelType
      enginePower: $enginePower
      price: $price
      description: $description
    ) {
      brand
    }
  }
`
const RemoveCarMutation = gql`
  mutation removeCar($id: String!) {
    removeCar(id: $id) {
      id
    }
  }
`

const UpdateCarMutation = gql`
  mutation updateCar(
    $id: String!
    $brand: String!
    $model: String!
    $year: Int!
    $mileage: Int!
    $fuelType: String!
    $enginePower: Int!
    $price: Int!
    $description: String!
  ) {
    updateCar(
      id: $id
      brand: $brand
      model: $model
      year: $year
      mileage: $mileage
      fuelType: $fuelType
      enginePower: $enginePower
      price: $price
      description: $description
    ) {
      id
      brand
      model
      year
      mileage
      fuelType
      enginePower
      price
      description
    }
  }
`

type CarData = {
  cars: {
    pageInfo: { endCursor: string; hasNextPage: boolean }
    edges: Array<{ node: Car }>
  }
}

type FormValues = {
  brand: string
  model: string
  year: number
  mileage: number
  fuelType: string
  enginePower: number
  price: number
  description?: string
}

export const Main = () => {
  const toast = useToast()
  const [editingId, setEditingId] = React.useState<string | null>(null)

  const {
    reset: createCarReset,
    register: createCarRegister,
    handleSubmit: createCarHandleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(carSchema),
    mode: 'onSubmit',
  })

  const {
    data: carsData,
    loading: isCarsQueryLoading,
    error: carsQueryError,
    fetchMore: fetchMoreCars,
  } = useQuery<CarData>(GetUserCarsQuery, {
    variables: { first: 2 },
  })

  const [updateCar] = useMutation(UpdateCarMutation, {
    onCompleted: () => {
      setEditingId(null)
      toast({
        title: 'Car has been updated successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
    },
    onError: (error) => {
      console.error('error', error)
      toast({
        title: 'Error!',
        description: 'Something went wrong while updating the car',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
    },
  })

  const [removeCar] = useMutation(RemoveCarMutation, {
    onCompleted: () => {
      toast({
        title: 'Car has been removed successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
    },
    onError: (error) => {
      console.error('error', error)
      toast({
        title: 'Error!',
        description: 'Something went wrong while removing the car',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
    },
    refetchQueries: [{ query: GetUserCarsQuery, variables: { first: 2 } }],
  })

  const [createCar, { loading: isCarLoading }] = useMutation(CreateCarMutation, {
    onCompleted: () => createCarReset(),
    refetchQueries: [{ query: GetUserCarsQuery, variables: { first: 2 } }],
  })

  const onCreateCarSubmit = async (carData: FormValues) => {
    const { brand, model, year, mileage, fuelType, enginePower, price, description } = carData
    const variables = {
      brand,
      model,
      year,
      mileage,
      fuelType,
      enginePower,
      price,
      description,
    }
    try {
      const response = await createCar({ variables })
      if (response.data) {
        toast({
          title: 'Car has been created successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        })
      }
    } catch (error) {
      console.error('error', error)
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

  if (isCarLoading) {
    return (
      <Center w="full" h="full">
        <Spinner size="md">Loading...</Spinner>
      </Center>
    )
  }

  const { endCursor, hasNextPage } = carsData?.cars.pageInfo || {}

  return (
    <HStack overflowY="auto" w="full" h="full" p="20px" spacing={10}>
      <VStack alignItems="flex-start" justifyContent="flex-start" w="300px" h="full">
        <Heading size="lg">Add Car</Heading>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            void createCarHandleSubmit(onCreateCarSubmit)(event)
          }}
        >
          <VStack alignItems="flex-start" w="full" pb="20px" spacing="5px">
            {formFields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                register={createCarRegister}
                error={errors[field.name as keyof FormValues]}
                type={field.type}
              />
            ))}
            <Button w="full" mt="10px" colorScheme="blue" disabled={isCarLoading} type="submit">
              {isCarLoading ? <Text>Creating...</Text> : <Text>Add Car</Text>}
            </Button>
          </VStack>
        </form>
      </VStack>
      {isCarsQueryLoading && (
        <Center w="full" h="full">
          <Spinner size="md">Loading...</Spinner>
        </Center>
      )}
      {!isCarsQueryLoading && carsQueryError && <Box>{carsQueryError.message}</Box>}
      {!isCarsQueryLoading && !carsQueryError && carsData && (
        <VStack alignItems="flex-start" justifyContent="flex-start" w="full" h="full">
          <Heading size="lg">Yours Cars</Heading>
          <HStack flexWrap="wrap" gap="10px" w="full">
            {carsData?.cars.edges.map(({ node }) => (
              <Card key={node.id} w="full">
                <CardBody>
                  {editingId === node.id ? (
                    <EditForm
                      car={node}
                      onSubmit={(data) => {
                        void updateCar({
                          variables: {
                            id: editingId,
                            ...data,
                          },
                        })
                      }}
                      onCancelClick={() => setEditingId(null)}
                      schema={carSchema}
                    />
                  ) : (
                    <VStack alignItems="flex-start" spacing="5px">
                      <HStack alignItems="flex-start" spacing="10px">
                        {formFields.map(({ label, name }) => (
                          <LabeledValue
                            key={name}
                            label={label}
                            value={node[name as keyof Car] as string | number}
                          />
                        ))}
                      </HStack>
                      <HStack>
                        <Button onClick={() => setEditingId(node.id)} size="sm">
                          Edit
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            void removeCar({ variables: { id: node.id } })
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Remove
                        </Button>
                      </HStack>
                    </VStack>
                  )}
                </CardBody>
              </Card>
            ))}
          </HStack>
          {hasNextPage ? (
            <Button
              mt="10px"
              isLoading={isCarsQueryLoading}
              onClick={() => {
                void fetchMoreCars({
                  variables: { after: endCursor },
                  updateQuery: (prevResult, { fetchMoreResult }) => ({
                    cars: {
                      pageInfo: fetchMoreResult.cars.pageInfo,
                      edges: [...prevResult.cars.edges, ...fetchMoreResult.cars.edges],
                    },
                  }),
                })
              }}
            >
              Load More
            </Button>
          ) : (
            <Text>{`You've reached the end!`}</Text>
          )}
        </VStack>
      )}
    </HStack>
  )
}
