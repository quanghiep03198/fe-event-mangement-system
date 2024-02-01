import { EditorContent, useEditor } from '@tiptap/react'
import React, { memo, useState } from 'react'
import { Box, ContextMenu, ContextMenuContent, ContextMenuTrigger, ScrollArea } from '..'
import BubbleMenu from './components/bubble-menu'
import CommonContextMenuItems from './components/context-menu/common-context-menu-items'
import ImageContextMenuItem from './components/context-menu/image-context-menu-item'
import LinkContextMenuItems from './components/context-menu/link-context-menu-items'
import TableContextMenuItems from './components/context-menu/table-context-menu-items'
import Toolbar from './components/toolbar'
import { extensions } from './extensions'
import { EditorContextProvider } from './context/editor-context'
import SetImageForm from './components/image-form'

export interface EditorProps {
   onUpdate: (state: { value: string; isEmpty: boolean }) => unknown
   id?: string
   name?: string
   content?: string
   disabled?: boolean
}

export const Editor: React.FC<EditorProps> = memo(({ content, id, disabled, name, onUpdate: handleUpdate }) => {
   const [contextMenuType, setContextMenuType] = useState<keyof HTMLElementTagNameMap | null>(null)

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

   const handleContextMenuOpen: React.MouseEventHandler<HTMLSpanElement> = (e) => {
      const target = e.target as typeof e.currentTarget
      switch (true) {
         case Boolean(target.closest('table')):
            setContextMenuType('table')
            break
         case Boolean(target.closest('a')):
            setContextMenuType('a')
            break
         case Boolean(target.closest('img')):
            setContextMenuType('img')
            break

         default:
            setContextMenuType(null)
      }
   }

   return (
      <Box className='relative flex w-full max-w-full flex-col items-stretch divide-y divide-border overflow-x-clip rounded-lg border shadow'>
         <EditorContextProvider>
            <Toolbar editor={editor} />
            <ContextMenu>
               <ContextMenuTrigger onContextMenu={handleContextMenuOpen}>
                  <ScrollArea className='relative h-[32rem] w-full max-w-full overflow-auto'>
                     <EditorContent id={id} editor={editor} name={name} controls={true} content={content} />
                  </ScrollArea>
               </ContextMenuTrigger>
               <ContextMenuContent className='min-w-[320px]'>
                  <CommonContextMenuItems editor={editor} />
                  {contextMenuType === 'table' && <TableContextMenuItems editor={editor} />}
                  {contextMenuType === 'a' && <LinkContextMenuItems editor={editor} />}
                  {contextMenuType === 'img' && <ImageContextMenuItem editor={editor} />}
               </ContextMenuContent>
            </ContextMenu>
            <SetImageForm editor={editor} />
         </EditorContextProvider>
         <BubbleMenu editor={editor} />
      </Box>
   )
})

Editor.defaultProps = {
   content: '',
   id: 'editor'
}
