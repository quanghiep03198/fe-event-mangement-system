import { UserRoleEnum } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useCloudinaryUpload from '@/common/hooks/use-cloudinary'
import { cn } from '@/common/utils/cn'
import {
   Box,
   Button,
   DatePickerFieldControl,
   Form,
   FormMessage,
   Icon,
   Image,
   InputFieldControl,
   Label,
   SelectFieldControl,
   TextareaFieldControl,
   Typography
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@hook-form/editor-field-control'
import { useGetAllAreasQuery } from '@/redux/apis/area.api'
import { useGetEventDetailsQuery, useUpdateEventMutation } from '@/redux/apis/event.api'
import { useAppSelector } from '@/redux/hook'
import { UpdateEventSchema } from '@/schemas/event.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import UserComboboxFieldControl from '../components/user-combobox-field-control'

type FormValue = z.infer<typeof UpdateEventSchema>

const EditEvent = () => {
   const form = useForm<FormValue>({
      resolver: zodResolver(UpdateEventSchema)
   })
   const [image, setImage] = useState<string>('')
   const { id } = useParams()
   const navigate = useNavigate()

   const { data: eventDetails } = useGetEventDetailsQuery(id!)
   const { data: areas } = useGetAllAreasQuery({ pagination: false })
   const [updateEvent, { isLoading }] = useUpdateEventMutation()
   const [uploadImage, isUploading, isUploadError] = useCloudinaryUpload()
   const user = useAppSelector((state) => state.auth.user)

   const areaOptions = useMemo(() => (Array.isArray(areas) ? areas.map((item) => ({ label: item.name, value: item.id })) : []), [areas])

   useEffect(() => {
      if (eventDetails) {
         form.reset({
            name: eventDetails.name,
            location: eventDetails.location,
            user_id: eventDetails.user_id,
            contact: eventDetails.contact,
            description: eventDetails.description,
            area_id: eventDetails.area?.id,
            start_time: new Date(eventDetails.start_time),
            end_time: new Date(eventDetails.end_time)
         } as FormValue)

         setImage(eventDetails?.banner)
      }
   }, [eventDetails])

   const handleUpdateEvent = async (data: FormValue) => {
      let banner = null
      if (data.banner instanceof FileList) {
         toast.loading('Đang tải lên ảnh ...')
         banner = await uploadImage(data.banner[0])
         if (isUploadError) toast.error('Tải lên ảnh thất bại')
         return
      }

      if (banner) data.banner = banner
      toast.promise(
         updateEvent({
            id,
            payload: {
               ...data,
               user_id: data?.user_id ?? user?.id,
               start_time: format(data.start_time, 'yyyy/MM/dd HH:mm:ss'),
               end_time: format(data.end_time, 'yyyy/MM/dd HH:mm:ss')
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
                  <Typography variant='small' color='muted'>
                     Nhập thông tin để cập nhật sự kiện
                  </Typography>
               </Box>
               <Button type='submit' size='sm' disabled={isLoading || isUploading} className='w-fit gap-x-2 sm:hidden'>
                  <Icon name='CheckCircle' />
                  Lưu lại
               </Button>
            </Box>
            <Box className='space-y-10'>
               <Box className='grid grid-cols-6 gap-x-6 gap-y-10 sm:grid-cols-1 sm:gap-x-0'>
                  <Box className='col-span-full'>
                     <InputFieldControl name='name' control={form.control} label='Tên sự kiện' placeholder='Nhập tên ...' />
                  </Box>
                  <Box className='col-span-full'>
                     <UserComboboxFieldControl
                        label='Người tổ chức'
                        path='id'
                        name='user_id'
                        form={form}
                        control={form.control}
                        canReset={true}
                        defaultValue={String(eventDetails?.user_id)}
                        roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}
                        placeholder='Chọn người tổ chức'
                        description='Người dùng được chọn sau khi thêm sẽ trở thành người tổ chức sự kiện. Bỏ trống nếu bạn là người tổ chức.'
                     />
                  </Box>
                  <Box className='col-span-full'>
                     <InputFieldControl name='contact' control={form.control} label='Số điện thoại liên hệ' placeholder='Nhập một số điện thoại' />
                  </Box>
                  <Box className='col-span-full w-full'>
                     <SelectFieldControl name='area_id' control={form.control} placeholder='Chọn khu vực' label='Khu vực tổ chức' options={areaOptions} />
                  </Box>
                  <Box className='col-span-full'>
                     <InputFieldControl name='location' control={form.control} label='Địa điểm tổ chức' placeholder='Nhập một địa điểm' />
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
                           <Icon name='Camera' size={32} strokeWidth={1} className='translate-y-2 duration-200 group-hover:translate-y-0' />
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

                  {/* Description */}
                  <Box className='col-span-full'>
                     <TextareaFieldControl name='description' control={form.control} label='Mô tả' rows={5} placeholder='Mô tả ngắn về sự kiện' />
                  </Box>
                  <Box className='col-span-full'>
                     <EditorFieldControl defaultValue={eventDetails?.content} name='content' form={form} label='Nội dung' />
                  </Box>
               </Box>
               <Button id='submit' type='submit' className='hidden w-full gap-x-2 sm:inline-flex'>
                  <Icon name='CheckCircle' />
                  Lưu lại
               </Button>
            </Box>
         </form>
      </Form>
   )
}

export default EditEvent
