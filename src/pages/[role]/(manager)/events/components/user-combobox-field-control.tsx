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
import Tooltip from '@/components/ui/@override/tooltip'
import { useGetUserInformationQuery, useGetUsersQuery } from '@/redux/apis/user.api'

import { debounce } from 'lodash'
import { useMemo, useState } from 'react'
import { FieldValues, Path, PathValue, UseFormReturn, useWatch } from 'react-hook-form'

interface UserComboboxFieldControlProps<T extends FieldValues> extends BaseFieldControl<T> {
   form: UseFormReturn<T>
   path?: keyof UserInterface
   canReset?: boolean
   roles?: UserRoleEnum[]
}

function UserComboboxFieldControl<T>(props: UserComboboxFieldControlProps<T>) {
   const { form, name, label, placeholder, description, path, roles, canReset } = props

   const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
   const [searchTerm, setSearchTerm] = useState<string>('')
   const currentValue = useWatch({ name: name, control: form.control })
   const { data: usersList } = useGetUsersQuery({ limit: 5, email: searchTerm, role: roles.join(',') })
   const { data: selectedUser, isLoading } = useGetUserInformationQuery(!isNaN(+currentValue) ? +currentValue : +selectedUserId)

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
                  <Box className='flex items-center gap-x-2'>
                     <FormLabel>{label}</FormLabel>
                     {canReset && field.value && (
                        <Tooltip content='Đặt lại'>
                           <Button
                              variant='ghost'
                              size='icon'
                              onClick={(e) => {
                                 e.stopPropagation()
                                 form.setValue(name, undefined)
                              }}
                              className={cn('h-6 w-6 rounded-full text-muted-foreground')}
                           >
                              <Icon name='X' size={14} />
                           </Button>
                        </Tooltip>
                     )}
                  </Box>
                  <FormControl>
                     <Popover>
                        <PopoverTrigger asChild>
                           <FormControl>
                              <Button
                                 variant='outline'
                                 role='combobox'
                                 className={cn('w-full justify-between hover:bg-background', !field.value && 'text-muted-foreground')}
                              >
                                 <Typography variant='small' className='inline-flex items-center gap-x-1'>
                                    {field.value && !isLoading ? selectedUser?.name : placeholder}
                                 </Typography>
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
                                                setSelectedUserId(option.id)
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
