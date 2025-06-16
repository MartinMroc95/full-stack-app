import { FieldError, UseFormRegister } from 'react-hook-form'
import { cn } from 'components/lib/utils'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Textarea } from 'components/ui/textarea'

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
    <div className="space-y-1" style={{ width }}>
      <Label htmlFor={name}>{label}</Label>
      {type === 'textarea' ? (
        <Textarea
          {...inputProps}
          id={name}
          name={name}
          placeholder={placeholder}
          className={cn(error ? 'border-red-500' : '', 'focus:border-primary focus:ring-primary')}
        />
      ) : (
        <Input
          {...inputProps}
          id={name}
          defaultValue={value}
          name={name}
          placeholder={placeholder}
          type={type}
          className={cn(
            error ? 'border-red-500' : '',
            'focus:border-blue-400  focus:shadow-blue-400 focus:shadow-[0_0_0_1px_blue-400]',
          )}
        />
      )}
      {error && <p className="text-sm font-medium text-red-500">{error.message}</p>}
    </div>
  )
}
