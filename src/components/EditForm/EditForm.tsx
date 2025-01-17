import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, HStack, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Car } from '@prisma/client'
import { AnyObject, ObjectSchema } from 'yup'
import { FormField } from 'components/FormField/FormField'

const formFields = [
  { name: 'brand', label: 'Brand', type: 'text' },
  { name: 'model', label: 'Model', type: 'text' },
  { name: 'year', label: 'Year', type: 'number' },
  { name: 'mileage', label: 'Mileage', type: 'number' },
  { name: 'fuelType', label: 'Fuel Type', type: 'text' },
  { name: 'enginePower', label: 'Engine Power', type: 'number' },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'description', label: 'Description', type: 'textarea' },
] as const

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

interface EditFormProps {
  car: Car
  onSubmit: (data: FormValues) => void
  onCancelClick: () => void
  schema: ObjectSchema<FormValues, AnyObject, any, ''>
}

export const EditForm: React.FC<EditFormProps> = ({ car, onSubmit, onCancelClick, schema }) => {
  const {
    register: editFormRegister,
    handleSubmit: editFormHandleSubmit,
    formState: { errors: editFormErrors, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      ...car,
      description: car.description || undefined,
    },
  })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void editFormHandleSubmit(onSubmit)(event)
      }}
    >
      <VStack alignItems="flex-start" w="full" spacing={2}>
        <VStack alignItems="flex-start" spacing="10px">
          <HStack alignItems="flex-start" flexWrap="wrap" spacing="10px">
            {formFields.map(({ name, label, type }) => (
              <FormField
                key={name}
                label={label}
                name={name}
                placeholder={label}
                register={editFormRegister}
                error={editFormErrors[name]}
                type={type}
                value={car[name] ?? ''}
              />
            ))}
          </HStack>
          <HStack>
            <Button isDisabled={!isDirty} type="submit">
              Done
            </Button>
            <Button onClick={onCancelClick}>Cancel</Button>
          </HStack>
        </VStack>
      </VStack>
    </form>
  )
}
