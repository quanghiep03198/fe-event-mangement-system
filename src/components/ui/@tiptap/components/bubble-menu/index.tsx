import useCopyToClipboard from '@/common/hooks/use-copy-to-clipboard'
import { Box, Button, Form, Icon, InputFieldControl, Popover, PopoverContent, PopoverTrigger, Separator } from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor, BubbleMenu as TiptapBubbleMenu } from '@tiptap/react'
import { useEffect, useState } from 'react'
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
   const [popoverOpen, setPopoverOpen] = useState<boolean>(false)

   useEffect(() => {
      form.reset({ href: editor.getAttributes('link').href })
   }, [editor])

   const handleEditLink = ({ href }: FormValue) => {
      if (href) editor.commands.setLink({ href: href })
      setPopoverOpen(!popoverOpen)
   }

   const handleCopyLinkToClipboard = () => {
      const value = form.getValues('href')
      if (value) {
         copyToClipboard(value)
         toast.info('Đã sao chép vào bộ nhớ tạm')
      }
   }

   return (
      <TiptapBubbleMenu
         editor={editor}
         className='flex w-[256px] flex-col gap-2 rounded-md border bg-background py-2 shadow-2xl'
         tippyOptions={{ zIndex: 10, duration: 200 }}
         shouldShow={(props) => props.editor.isActive('link')}
      >
         <Box className='flex items-center gap-x-2 px-2'>
            <Icon name='Globe' className='basis-[32px] text-muted-foreground' />
            <a href={editor.getAttributes('link').href} target='_blank' className='line-clamp-1 flex-1 text-xs'>
               {editor.getAttributes('link').href}
            </a>
         </Box>
         <Separator />
         <Box className='flex items-center gap-x-px px-2'>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
               <Tooltip content='Cập nhật'>
                  <PopoverTrigger asChild>
                     <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <Icon name='Pencil' />
                     </Button>
                  </PopoverTrigger>
               </Tooltip>
               <PopoverContent align='start' side='bottom' sideOffset={18} alignOffset={0} className='z-20 w-full max-w-sm'>
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
                  <Icon name='Copy' />
               </Button>
            </Tooltip>
            <Tooltip content='Gỡ'>
               <Button type='button' className='aspect-square h-8 w-8' variant='ghost' size='icon' onClick={() => editor.commands.unsetLink()}>
                  <Icon name='Unlink' />
               </Button>
            </Tooltip>
         </Box>
      </TiptapBubbleMenu>
   )
}

export default BubbleMenu
