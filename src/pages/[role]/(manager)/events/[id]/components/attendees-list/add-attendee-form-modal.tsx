import { UserInterface } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
   Button,
   ComboboxFieldControl,
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   Form,
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
   ScrollArea,
   Box,
   Avatar,
   AvatarImage,
   AvatarFallback,
   Typography
} from '@/components/ui'

import { useAddAttendanceMutation } from '@/redux/apis/attendance.api'
import { useGetUsersQuery } from '@/redux/apis/user.api'
import { AddUserSchema } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type AddAttendeeFormModalProps = {
   open: boolean
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

type FormValue = z.infer<typeof AddUserSchema>

const AddAttendeeFormModal: React.FC<AddAttendeeFormModalProps> = (props) => {
   const form = useForm<FormValue>({ resolver: zodResolver(AddUserSchema) })
   const { id } = useParams()
   const [searchTerm, setSearchTerm] = useState<string>('')
   const { data: users } = useGetUsersQuery({ pagination: false, search: searchTerm })
   const [addAttendee, { isLoading }] = useAddAttendanceMutation()
   const [selectedUser, setSelectedUser] = useState<UserInterface>()

   const handleAddAttendee = async (data: Required<FormValue>) => {
      toast.promise(addAttendee({ ...data, event_id: id! }).unwrap(), {
         loading: 'Vui lòng chờ trong giây lát ...',
         success: () => {
            form.reset()
            props.onOpenChange(false)
            return 'Đã thêm người dùng vào sự kiện'
         },
         error: (error) => {
            const errorResponse = error as ErrorResponse
            return errorResponse.data.message
         }
      })
   }

   const options = useMemo(() => {
      return (users as Array<UserInterface>) ?? []
   }, [users])

   return (
      <Dialog {...props}>
         <DialogContent>
            <DialogHeader className='text-left'>
               <DialogTitle>Thêm người tham gia</DialogTitle>
               <DialogDescription>Nhập các thông tin phía dưới để thêm sinh viên tham gia</DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <DialogForm onSubmit={form.handleSubmit(handleAddAttendee)}>
                  <FormField
                     name='email'
                     control={form.control}
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormControl>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                       <FormControl>
                                          <Button
                                             variant='outline'
                                             role='combobox'
                                             className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                                          >
                                             {field.value ? selectedUser.name : 'Chọn người tham gia'}
                                             <Icon name='ChevronsUpDown' />
                                          </Button>
                                       </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                       <Command>
                                          <CommandInput
                                             placeholder=''
                                             className='h-9'
                                             onInput={_.debounce((e) => {
                                                setSearchTerm(e.target.value)
                                             })}
                                          />
                                          <CommandEmpty>Không có dữ liệu</CommandEmpty>
                                          <CommandGroup>
                                             <ScrollArea className='h-56'>
                                                {options.map((option) => (
                                                   <CommandItem
                                                      value={option.email}
                                                      key={option.id}
                                                      onSelect={(value) => {
                                                         form.setValue('email', value)
                                                         setSelectedUser(option)
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
                                                      <Icon
                                                         name='Check'
                                                         className={cn('ml-auto', option.email === field.value ? 'opacity-100' : 'opacity-0')}
                                                      />
                                                   </CommandItem>
                                                ))}
                                             </ScrollArea>
                                          </CommandGroup>
                                       </Command>
                                    </PopoverContent>
                                 </Popover>
                              </FormControl>
                              <FormDescription>Người dùng được chọn sau khi thêm sẽ tham gia vào sự kiện</FormDescription>
                              <FormMessage />
                           </FormItem>
                        )
                     }}
                  />
                  <Button type='submit' className='gap-x-2'>
                     {isLoading ? <Icon name='ArrowUpCircle' className='animate-spin' /> : <Icon name='PlusCircle' />} Thêm
                  </Button>
               </DialogForm>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

const DialogForm = tw.form`flex flex-col items-stretch gap-y-6`

export default AddAttendeeFormModal
