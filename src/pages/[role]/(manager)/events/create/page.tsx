import { Paths } from '@/common/constants/pathnames'
import { cn } from '@/common/utils/cn'
import {
   Box,
   Button,
   DatePickerFieldControl,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Icon,
   Image,
   Input,
   InputFieldControl,
   Label,
   Typography,
   buttonVariants
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@hook-form/editor-field-control'
import { useCreateEventMutation } from '@/redux/apis/event.api'
import { useAppSelector } from '@/redux/hook'
import { CreateEventSchema } from '@/schemas/event.schema'
import { Cloudinary } from '@/services/cloudinary.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

type FormValue = z.infer<typeof CreateEventSchema>

const CreateEventPage = () => {
   const form = useForm<FormValue>({ resolver: zodResolver(CreateEventSchema) })
   const [createEvent, { isLoading }] = useCreateEventMutation()
   const navigate = useNavigate()
   const user = useAppSelector((state) => state.auth.user)
   const [image, setImage] = useState<string>('')
   const [fileValue, setFileValue] = useState<string>('')

   console.log(image)

   const handleCreateEvent = async (data: FormValue) => {
      const banner = await Cloudinary.upload(data.banner[0])

      toast.promise(createEvent({ ...data, banner, user_id: user?.id }).unwrap(), {
         loading: 'Đang tạo sự kiện ...',
         success: () => {
            navigate(Paths.EVENTS_LIST)
            return 'Sự kiện đã được tạo thành công'
         },
         error: 'Tạo sự kiện thất bại'
      })
   }

   return (
      <Form {...form}>
         <form className='flex max-w-4xl flex-col gap-y-14 sm:max-w-full' onSubmit={form.handleSubmit(handleCreateEvent)}>
            <Box className='flex items-center justify-between border-b py-4'>
               <Box className='space-y-2'>
                  <Typography variant='h6'>Thêm sự kiện</Typography>
                  <p className='text-sm text-muted-foreground'>Nhập thông tin để đăng tải sự kiện</p>
               </Box>
               <Label
                  htmlFor='submit'
                  className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'gap-x-2 sm:hidden', { 'pointer-events-none opacity-50': isLoading })}
               >
                  <Icon name='CheckCircle' />
                  Lưu
               </Label>
            </Box>

            <Box className='space-y-10'>
               <Box className='grid grid-cols-6 gap-x-6 gap-y-10 sm:grid-cols-1 sm:gap-x-0'>
                  <Box className='col-span-full w-full'>
                     <InputFieldControl name='name' control={form.control} label='Tên sự kiện' />
                  </Box>
                  <Box className='col-span-full w-full'>
                     <InputFieldControl name='contact' control={form.control} label='Số điện thoại liên hệ' />
                  </Box>
                  <Box className='col-span-full w-full'>
                     <InputFieldControl name='location' control={form.control} label='Địa điểm tổ chức' />
                  </Box>
                  <Box className='col-span-3'>
                     <DatePickerFieldControl name='start_time' control={form.control} label='Ngày bắt đầu' />
                  </Box>
                  <Box className='col-span-3'>
                     <DatePickerFieldControl name='end_time' control={form.control} label='Ngày kết thúc' />
                  </Box>
                  <Box className='col-span-full space-y-2'>
                     <FormField
                        name='banner'
                        control={form.control}
                        render={({ field }) => (
                           <Fragment>
                              <FormLabel> Ảnh bìa</FormLabel>
                              <FormItem className='group relative h-80 w-[inherit] overflow-clip rounded-lg'>
                                 <Label
                                    htmlFor='file'
                                    className='absolute inset-0 z-10 flex h-full w-full cursor-pointer items-center justify-center bg-neutral-950/50 bg-opacity-50 text-primary-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100'
                                 >
                                    <Icon name='Camera' size={32} strokeWidth={1} className='translate-y-2 duration-200 group-hover:translate-y-0' />
                                 </Label>
                                 <Image src={image} className='absolute inset-0 h-full w-full object-cover object-center' width='100%' height={320} />
                                 <FormControl>
                                    <Input
                                       {...field}
                                       value={fileValue}
                                       id='file'
                                       type='file'
                                       className='hidden'
                                       onChange={(e) => {
                                          setFileValue(e.target.value)
                                          field.onChange(e.target.files)
                                          setImage(URL.createObjectURL(e.target.files?.[0]!))
                                       }}
                                    />
                                 </FormControl>
                              </FormItem>
                              <FormMessage />
                           </Fragment>
                        )}
                     />
                  </Box>
                  <Box className='col-span-full'>
                     <EditorFieldControl name='content' form={form} label='Nội dung' />
                  </Box>
               </Box>

               <Button type='submit' id='submit' disabled={isLoading} className='hidden w-full sm:inline-flex'>
                  Lưu
               </Button>
            </Box>
         </form>
      </Form>
   )
}

export default CreateEventPage
