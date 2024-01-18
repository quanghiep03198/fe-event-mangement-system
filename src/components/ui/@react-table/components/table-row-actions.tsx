'use client'

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Icon } from '@/components/ui'

type DataTableRowActionsProps = {
   canDelete?: boolean
   canEdit?: boolean
   canViewDetails?: boolean
   slot?: React.ReactNode
   onViewDetails?: AnonymousFunction
   onDelete?: AnonymousFunction
   onEdit?: AnonymousFunction
}

export const DataTableRowActions: React.FC<DataTableRowActionsProps> = (props) => {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
               <Icon name='MoreHorizontal' />
               <span className='sr-only'>Open menu</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align='end'>
            <DropdownMenuItem
               disabled={!props.canViewDetails}
               className='flex items-center gap-x-3'
               onClick={() => {
                  if (props.onViewDetails) props.onViewDetails()
               }}
            >
               <Icon name='MousePointerClick' />
               Chi tiết
            </DropdownMenuItem>
            {props.slot}
            <DropdownMenuItem
               disabled={!props.canEdit}
               className='flex items-center gap-x-3'
               onClick={() => {
                  if (props.onEdit) props.onEdit()
               }}
            >
               <Icon name='Pencil' />
               Cập nhật
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
               disabled={!props.canDelete}
               className='flex items-center gap-x-3'
               onClick={() => {
                  if (props.onDelete) props.onDelete()
               }}
            >
               <Icon name='Trash2' />
               Xóa
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
