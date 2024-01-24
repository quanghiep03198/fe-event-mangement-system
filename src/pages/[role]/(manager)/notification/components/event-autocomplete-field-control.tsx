import { EventInterface } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
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
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
   Icon,
   Label,
   Popover,
   PopoverContent,
   PopoverTrigger,
   ScrollArea,
   Typography
} from '@/components/ui'
import { useGetEventsQuery } from '@/redux/apis/event.api'
import React, { memo, useMemo, useState } from 'react'
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'

interface EventAutoCompleteFieldControlProps<T extends FieldValues> extends BaseFieldControl<T> {
   form: UseFormReturn<T>
}

function EventAutoCompleteFieldControl<T>(props: EventAutoCompleteFieldControlProps<T>) {
   const { form, name, label, placeholder, description } = props

   const [eventSearchTerm, setEventSearchTerm] = useState<string>('')
   const events = useGetEventsQuery(
      { page: 1, limit: 10, search: eventSearchTerm },
      { selectFromResult: ({ data }) => (data as Pagination<EventInterface>)?.docs ?? [] }
   )

   const options = useMemo(() => {
      return Array.isArray(events) ? events.map((item) => ({ label: item.name, value: String(item.id) as PathValue<T, Path<T>> })) : []
   }, [events])

   return (
      <FormField
         name={name}
         control={form.control}
         render={({ field }) => {
            return (
               <FormItem>
                  {label && <Label>{label}</Label>}
                  <FormControl>
                     <Popover>
                        <PopoverTrigger asChild>
                           <FormControl>
                              <HoverCard>
                                 <HoverCardTrigger asChild type='button'>
                                    <Button variant='outline' role='combobox' className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                                       {field.value ? options.find((option) => option.value === field.value)?.label : placeholder}
                                       <Icon name='ChevronsUpDown' />
                                    </Button>
                                 </HoverCardTrigger>
                                 <HoverCardContent></HoverCardContent>
                              </HoverCard>
                           </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-full p-0' align='start'>
                           <Command>
                              <CommandInput
                                 placeholder={placeholder}
                                 className='h-9'
                                 onInput={(e) => {
                                    setEventSearchTerm(e.currentTarget.value)
                                 }}
                              />
                              <CommandEmpty>Không có dữ liệu</CommandEmpty>
                              <CommandGroup>
                                 <ScrollArea className='flex h-56 flex-col items-stretch gap-y-px'>
                                    {options.map((option) => (
                                       <CommandItem
                                          key={option.value as string}
                                          value={option.label}
                                          className='line-clamp-1 flex items-center gap-x-4'
                                          onSelect={() => {
                                             form.setValue(name, option.value as PathValue<T, Path<T>>)
                                          }}
                                       >
                                          <Typography variant='small' className='flex-1'>
                                             {option.label}
                                          </Typography>
                                          <Icon name='Check' className={cn(option.value === field.value ? 'opacity-100' : 'opacity-0')} />
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

export default memo(EventAutoCompleteFieldControl)
