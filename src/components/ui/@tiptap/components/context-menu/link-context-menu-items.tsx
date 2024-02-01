import useCopyToClipboard from '@/common/hooks/use-copy-to-clipboard'
import { ContextMenuItem, ContextMenuSeparator, Icon } from '@/components/ui'
import { Editor } from '@tiptap/react'
import { Fragment, useMemo } from 'react'
import { toast } from 'sonner'

const LinkContextMenuItems: React.FC<{ editor: Editor }> = ({ editor }) => {
   const [copyToClipboard, { isSuccess }] = useCopyToClipboard()
   const url = useMemo(() => (window.getSelection().anchorNode.parentNode as HTMLAnchorElement).getAttribute('href'), [window.getSelection])
   const handleCopyLinkToClipboard = () => {
      if (url) {
         copyToClipboard(url)
         if (isSuccess) toast.info('Đã sao chép vào bộ nhớ tạm')
      }
   }

   return (
      <Fragment>
         <ContextMenuSeparator />
         <ContextMenuItem className='gap-x-2' onClick={() => window.open(url, '_blank')}>
            <Icon name='ArrowUpRightSquare' />
            Mở liên kết trong tab mới
         </ContextMenuItem>
         <ContextMenuItem className='gap-x-2' onClick={handleCopyLinkToClipboard}>
            <Icon name='Copy' />
            Sao chép URL liên kết
         </ContextMenuItem>
         <ContextMenuItem className='gap-x-2' onClick={() => editor.commands.unsetLink()}>
            <Icon name='Unlink' />
            Xóa liên kết
         </ContextMenuItem>
      </Fragment>
   )
}

export default LinkContextMenuItems
