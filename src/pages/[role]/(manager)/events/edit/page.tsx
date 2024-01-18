import { Paths } from '@/common/constants/pathnames'
import { cn } from '@/common/utils/cn'
import {
   Box,
   Button,
   DatePickerFieldControl,
   Editor,
   Form,
   FormMessage,
   Icon,
   Image,
   InputFieldControl,
   Label,
   Typography,
   buttonVariants
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@hook-form/editor-field-control'
import { useGetEventDetailsQuery, useUpdateEventMutation } from '@/redux/apis/event.api'
import { useAppSelector } from '@/redux/hook'
import { UpdateEventSchema } from '@/schemas/event.schema'
import { Cloudinary } from '@/services/cloudinary.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

type FormValue = z.infer<typeof UpdateEventSchema>

const EditEvent = () => {
   const { id } = useParams()
   const { data } = useGetEventDetailsQuery(id!)
   const navigate = useNavigate()
   const user = useAppSelector((state) => state.auth.user)
   const [image, setImage] = useState<string>('')
   const form = useForm<FormValue>({
      resolver: zodResolver(UpdateEventSchema)
   })

   const [updateEvent, { isLoading }] = useUpdateEventMutation()

   useEffect(() => {
      if (data) {
         form.reset({
            name: data.name,
            location: data.location,
            contact: data.contact,
            start_time: new Date(data.start_time),
            end_time: new Date(data.end_time)
         } as FormValue)

         setImage(data?.banner)
      }
   }, [data])

   const handleUpdateEvent = async (payload: FormValue) => {
      if (payload.banner instanceof FileList) payload.banner = await Cloudinary.upload(payload.banner[0])
      toast.promise(
         updateEvent({
            id,
            payload: {
               ...payload,
               user_id: user?.id,
               start_time: format(payload.start_time, 'yyyy/MM/dd HH:mm:ss'),
               end_time: format(payload.end_time, 'yyyy/MM/dd HH:mm:ss')
            }
         }).unwrap(),
         {
            loading: 'Đang cập nhật sự kiện ...',
            success: () => {
               navigate(Paths.EVENTS_LIST)
               return 'Sự kiện đã được cập nhật thành công'
            },
            error: 'Cập nhật sự kiện thất bại'
         }
      )
   }

   return (
      <Form {...form}>
         <form className='flex w-full max-w-4xl flex-col gap-y-14 sm:max-w-full' onSubmit={form.handleSubmit(handleUpdateEvent)}>
            <Box className='flex w-full items-center justify-between border-b py-4'>
               <Box className='space-y-2'>
                  <Typography variant='h6'>Cập nhật sự kiện</Typography>
                  <Typography variant='p' color='muted' className='text-sm'>
                     Nhập thông tin để cập nhật sự kiện
                  </Typography>
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
               <Box className='grid grid-cols-6 gap-y-10 sm:grid-cols-1'>
                  <Box className='col-span-full'>
                     <InputFieldControl name='name' control={form.control} label='Tên sự kiện' />
                  </Box>
                  <Box className='col-span-full'>
                     <InputFieldControl name='contact' control={form.control} label='Số điện thoại liên hệ' />
                  </Box>
                  <Box className='col-span-full'>
                     <InputFieldControl name='location' control={form.control} label='Địa điểm tổ chức' />
                  </Box>
                  <Box className='col-span-3 sm:col-span-full'>
                     <DatePickerFieldControl name='start_time' control={form.control} label='Ngày bắt đầu' />
                  </Box>
                  <Box className='col-span-3 sm:col-span-full'>
                     <DatePickerFieldControl name='end_time' control={form.control} label='Ngày kết thúc' />
                  </Box>
                  <Box className='col-span-full w-full space-y-2'>
                     <Label className={cn({ 'text-destructive': Boolean(form.getFieldState('banner').error) })} htmlFor='file'>
                        Ảnh bìa
                     </Label>
                     <Box className='group relative h-80 w-[inherit] overflow-clip rounded-lg'>
                        <Label
                           htmlFor='file'
                           className='absolute inset-0 z-10 flex h-full w-full cursor-pointer items-center justify-center bg-neutral-950/50 bg-opacity-50 text-primary-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100'
                        >
                           <Icon name='Camera' size={48} strokeWidth={1} className='translate-y-2 duration-200 group-hover:translate-y-0' />
                        </Label>
                        <Image src={image} className='absolute inset-0 h-full w-full object-cover object-center' width='100%' height={320} />
                        <InputFieldControl
                           hidden
                           id='file'
                           name='banner'
                           control={form.control}
                           className='hidden'
                           type='file'
                           onChange={(e) => setImage(URL.createObjectURL(e.target.files?.[0]!))}
                           accept='image/*'
                        />
                     </Box>
                     {form.getFieldState('banner').error && <FormMessage>{form.getFieldState('banner').error?.message}</FormMessage>}
                  </Box>
                  <Box className='col-span-full'>
                     <EditorFieldControl defaultValue={data?.content} name='content' form={form} label='Nội dung' />
                  </Box>
               </Box>
               <Button id='submit' type='submit' className='hidden w-full sm:inline-flex'>
                  Lưu
               </Button>
            </Box>
         </form>
      </Form>
   )
}

export default EditEvent
