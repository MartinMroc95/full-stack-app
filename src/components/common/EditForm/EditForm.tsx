import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Car } from '@prisma/client'
import { AnyObject, ObjectSchema } from 'yup'
import { FormField } from 'components/common/FormField/FormField'
import { Button } from 'components/ui/button'

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
  schema: ObjectSchema<FormValues, AnyObject, unknown, ''>
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
      <div className="flex flex-col space-y-4 w-full">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2.5">
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
          </div>
          <div className="flex space-x-2">
            <Button disabled={!isDirty} type="submit">
              Done
            </Button>
            <Button variant="outline" onClick={onCancelClick}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
