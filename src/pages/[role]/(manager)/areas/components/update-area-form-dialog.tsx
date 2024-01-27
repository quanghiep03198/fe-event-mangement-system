import { AreaInterface } from '@/common/types/entities'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Form as FormProvider, Icon, InputFieldControl, TextareaFieldControl } from '@/components/ui'
import { useUpdateAreaMutation } from '@/redux/apis/area.api'
import { AreaSchema } from '@/schemas/area.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogDescription } from '@radix-ui/react-dialog'
import { pick } from 'lodash'
import React, { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type EditAreaFormDialogProps = {
   open: boolean
   selectedArea: AreaInterface | undefined
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
   onAfterUpdate: React.Dispatch<React.SetStateAction<AreaInterface | null>>
}

type FormValue = z.infer<ReturnType<typeof AreaSchema.partial>>

const UpdateAreaFormDialog: React.FC<EditAreaFormDialogProps> = ({ open, selectedArea, onOpenChange, onAfterUpdate }) => {
   const form = useForm<FormValue>({
      resolver: zodResolver(AreaSchema.partial())
   })

   const [updateArea, { isLoading }] = useUpdateAreaMutation()

   const handleUpdateArea = (data: FormValue) => {
      if (!selectedArea) return
      toast.promise(updateArea({ id: selectedArea.id, payload: data }).unwrap(), {
         loading: 'Yêu cầu đang được xử lý ...',
         success: () => {
            form.reset()
            onOpenChange(!open)
            onAfterUpdate(null)
            return 'Cập nhật thông tin cơ sở thành công'
         },
         error: (error) => {
            console.log(error)
            return error?.data?.message
         }
      })
   }

   useEffect(() => form.reset(pick(selectedArea, ['name', 'address'])), [selectedArea])

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className='max-w-2xl sm:max-w-[75vw]'>
            <DialogHeader>
               <DialogTitle>Cập nhật cơ sở</DialogTitle>
               <DialogDescription className='text-sm text-muted-foreground'>Điền các thông tin phía dưới để cập nhật thông tin cơ sở</DialogDescription>
            </DialogHeader>
            <FormProvider {...form}>
               <Form onSubmit={form.handleSubmit(handleUpdateArea)}>
                  <InputFieldControl name='name' control={form.control} label='Tên cơ sở' description='Tên cơ sở là tỉnh/thành phố của cơ sở' />
                  <TextareaFieldControl name='address' control={form.control} label='Địa chỉ' description='Địa chỉ liên hệ của cơ sở' rows={5} />
                  <Button type='submit' className='gap-x-2' disabled={isLoading}>
                     <Icon name='CheckCircle' />
                     Lưu
                  </Button>
               </Form>
            </FormProvider>
         </DialogContent>
      </Dialog>
   )
}

const Form = tw.form`flex flex-col gap-y-6 items-stretch`

export default memo(UpdateAreaFormDialog)
