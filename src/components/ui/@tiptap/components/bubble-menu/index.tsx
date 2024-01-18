import useCopyToClipboard from '@/common/hooks/use-copy-to-clipboard'
import { Box, Button, Form, Icon, InputFieldControl, Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor, BubbleMenu as TiptapBubbleMenu } from '@tiptap/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type FormValue = z.infer<typeof LinkSchema>

const LinkSchema = z.object({
   href: z.string().url().optional()
})

const BubbleMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
   const [copyToClipboard] = useCopyToClipboard()
   const form = useForm<FormValue>({ resolver: zodResolver(LinkSchema), defaultValues: { href: editor.getAttributes('link').href } })

   useEffect(() => {
      form.reset({ href: editor.getAttributes('link').href })
   }, [editor.getAttributes('link')])

   const handleEditLink = ({ href }: FormValue) => {
      if (href) editor.commands.setLink({ href: href })
   }

   const handleCopyLinkToClipboard = () => {
      const value = form.getValues('href')
      if (value) {
         copyToClipboard(value)
         toast.info('Đã sao chép vào bộ nhớ tạm')
      }
   }

   return (
      <>
         <TiptapBubbleMenu editor={editor} shouldShow={(props) => props.editor.isActive('link')}>
            <Box className='z-0 flex flex-col gap-4 rounded-lg bg-background p-2 shadow'>
               <a
                  href={editor.getAttributes('link').href}
                  target='_blank'
                  className='line-clamp-1 inline-flex max-w-[12rem] items-center gap-x-3 whitespace-nowrap text-xs'
               >
                  <Icon name='Globe' /> {editor.getAttributes('link').href}
               </a>
               <Box className='flex items-center gap-x-2'>
                  <Popover>
                     <Tooltip content='Cập nhật'>
                        <PopoverTrigger asChild>
                           <Button variant='ghost' size='icon' className='h-8 w-8'>
                              <Icon name='Pencil' />
                           </Button>
                        </PopoverTrigger>
                     </Tooltip>
                     <PopoverContent align='start' side='bottom' sideOffset={18} alignOffset={0} className='z-10'>
                        <Form {...form}>
                           <form
                              onSubmit={(e) => {
                                 e.stopPropagation()
                                 form.handleSubmit(handleEditLink)(e)
                              }}
                              className='flex items-center gap-x-2'
                           >
                              <InputFieldControl name='href' control={form.control} type='url' className='h-8' />
                              <Button type='submit' size='sm'>
                                 Áp dụng
                              </Button>
                           </form>
                        </Form>
                     </PopoverContent>
                  </Popover>

                  <Tooltip content='Copy'>
                     <Button type='button' className='aspect-square h-8 w-8' variant='ghost' size='icon' onClick={handleCopyLinkToClipboard}>
                        <Icon name='ClipboardCopy' />
                     </Button>
                  </Tooltip>
                  <Tooltip content='Gỡ'>
                     <Button type='button' className='aspect-square h-8 w-8' variant='ghost' size='icon' onClick={() => editor.commands.unsetLink()}>
                        <Icon name='Unlink' />
                     </Button>
                  </Tooltip>
               </Box>
            </Box>
         </TiptapBubbleMenu>
      </>
   )
}

export default BubbleMenu
