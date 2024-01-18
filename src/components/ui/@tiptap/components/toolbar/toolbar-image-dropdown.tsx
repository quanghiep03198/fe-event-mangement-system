import { convertBase64 } from '@/common/utils/convert-base64'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tiptap/react'
import React, { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import tw from 'tailwind-styled-components'
import { z } from 'zod'
import {
   Button,
   Dialog,
   DialogContent,
   DialogHeader,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   Form,
   Icon,
   InputFieldControl
} from '../../..'
import Tooltip from '../../../@override/tooltip'

const UploadSchema = z.object({
   url: z.string().url('URL ảnh không hợp lệ').optional()
})

type FormValue = z.infer<typeof UploadSchema>

const ImageDropdown: React.FC<{ editor: Editor }> = ({ editor }) => {
   const [open, setOpen] = useState<boolean>(false)
   const form = useForm({
      resolver: zodResolver(UploadSchema)
   })
   const id = useId()

   const handleInsertImageURL = ({ url }: FormValue) => {
      if (url) editor.commands.setImage({ src: url, alt: 'Image' })
      form.reset()
      setOpen(false)
   }

   const handleInsertImageFromDevice = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return
      const url = (await convertBase64(e.target.files?.[0])) as string
      editor.commands.setImage({ src: url })
   }

   if (!editor) {
      return null
   }

   return (
      <>
         <DropdownMenu>
            <Tooltip content='Chèn ảnh'>
               <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='icon' className='aspect-square h-8 w-8'>
                     <Icon name='Image' />
                  </Button>
               </DropdownMenuTrigger>
            </Tooltip>
            <DropdownMenuContent>
               <DropdownMenuItem asChild>
                  <label htmlFor={id} className='flex items-center gap-x-2'>
                     <Icon name='Upload' /> Tải lên từ máy tính
                  </label>
               </DropdownMenuItem>
               <DropdownMenuItem className='gap-x-2' onClick={() => setOpen(!open)}>
                  <Icon name='Link2' /> Theo URL
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
         <input type='file' className='hidden' id={id} onChange={handleInsertImageFromDevice} />
         <Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
            <DialogContent className='items-stretch'>
               <DialogHeader className='text-left'>Chèn hình ảnh</DialogHeader>
               <Form {...form}>
                  <FormDialog
                     onSubmit={(e) => {
                        e.stopPropagation()
                        form.handleSubmit(handleInsertImageURL)(e)
                     }}
                  >
                     <InputFieldControl
                        control={form.control}
                        type='url'
                        name='url'
                        className='w-full'
                        placeholder='Dán URL của hình ảnh ...'
                        description='Chỉ chọn hình ảnh mà bạn đã xác nhận bạn có giấy phép sử dụng.'
                     />
                     <Button type='submit'>Áp dụng</Button>
                  </FormDialog>
               </Form>
            </DialogContent>
         </Dialog>
      </>
   )
}

const FormDialog = tw.form`flex flex-col items-stretch gap-y-6 w-full`

export default ImageDropdown

{
   /* <Box className='flex items-center gap-x-4'>
   <Label htmlFor='width'>Link</Label>
   <Input id='width' defaultValue='100%' type='url' value={editor.getAttributes('link').href || ''} className='col-span-2 h-8' onChange={setLink} />
</Box> */
}
// const setLink = useCallback(
//    (e: React.ChangeEvent<HTMLInputElement>) => {
//       const url = e.target.value
//       // cancelled
//       if (url === null) {
//          return
//       }
//       // empty
//       if (url === '') {
//          editor.chain().focus().extendMarkRange('link').unsetLink().run()

//          return
//       }
//       // update link
//       editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
//    },
//    [editor]
// )
