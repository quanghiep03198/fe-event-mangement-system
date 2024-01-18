import { cn } from '@/common/utils/cn'
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import {
   Button,
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormMessage,
   Icon,
   Label,
   Popover,
   PopoverContent,
   PopoverTrigger,
   ScrollArea
} from '..'

type ComboboxFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & {
   form: UseFormReturn<T>
   onInput?: (value: string) => unknown
   onSelect?: (value: string) => unknown
   options: Array<{
      label: string
      value: PathValue<T, Path<T>>
   }>
}

export function ComboboxFieldControl<T extends FieldValues>(props: ComboboxFieldControlProps<T>) {
   const { form, name, control, options, label, description, placeholder, layout, hidden, onInput, onSelect } = props

   return (
      <FormField
         name={name}
         control={control}
         render={({ field }) => {
            return (
               <FormItem className={cn({ hidden, 'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': layout === 'horizontal' })}>
                  {label && <Label>{label}</Label>}
                  <FormControl>
                     <Popover>
                        <PopoverTrigger asChild>
                           <FormControl>
                              <Button variant='outline' role='combobox' className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                                 {field.value ? options.find((option) => option.value === field.value)?.label : placeholder}
                                 <Icon name='ChevronsUpDown' />
                              </Button>
                           </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                           <Command>
                              <CommandInput
                                 placeholder={placeholder}
                                 className='h-9'
                                 onInput={(e) => {
                                    if (onInput) onInput(e.currentTarget.value)
                                 }}
                              />
                              <CommandEmpty>Không có dữ liệu</CommandEmpty>
                              <CommandGroup>
                                 <ScrollArea className='h-56'>
                                    {options.map((option) => (
                                       <CommandItem
                                          value={option.label}
                                          key={option.value}
                                          onSelect={() => {
                                             form.setValue(name, option.value)
                                             if (onSelect) onSelect(option.value)
                                          }}
                                       >
                                          {option.label}
                                          <Icon name='Check' className={cn('ml-auto', option.value === field.value ? 'opacity-100' : 'opacity-0')} />
                                       </CommandItem>
                                    ))}
                                 </ScrollArea>
                              </CommandGroup>
                           </Command>
                        </PopoverContent>
                     </Popover>
                  </FormControl>
                  {description && <FormDescription>{description}</FormDescription>}
                  <FormMessage />
               </FormItem>
            )
         }}
      />
   )
}

export default ComboboxFieldControl
