import { FieldError, UseFormRegister } from 'react-hook-form'
import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react'

interface FormFieldProps {
  error?: FieldError
  label: string
  name: string
  placeholder: string
  register: UseFormRegister<any>
  type?: string
  value?: string | number
  width?: string | number
}

export const FormField: React.FC<FormFieldProps> = ({
  error,
  label,
  name,
  placeholder,
  register,
  value,
  type = 'text',
  width = '250px',
}) => {
  const inputProps = {
    ...register(name),
    defaultValue: value,
  }

  return (
    <FormControl w={width} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      {type === 'textarea' ? (
        <Textarea {...inputProps} name={name} placeholder={placeholder} />
      ) : (
        <Input
          {...inputProps}
          defaultValue={value}
          name={name}
          placeholder={placeholder}
          type={type}
        />
      )}
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  )
}
