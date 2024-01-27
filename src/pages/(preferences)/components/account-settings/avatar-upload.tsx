import { cn } from '@/common/utils/cn'
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
   Box,
   Button,
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   Form,
   Icon,
   Image,
   InputFieldControl,
   Label,
   Typography,
   buttonVariants
} from '@/components/ui'
import { useUpdateUserInfoMutation } from '@/redux/apis/auth.api'
import { useAppSelector } from '@/redux/hook'
import { Cloudinary } from '@/services/cloudinary.service'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormValue = { file: FileList }

const AvatarUpload: React.FunctionComponent = () => {
   const form = useForm<FormValue>()
   const user = useAppSelector((state) => state.auth.user)
   const formRef = useRef<HTMLFormElement>(null)
   const [open, setOpen] = useState<boolean>(false)
   const [image, setImage] = useState<string | null>(null)
   const [updateUserInfo] = useUpdateUserInfoMutation()

   const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (e.currentTarget.files instanceof FileList) {
         setImage(URL.createObjectURL(e.target.files[0]))
         setOpen(true)
      }
   }

   const handleUploadImage = async (data: FormValue) => {
      toast.loading('Đang tải lên ảnh ...')
      const avatar = await Cloudinary.upload(data.file[0])
      toast.promise(updateUserInfo({ avatar }), {
         loading: 'Đang lưu ảnh đại diện ...',
         success: () => {
            handleAfterDone()
            return 'Đã cập nhật ảnh đại diện'
         },
         error: () => {
            form.reset()
            return 'Cập nhật ảnh đại diện thất bại'
         }
      })
   }

   const handleAfterDone = () => {
      setOpen(false)
      form.reset()
      formRef.current.reset()
   }

   return (
      <>
         <Box className='flex flex-col justify-center gap-x-6 px-8 py-4 sm:px-4'>
            <Box className='relative w-fit space-y-1'>
               <Label>Ảnh đại diện</Label>
               <Avatar className='h-56 w-56 sm:h-48 sm:w-48'>
                  <AvatarImage src={user?.avatar} className='object-cover object-center' />
                  <AvatarFallback>A</AvatarFallback>
               </Avatar>
               <Label
                  htmlFor='avatar'
                  className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'absolute bottom-0 left-0 gap-x-2 bg-background/80 hover:bg-background')}
               >
                  <Icon name='Camera' size={18} /> Cập nhật
               </Label>
            </Box>
         </Box>

         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle className='text-left'>Preview</DialogTitle>
                  <DialogDescription className='text-muted-foreground'>Xem trước ảnh đại diện tải lên</DialogDescription>
               </DialogHeader>

               <Box className='relative flex items-center justify-center py-4'>
                  <Image src={image} className='aspect-square h-48 w-48 rounded-full object-cover object-center' width='100%' height='100%' />
                  <Label
                     htmlFor='avatar'
                     className='absolute z-10 flex aspect-[1/1] h-48 w-48 items-center justify-center rounded-full bg-neutral-950/80 bg-opacity-50 opacity-0 backdrop-blur duration-200 hover:opacity-100'
                  >
                     <Icon name='Camera' size={32} />
                  </Label>
               </Box>

               <DialogFooter className='flex-row justify-end gap-x-2'>
                  <Label htmlFor='reset' className={cn(buttonVariants({ variant: 'ghost' }))} onClick={handleAfterDone}>
                     Hủy
                  </Label>
                  <Label htmlFor='submit' className={cn(buttonVariants({ variant: 'default' }))}>
                     Lưu
                  </Label>
               </DialogFooter>
            </DialogContent>
         </Dialog>
         <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(handleUploadImage)} className='hidden'>
               <InputFieldControl name='file' control={form.control} type='file' id='avatar' onChange={handleImageChange} />
               <Button type='reset' id='reset' />
               <Button type='submit' id='submit' />
            </form>
         </Form>
      </>
   )
}

export default AvatarUpload
