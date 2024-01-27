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
   Typography
} from '@/components/ui'
import { useGetUserInformationQuery, useGetUsersQuery } from '@/redux/apis/user.api'

import { debounce } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { FieldValues, Path, PathValue, UseFormReturn, useWatch } from 'react-hook-form'

interface UserComboboxFieldControlProps<T extends FieldValues> extends BaseFieldControl<T> {
   form: UseFormReturn<T>
   path?: keyof UserInterface
   restrictRole?: UserRoleEnum
}

function UserComboboxFieldControl<T>(props: UserComboboxFieldControlProps<T>) {
   const { form, name, label, placeholder, description, path, restrictRole } = props
   const selectedUserId = useWatch({ name, control: form.control })
   const [searchTerm, setSearchTerm] = useState<string>('')
   const { data: usersList } = useGetUsersQuery({ limit: 5, email: searchTerm, role: restrictRole }, { refetchOnMountOrArgChange: true })
   const { data: selectedUser } = useGetUserInformationQuery(String(selectedUserId), { skip: !selectedUserId })

   const userListOptions = useMemo(() => {
      return (usersList as Pagination<UserInterface>)?.docs ?? []
   }, [usersList])

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
                                 {field.value ? selectedUser?.name : placeholder}
                                 <Icon name='ChevronsUpDown' />
                              </Button>
                           </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='p-0' align='start'>
                           <Command shouldFilter={false} defaultValue={String(form.getValues(name))}>
                              <CommandInput className='h-9' placeholder={placeholder} onInput={debounce((e) => setSearchTerm(e.target.value), 500)} />
                              <CommandEmpty>Không có dữ liệu.</CommandEmpty>
                              <CommandGroup>
                                 {Array.isArray(userListOptions) &&
                                    userListOptions.map((option) => {
                                       return (
                                          <CommandItem
                                             id={String(option.id)}
                                             key={option?.id}
                                             className='items-start gap-x-2'
                                             value={String(option[path])}
                                             onSelect={() => {
                                                field.onChange(option[path])
                                                form.setValue(name, option[path] as PathValue<T, Path<T>>)
                                             }}
                                          >
                                             <Avatar className='h-8 w-8'>
                                                <AvatarImage src={option?.avatar} />
                                                <AvatarFallback>A</AvatarFallback>
                                             </Avatar>
                                             <Box className='space-y-1'>
                                                <Typography variant='small'>{option?.name}</Typography>
                                                <Typography variant='small' className='text-xs' color='muted'>
                                                   {option?.email}
                                                </Typography>
                                             </Box>
                                             <Icon name='Check' className={cn('ml-auto', option[path] === field.value ? 'visible' : 'invisible')} />
                                          </CommandItem>
                                       )
                                    })}
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
