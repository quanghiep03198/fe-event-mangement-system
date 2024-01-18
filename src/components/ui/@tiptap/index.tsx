/* eslint-disable */

import { EditorContent, Editor as EditorType, useEditor } from '@tiptap/react'
import React, { memo } from 'react'
import { Box, ScrollArea } from '..'
import BubbleMenu from './components/bubble-menu'
import Toolbar from './components/toolbar'
import { extensions } from './extensions'

export interface EditorProps {
   onUpdate: (state: { value: string; isEmpty: boolean }) => unknown
   id?: string
   name?: string
   content?: string
   disabled?: boolean
}

export const Editor: React.FC<EditorProps> = memo(({ content, id, disabled, name, onUpdate: handleUpdate }) => {
   const editor = useEditor(
      {
         content,
         extensions,
         editorProps: {
            attributes: {
               class: 'p-4 rounded-lg max-w-full max-h-full overflow-auto scrollbar-none border-none outline-none focus:outline-none focus:border-none min-h-[50vh] text-foreground bg-background prose prose-li:p-0'
            }
         },
         enableCoreExtensions: true,
         editable: !disabled,

         onUpdate: ({ editor }) => {
            if (handleUpdate) {
               handleUpdate({ value: editor.getHTML(), isEmpty: editor.isEmpty })
            }
         }
      },
      [content]
   )

   if (!editor) {
      return null
   }

   return (
      <Box className='flex w-full max-w-full flex-col items-stretch divide-y divide-border overflow-x-clip rounded-lg border shadow'>
         <Toolbar editor={editor} />
         <ScrollArea className='[content: h-[75vh] w-full max-w-full overflow-auto'>
            <EditorContent id={id} editor={editor} name={name} controls={true} content={content} />
         </ScrollArea>
         <BubbleMenu editor={editor} />
      </Box>
   )
})

Editor.defaultProps = {
   content: '',
   id: 'editor'
}
