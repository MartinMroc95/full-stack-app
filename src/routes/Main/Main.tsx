import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0/client'
import { yupResolver } from '@hookform/resolvers/yup'
import type { Car } from '@prisma/client'
// import type { Car } from '@prisma/client'
import { toast } from 'sonner'
import {
  CreateCarMutation,
  GetUserCarsQuery,
  RemoveCarMutation,
  UpdateCarMutation,
} from 'src/graphql/cars'
import EditForm from 'components/common/EditForm'
import FormField from 'components/common/FormField'
import LabeledValue from 'components/common/LabeledValue'
import { Button } from 'components/ui/button'
import { Card, CardContent } from 'components/ui/card'
import { carSchema, formFields } from './constants'

type CarsQueryResponse = {
  cars: {
    pageInfo: { endCursor: string; hasNextPage: boolean }
    edges: Array<{ cursor: string; node: Car }>
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
  const { user } = useUser()
  const [editingId, setEditingId] = React.useState<string | null>(null)
  console.log('user', user)
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
  } = useQuery<CarsQueryResponse>(GetUserCarsQuery, {
    variables: { first: 2 },
  })

  const [updateCar] = useMutation(UpdateCarMutation, {
    onCompleted: () => {
      setEditingId(null)
      toast.success('Car has been updated successfully!')
    },
    onError: (error) => {
      console.error('error', error)
      toast.error('Something went wrong while updating the car')
    },
  })

  const [removeCar] = useMutation(RemoveCarMutation, {
    onCompleted: () => {
      toast.success('Car has been removed successfully!')
    },
    onError: (error) => {
      console.error('error', error)
      toast.error('Something went wrong while removing the car')
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
      console.log('response', response)
      if (response.data) {
        toast.success('Car has been created successfully!')
      }
    } catch (error) {
      console.error('error', error)
      toast.error('Something went wrong...')
    }
  }

  if (isCarLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent" />
      </div>
    )
  }

  const { endCursor, hasNextPage } = carsData?.cars.pageInfo || {}

  return (
    <div className="flex w-full p-5 gap-10">
      <div className="flex flex-col items-start justify-start w-[250px] h-full">
        <h1 className="text-3xl font-bold mb-4">Add Car</h1>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            void createCarHandleSubmit(onCreateCarSubmit)(event)
          }}
        >
          <div className="flex flex-col items-start w-full pb-5 space-y-3">
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
            <Button className="w-full mt-2.5" disabled={isCarLoading} type="submit">
              {isCarLoading ? 'Creating...' : 'Add Car'}
            </Button>
          </div>
        </form>
      </div>
      {isCarsQueryLoading && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent" />
        </div>
      )}
      {!isCarsQueryLoading && carsQueryError && <div>{carsQueryError.message}</div>}
      {!isCarsQueryLoading && !carsQueryError && carsData && (
        <div className="flex flex-col items-start justify-start w-full h-full">
          <h1 className="text-3xl font-bold mb-4">Your Cars</h1>
          <div className="flex flex-wrap gap-2.5 w-full">
            {carsData?.cars.edges.map(({ node }) => (
              <Card className="w-full" key={`${node.id}-${node.brand}-${node.model}`}>
                <CardContent className="pt-6">
                  {editingId === node.id ? (
                    <EditForm
                      car={node}
                      onSubmit={(data: FormValues) => {
                        void updateCar({
                          variables: {
                            input: {
                              id: editingId,
                              ...data,
                            },
                          },
                        })
                      }}
                      onCancelClick={() => setEditingId(null)}
                      schema={carSchema}
                    />
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-wrap gap-2.5">
                        {formFields.map(({ label, name }) => (
                          <LabeledValue
                            key={name}
                            label={label}
                            value={node[name as keyof Car] as string | number}
                          />
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => setEditingId(node.id)} size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            void removeCar({ variables: { id: node.id } })
                          }}
                          size="sm"
                          variant="destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {hasNextPage ? (
            <Button
              className="mt-2.5"
              disabled={isCarsQueryLoading}
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
              {isCarsQueryLoading ? (
                <>
                  <span className="mr-2">Loading</span>
                  <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
                </>
              ) : (
                'Load More'
              )}
            </Button>
          ) : (
            <p className="pt-2 font-bold">{`You've reached the end!`}</p>
          )}
        </div>
      )}
    </div>
  )
}
