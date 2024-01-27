// import { areaOptions } from '@/common/constants/area-options'
import { UserRoleEnum } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useCloudinaryUpload from '@/common/hooks/use-cloudinary'
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
   SelectFieldControl,
   TextareaFieldControl,
   Typography
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@hook-form/editor-field-control'
import { useCreateEventMutation } from '@/redux/apis/event.api'
import { CreateEventSchema } from '@/schemas/event.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import UserComboboxFieldControl from '../components/user-combobox-field-control'
import { useGetAllAreasQuery, useGetAreaQuery } from '@/redux/apis/area.api'

type FormValue = z.infer<typeof CreateEventSchema>

const CreateEventPage = () => {
   const [image, setImage] = useState<string>('')
   const [fileValue, setFileValue] = useState<string>('')
   const form = useForm<FormValue>({ resolver: zodResolver(CreateEventSchema) })
   const selectedAreaId = useWatch({ name: 'area', control: form.control })
   const navigate = useNavigate()
   const { data: selectedArea } = useGetAreaQuery(selectedAreaId, { skip: !selectedAreaId })
   const [createEvent, { isLoading }] = useCreateEventMutation()
   const [uploadImage, isUploading, isUploadError] = useCloudinaryUpload()
   const { data: areas } = useGetAllAreasQuery({ pagination: false })
   const areaOptions = useMemo(() => (Array.isArray(areas) ? areas.map((item) => ({ label: item.name, value: item.id })) : []), [areas])

   const handleCreateEvent = async (data: FormValue) => {
      toast.loading('Đang tải lên ảnh ...')
      const banner = await uploadImage(data.banner[0])
      if (isUploadError) {
         toast.error('Tải lên ảnh thất bại')
         return
      }
      toast.promise(createEvent({ ...data, banner }).unwrap(), {
         loading: 'Đang tạo sự kiện ...',
         success: () => {
            navigate(Paths.EVENTS_LIST)
            return 'Sự kiện đã được tạo thành công'
         },
         error: 'Tạo sự kiện thất bại'
      })
   }

   useEffect(() => {
      form.setValue('location', selectedArea?.address)
   }, [selectedArea])

   return (
      <Form {...form}>
         <form className='flex max-w-4xl flex-col gap-y-14 sm:max-w-full' onSubmit={form.handleSubmit(handleCreateEvent)}>
            <Box className='flex items-center justify-between border-b py-4'>
               <Box className='space-y-2'>
                  <Typography variant='h6'>Thêm sự kiện</Typography>
                  <Typography variant='small' color='muted'>
                     Nhập thông tin để đăng tải sự kiện
                  </Typography>
               </Box>
               <Button type='submit' size='sm' disabled={isLoading || isUploading} className='w-fit gap-x-2 sm:hidden'>
                  <Icon name='PlusCircle' />
                  Thêm sự kiện
               </Button>
            </Box>

            <Box className='space-y-10'>
               <Box className='grid grid-cols-6 gap-x-6 gap-y-10 sm:grid-cols-1 sm:gap-x-0'>
                  <Box className='col-span-full w-full'>
                     <InputFieldControl
                        name='name'
                        control={form.control}
                        label='Tên sự kiện'
                        placeholder='Nhập tên sự kiện'
                        description='Tên hiển thị sự kiện trên hệ thống'
                     />
                  </Box>
                  <Box className='col-span-full w-full'>
                     <UserComboboxFieldControl
                        label='Người tổ chức'
                        form={form}
                        path='id'
                        control={form.control}
                        name='user_id'
                        restrictRole={UserRoleEnum.STAFF}
                        placeholder='Chọn người tổ chức'
                        description='Người dùng được chọn sau khi thêm sẽ trở thành người tổ chức sự kiện'
                     />
                  </Box>
                  <Box className='col-span-full w-full'>
                     <InputFieldControl
                        name='contact'
                        control={form.control}
                        placeholder='Nhập một số điện thoại'
                        label='Số điện thoại liên hệ'
                        description='Số điện thoại người dùng có thể liên hệ để được hỗ trợ'
                     />
                  </Box>
                  <Box className='col-span-full w-full'>
                     <SelectFieldControl name='area' control={form.control} placeholder='Chọn khu vực' label='Khu vực tổ chức' options={areaOptions} />
                  </Box>
                  <Box className='col-span-full w-full'>
                     <InputFieldControl name='location' control={form.control} placeholder='Nhập một địa điểm' label='Địa điểm tổ chức' />
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
                  <Box className='col-span-full space-y-2'>
                     <TextareaFieldControl name='description' placeholder='Mô tả ngắn về sự kiện' control={form.control} label='Mô tả' rows={5} />
                  </Box>
                  <Box className='col-span-full'>
                     <EditorFieldControl name='content' form={form} label='Nội dung' />
                  </Box>
               </Box>

               <Button type='submit' id='submit' disabled={isLoading} className='hidden w-fit gap-x-2 sm:inline-flex sm:w-full'>
                  <Icon name='PlusCircle' />
                  Thêm sự kiện
               </Button>
            </Box>
         </form>
      </Form>
   )
}

export default CreateEventPage
