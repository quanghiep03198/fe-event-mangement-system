import { cn } from '@/common/utils/cn'
import React from 'react'
import { FieldValues, Path, PathValue } from 'react-hook-form'
import { FormDescription, FormField, FormItem, FormLabel, FormMessage, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '..'

export type SelectFieldControlProps<T extends FieldValues> = BaseFieldControl<T> &
   React.ComponentProps<typeof Select> & {
      options: Array<{
         label: string
         value: PathValue<T, Path<T>>
      }>
   }

export function SelectFieldControl<T extends FieldValues>(props: SelectFieldControlProps<T>) {
   const { control, name, hidden, layout, className, defaultValue, placeholder, onValueChange, ...restProps } = props

   return (
      <FormField
         name={name!}
         control={control}
         render={({ field }) => {
            return (
               <FormItem className={cn({ hidden, 'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': layout === 'horizontal' })}>
                  <FormLabel>{props.label}</FormLabel>
                  <Select
                     {...field}
                     defaultValue={defaultValue ?? String(field.value)}
                     onValueChange={(value) => {
                        field.onChange(value)
                        if (onValueChange) {
                           onValueChange(value)
                        }
                     }}
                     {...restProps}
                  >
                     <SelectTrigger className={className}>
                        <SelectValue placeholder={placeholder} />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectGroup>
                           {Array.isArray(props.options) &&
                              props.options.map((option) => (
                                 <SelectItem key={option?.value} value={String(option?.value)}>
                                    {option?.label}
                                 </SelectItem>
                              ))}
                        </SelectGroup>
                     </SelectContent>
                  </Select>
                  {props.description && <FormDescription>{props.description}</FormDescription>}
                  <FormMessage />
               </FormItem>
            )
         }}
      />
   )
}

SelectFieldControl.displayName = 'SelectFieldControl'
SelectFieldControl.defaultProps = {
   placeholder: 'Select...'
}
