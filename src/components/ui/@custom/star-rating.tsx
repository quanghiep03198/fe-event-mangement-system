import React, { useState } from 'react'
import { ControllerRenderProps, FieldValues, Path, PathValue } from 'react-hook-form'
import { FormItem, Icon, Label, RadioGroup, RadioGroupItem } from '..'

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

function StarRatingRadioGroup<T extends FieldValues>({ field, ...props }: StarRatingRadioGroupProps<T>) {
   const [value, setValue] = useState<string>(() => (field?.value as string) ?? props.defaultValue ?? '5')

   return (
      <RadioGroup
         {...props}
         className='relative inline-flex items-center gap-x-1'
         onValueChange={(value) => {
            setValue(value)
            if (field) field.onChange(value)
         }}
      >
         {ratingValues.map((item) => (
            <FormItem key={item.id}>
               <Label htmlFor={item.id}>
                  <RadioGroupItem value={item.value} className='hidden' id={item.id} />
                  <Icon stroke='hsl(var(--primary))' name='Star' fill={+value >= +item.value ? 'hsl(var(--primary))' : 'hsl(var(--background))'} />
               </Label>
            </FormItem>
         ))}
      </RadioGroup>
   )
}

export default StarRatingRadioGroup
