import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { FontSize } from './font-size.extension'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Gapcursor from '@tiptap/extension-gapcursor'

export const extensions = [
   StarterKit.configure({
      heading: {
         levels: [1, 2, 3],
         HTMLAttributes: { class: 'font-bold text-foreground' }
      },
      bold: {
         HTMLAttributes: {
            class: 'font-bold text-foreground'
         }
      },
      paragraph: {
         HTMLAttributes: {
            class: 'my-1'
         }
      },
      blockquote: {
         HTMLAttributes: { class: 'text-foreground border-none' }
      },
      bulletList: {
         HTMLAttributes: {
            class: 'list-disc text-foreground'
         }
      },
      orderedList: {
         HTMLAttributes: {
            class: 'list-decimal text-foreground'
         }
      },
      listItem: {
         HTMLAttributes: {
            class: 'list-decimal text-foreground p-0'
         }
      },
      horizontalRule: {
         HTMLAttributes: {
            class: 'border-t dark:border-t-border'
         }
      }
   }),
   Placeholder.configure({
      placeholder: 'Nhập gì đó ...',
      emptyEditorClass: 'top-0 text-muted-foreground/50 before:pointer-event-none before:content-[attr(data-placeholder)]'
   }),
   Underline.configure(),
   TextAlign.configure({
      types: ['heading', 'paragraph']
   }),
   Gapcursor.configure(),
   Table.configure({
      resizable: true,
      HTMLAttributes: {
         class: 'm-0 w-full table-fixed overflow-hidden border rounded border-collapse [& .resize-cursor]:cursor-col-resize'
      }
   }),
   TableRow.configure(),
   TableHeader.configure({
      HTMLAttributes: {
         class: 'border p-3 relative'
      }
   }),
   TableCell.configure({
      HTMLAttributes: {
         class: 'p-3 border'
      }
   }),
   Highlight.configure({ multicolor: true }),
   Link.configure({
      openOnClick: false,
      HTMLAttributes: {
         class: 'text-blue-500 font-normal'
      }
   }),
   FontSize.configure(),
   TextStyle.configure(),
   Color.configure(),
   Image.configure({
      HTMLAttributes: {
         class: 'object-center object-cover max-w-full aspect-[16/9]'
      },
      allowBase64: true
   })
]
