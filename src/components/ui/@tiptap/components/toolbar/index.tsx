import ColorPicker from '@/components/ui/@tiptap/components/toolbar/toolbar-color-picker'
import { Editor } from '@tiptap/react'
import { Box, Button, Icon, Toggle } from '../../..'
import Tooltip from '../../../@override/tooltip'
import { AlignmentDropdownMenu } from './toolbar-alignment-dropdown'
import FontSizeInput from './toolbar-font-size-input'
import ImageDropdown from './toolbar-image-dropdown'
import { LinkPopover } from './toolbar-link-popover'
import { StyleDropdownMenu } from './toolbar-style-dropdown'
import TableDropdownMenu from './toolbar-table-dropdown'

type ToolbarPluginProps = {
   editor: Editor
}

const Toolbar: React.FC<ToolbarPluginProps> = ({ editor }) => {
   if (!editor) return null

   return (
      <Box className='p-1'>
         <Box className='overflow-x-auto scrollbar-none'>
            <Box className='flex h-full items-center justify-start gap-x-1 p-1'>
               {/* Undo */}
               <Tooltip content='Hoàn tác'>
                  <Button className='aspect-square h-8 w-8' type='button' size='icon' variant='outline' onClick={() => editor.chain().focus().undo().run()}>
                     <Icon name='Undo' />
                  </Button>
               </Tooltip>

               {/* Redo */}
               <Tooltip content='Làm lại'>
                  <Button className='aspect-square h-8 w-8' type='button' size='icon' variant='outline' onClick={() => editor.chain().focus().redo().run()}>
                     <Icon name='Redo' />
                  </Button>
               </Tooltip>

               {/* Change style */}
               <StyleDropdownMenu editor={editor} />

               {/* Change font size */}
               <Tooltip content='Cỡ chữ'>
                  <FontSizeInput editor={editor} />
               </Tooltip>

               {/* Toggle bold */}
               <Tooltip content='Đậm'>
                  <Toggle size='sm' variant='outline' pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                     <Icon name='Bold' />
                  </Toggle>
               </Tooltip>

               {/* Toggle quote */}
               <Tooltip content='Block quote'>
                  <Toggle
                     size='sm'
                     variant='outline'
                     pressed={editor.isActive('blockquote')}
                     onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                  >
                     <Icon name='Quote' size={14} />
                  </Toggle>
               </Tooltip>

               {/* Toggle italic */}
               <Tooltip content='Nghiêng'>
                  <Toggle size='sm' variant='outline' pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                     <Icon name='Italic' />
                  </Toggle>
               </Tooltip>

               {/* Toggle underline */}
               <Tooltip content='Gạch chân'>
                  <Toggle size='sm' variant='outline' pressed={editor.isActive('underline')} onPressedChange={() => editor.commands.toggleUnderline()}>
                     <Icon name='Underline' />
                  </Toggle>
               </Tooltip>

               {/* Toggle underline */}
               <Tooltip content='Code'>
                  <Toggle size='sm' variant='outline' pressed={editor.isActive('underline')} onPressedChange={() => editor.commands.toggleCodeBlock()}>
                     <Icon name='Code' />
                  </Toggle>
               </Tooltip>
               <ColorPicker label='Màu văn bản' icon='Baseline' editor={editor} type='textStyle' />
               <ColorPicker label='Highlight' icon='Highlighter' editor={editor} type='highlight' />

               {/* Toggle strike linethough */}
               <Tooltip content='Gạch ngang'>
                  <Toggle size='sm' variant='outline' pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
                     <Icon name='Strikethrough' className='h-4 w-4' />
                  </Toggle>
               </Tooltip>

               {/* Toggle ordered list */}
               <Tooltip content='Danh sách được đánh số'>
                  <Toggle
                     variant='outline'
                     size='sm'
                     pressed={editor.isActive('orderedList')}
                     onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                  >
                     <Icon name='ListOrdered' />
                  </Toggle>
               </Tooltip>

               {/* Toggle bullet list */}
               <Tooltip content='Danh sách có dấu đầu dòng'>
                  <Toggle
                     variant='outline'
                     size='sm'
                     pressed={editor.isActive('bulletList')}
                     onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                  >
                     <Icon name='List' />
                  </Toggle>
               </Tooltip>

               {/* Horizontal ruler */}
               <Tooltip content='Đường kẻ ngang'>
                  <Button variant='outline' type='button' size='icon' className='h-8 w-8' onClick={() => editor.commands.setHorizontalRule()}>
                     <Icon name='PencilLine' />
                  </Button>
               </Tooltip>

               <AlignmentDropdownMenu editor={editor} />
               <LinkPopover editor={editor} />
               <ImageDropdown editor={editor} />
               <TableDropdownMenu editor={editor} />
            </Box>
         </Box>
      </Box>
   )
}

export default Toolbar
