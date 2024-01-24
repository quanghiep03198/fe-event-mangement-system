import { UserRoleEnum } from '@/common/constants/enums'
import { UserInterface } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
   Box,
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
   FormLabel,
   FormMessage,
   Icon,
   Popover,
   PopoverContent,
   PopoverTrigger,
   ScrollArea,
   Typography
} from '@/components/ui'
import { useGetUserInformationQuery, useGetUsersQuery } from '@/redux/apis/user.api'
import { debounce } from 'lodash'
import { useState } from 'react'
import { Control, FieldValues, Path, PathValue, UseFormReturn, useWatch } from 'react-hook-form'

interface UserComboboxFieldControlProps<T extends FieldValues> extends BaseFieldControl<T> {
   form: UseFormReturn<T>
   path?: keyof UserInterface
   restrictRole?: UserRoleEnum
}

function UserComboboxFieldControl<T>(props: UserComboboxFieldControlProps<T>) {
   const { name, label, form, description, path, restrictRole } = props

   const selectedUserId = useWatch({ name: name, control: form.control })
   const [searchTerm, setSearchTerm] = useState<string>('')
   const { data: users } = useGetUsersQuery({ pagination: false, search: searchTerm, role: restrictRole })
   const { data: selectedUser } = useGetUserInformationQuery(String(selectedUserId))

   return (
      <FormField
         name={name}
         control={form.control}
         render={({ field }) => {
            return (
               <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                     <Popover>
                        <PopoverTrigger asChild>
                           <FormControl>
                              <Button variant='outline' role='combobox' className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
                                 {field.value ? selectedUser?.name : 'Chọn người tổ chức'}
                                 <Icon name='ChevronsUpDown' />
                              </Button>
                           </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                           <Command>
                              <CommandInput
                                 placeholder='Tìm người dùng ...'
                                 className='h-9'
                                 onInput={debounce((e) => {
                                    setSearchTerm(e.target.value)
                                 })}
                              />
                              <CommandEmpty>Không có dữ liệu</CommandEmpty>
                              <CommandGroup>
                                 <ScrollArea className='h-56'>
                                    {Array.isArray(users) &&
                                       users?.map((option) => (
                                          <CommandItem
                                             value={String(option[path])}
                                             key={option.id}
                                             onSelect={(value) => {
                                                form.setValue(name, value as PathValue<T, Path<T>>)
                                             }}
                                          >
                                             <Box className='flex items-start gap-x-4'>
                                                <Avatar className='h-8 w-8'>
                                                   <AvatarImage src={option.avatar} />
                                                   <AvatarFallback>A</AvatarFallback>
                                                </Avatar>
                                                <Box className='space-y-1'>
                                                   <Typography variant='small'>{option.name}</Typography>
                                                   <Typography variant='small' className='text-xs' color='muted'>
                                                      {option.email}
                                                   </Typography>
                                                </Box>
                                             </Box>
                                             <Icon name='Check' className={cn('ml-auto', option.email === field.value ? 'opacity-100' : 'opacity-0')} />
                                          </CommandItem>
                                       ))}
                                 </ScrollArea>
                              </CommandGroup>
                           </Command>
                        </PopoverContent>
                     </Popover>
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
               </FormItem>
            )
         }}
      />
   )
}

export default UserComboboxFieldControl
