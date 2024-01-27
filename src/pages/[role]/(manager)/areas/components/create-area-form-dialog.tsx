import { Button, Dialog, DialogContent, DialogHeader, Form as FormProvider, Icon, InputFieldControl, TextareaFieldControl } from '@/components/ui'
import { useCreateAreaMutation } from '@/redux/apis/area.api'
import { AreaSchema } from '@/schemas/area.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type CreateAreaFormDialogProps = {
   open: boolean
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

type FormValue = z.infer<typeof AreaSchema>

const CreateAreaFormDialog: React.FC<CreateAreaFormDialogProps> = ({ open, onOpenChange: handleOpenChange }) => {
   const form = useForm<FormValue>({
      resolver: zodResolver(AreaSchema)
   })

   const [createArea, { isLoading }] = useCreateAreaMutation()

   const handleCreateArea = (data: FormValue) => {
      toast.promise(createArea(data).unwrap(), {
         loading: 'Đang xử lý yêu cầu ...',
         success: () => {
            form.reset()
            handleOpenChange(!open)
            return 'Đã thêm mới cơ sở'
         },
         error: (error) => {
            console.log(error)
            return error?.data?.message
         }
      })
   }

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogContent className='w-full max-w-2xl sm:max-w-[90vw] md:max-w-[90vw]'>
            <DialogHeader className='text-left'>Thêm mới cơ sở</DialogHeader>
            <FormProvider {...form}>
               <Form onSubmit={form.handleSubmit(handleCreateArea)}>
                  <InputFieldControl name='name' control={form.control} label='Tên cơ sở' description='Tên cơ sở là tỉnh/thành phố của cơ sở' />
                  <TextareaFieldControl name='address' control={form.control} label='Địa chỉ' description='Địa chỉ liên hệ của cơ sở' rows={5} />
                  <Button type='submit' className='gap-x-2' disabled={isLoading}>
                     <Icon name='PlusCircle' />
                     Thêm mới
                  </Button>
               </Form>
            </FormProvider>
         </DialogContent>
      </Dialog>
   )
}

const Form = tw.form`flex flex-col gap-y-6 items-stretch`

export default memo(CreateAreaFormDialog)
