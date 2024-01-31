import React, { useEffect, useId, useState } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { FormItem, Icon, Label, RadioGroup, RadioGroupItem } from '..'
import { cn } from '@/common/utils/cn'

type StarRatingRadioGroupProps<T extends FieldValues> = {
   field?: ControllerRenderProps<T, any>
} & React.ComponentProps<typeof RadioGroup>

function StarRatingRadioGroup<T extends FieldValues>({ field, defaultValue, disabled, onValueChange, ...props }: StarRatingRadioGroupProps<T>) {
   const [value, setValue] = useState<string>('0')

   const ratingValues = [
      { id: useId(), value: '1' },
      { id: useId(), value: '2' },
      { id: useId(), value: '3' },
      { id: useId(), value: '4' },
      { id: useId(), value: '5' }
   ]

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
