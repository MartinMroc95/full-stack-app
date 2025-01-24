import * as yup from 'yup'

export const formFields = [
  {
    label: 'Brand',
    name: 'brand',
    placeholder: 'e.g. BMW',
    type: 'text',
  },
  {
    label: 'Model',
    name: 'model',
    placeholder: 'e.g. M3',
    type: 'text',
  },
  {
    label: 'Year',
    name: 'year',
    placeholder: 'e.g. 2020',
    type: 'number',
  },
  {
    label: 'Mileage',
    name: 'mileage',
    placeholder: 'e.g. 50000',
    type: 'number',
  },
  {
    label: 'Fuel Type',
    name: 'fuelType',
    placeholder: 'e.g. diesel',
    type: 'text',
  },
  {
    label: 'Engine Power (kW)',
    name: 'enginePower',
    placeholder: 'e.g. 180',
    type: 'number',
  },
  {
    label: 'Price (€)',
    name: 'price',
    placeholder: 'e.g. 25000',
    type: 'number',
  },
  {
    label: 'Description',
    name: 'description',
    placeholder: 'Additional vehicle description...',
    type: 'textarea',
  },
]

export const carSchema = yup.object().shape({
  brand: yup.string().required('Brand is required'),
  model: yup.string().required('Model is required'),
  year: yup
    .number()
    .typeError('Year is required')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .required('Year is required'),
  mileage: yup
    .number()
    .typeError('Mileage is required')
    .min(0, 'Mileage cannot be negative')
    .required('Mileage is required'),
  fuelType: yup.string().required('Fuel type is required'),
  enginePower: yup
    .number()
    .typeError('Engine power is required')
    .positive('Power must be positive')
    .required('Engine power is required'),
  price: yup
    .number()
    .typeError('Price is required')
    .positive('Price must be positive')
    .required('Price is required'),
  description: yup.string().min(10, 'Description must be at least 10 characters'),
})
