import { Editor } from '@tiptap/react'
import React, { useContext } from 'react'
import tw from 'tailwind-styled-components'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon, Label } from '../../..'
import Tooltip from '../../../@override/tooltip'
import { EditorContext } from '../../context/editor-context'

const ImageDropdown: React.FC<{ editor: Editor }> = ({ editor }) => {
   const { setImageFormOpen } = useContext(EditorContext)

   if (!editor) {
      return null
   }

   return (
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
               <Label htmlFor='editor-image-input' className='flex items-center gap-x-2'>
                  <Icon name='Upload' /> Tải lên từ máy tính
               </Label>
            </DropdownMenuItem>
            <DropdownMenuItem className='gap-x-2' onClick={() => setImageFormOpen(true)}>
               <Icon name='Link2' /> Theo URL
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

const FormDialog = tw.form`flex flex-col items-stretch gap-y-6 w-full`

export default ImageDropdown
