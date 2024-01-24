import React, { HTMLInputTypeAttribute, forwardRef, memo, useId, useRef, useState } from 'react'
import { Control, ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '..'
import { Input, InputProps } from '../@shadcn/input'
import { cn } from '@/common/utils/cn'

export type InputFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & InputProps

export function InputFieldControl<T extends FieldValues>(
   props: InputFieldControlProps<T> & React.PropsWithoutRef<T> & React.RefAttributes<T>,
   ref: React.ForwardedRef<HTMLInputElement>
) {
   const { label, name, className, disabled, control, placeholder, description, id, type, hidden, layout, onChange, ...restProps } = props
   const localRef = useRef<typeof Input.prototype>(null)
   const resolvedRef = (ref ?? localRef) as typeof localRef
   const localId = useId()
   const [value, setValue] = useState<string>('')

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<T, Path<T>>) => {
      if (onChange) onChange(e)
      if (type === 'file') {
         setValue(e.target.value)
         field.onChange(e.target.files)
      } else {
         field.onChange(e)
      }
   }

   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => {
            return (
               <FormItem className={cn({ hidden, 'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': layout === 'horizontal' })}>
                  {label && <FormLabel htmlFor={id ?? localId}>{label}</FormLabel>}
                  <FormControl>
                     <Input
                        {...field}
                        id={id ?? localId}
                        value={type === 'file' ? value : field.value}
                        placeholder={placeholder}
                        ref={(e) => {
                           field.ref(e)
                           if (resolvedRef) resolvedRef.current = e
                        }}
                        disabled={disabled}
                        type={type ?? 'text'}
                        onChange={(e) => handleChange(e, field)}
                        className={className}
                        {...restProps}
                     />
                  </FormControl>
                  {description && <FormDescription>{description}</FormDescription>}
                  <FormMessage />
               </FormItem>
            )
         }}
      />
   )
}

InputFieldControl.displayName = 'InputFieldControl'

export const ForwardedRefInputFieldControl = memo(forwardRef<HTMLInputElement, InputFieldControlProps<any>>(InputFieldControl))
