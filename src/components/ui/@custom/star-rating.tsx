import React, { useEffect, useMemo, useState } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { FormItem, Icon, Label, RadioGroup, RadioGroupItem } from '..'
import { cn } from '@/common/utils/cn'

type StarRatingRadioGroupProps<T extends FieldValues> = {
   field?: ControllerRenderProps<T, any>
} & React.ComponentProps<typeof RadioGroup>

const ratingValues = [
   { id: 'rate-1', value: '1' },
   { id: 'rate-2', value: '2' },
   { id: 'rate-3', value: '3' },
   { id: 'rate-4', value: '4' },
   { id: 'rate-5', value: '5' }
]

function StarRatingRadioGroup<T extends FieldValues>({ field, defaultValue, disabled, onValueChange, ...props }: StarRatingRadioGroupProps<T>) {
   const [value, setValue] = useState<string>('0')

   useEffect(() => {
      if (field) setValue(field.value)
      else if (defaultValue) setValue(defaultValue)
      else setValue('0')
   }, [field, defaultValue])

   return (
      <RadioGroup
         {...props}
         disabled={disabled}
         defaultValue={defaultValue}
         className='relative inline-flex items-center gap-x-1'
         onValueChange={(value) => {
            setValue(value)
            if (onValueChange) onValueChange(value)
            if (field) field.onChange(value)
         }}
      >
         {ratingValues.map((item) => (
            <FormItem key={item.id}>
               <Label htmlFor={item.id} className={cn(disabled ? 'cursor-default' : 'cursor-pointer')}>
                  <RadioGroupItem value={item.value} className='hidden' id={item.id} />
                  <Icon
                     className='transition-colors duration-200 ease-in-out'
                     stroke='hsl(var(--primary))'
                     name='Star'
                     fill={+value >= +item.value ? 'hsl(var(--primary))' : 'hsl(var(--background))'}
                  />
               </Label>
            </FormItem>
         ))}
      </RadioGroup>
   )
}

export default StarRatingRadioGroup
