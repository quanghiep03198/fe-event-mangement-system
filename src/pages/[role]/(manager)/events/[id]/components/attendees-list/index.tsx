import { UserInterface } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
   Badge,
   Box,
   Button,
   DataTable,
   DataTableRowActions,
   DropdownMenuItem,
   Icon,
   Label,
   Typography,
   buttonVariants
} from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import { type Atteendees, useGetAttendeesByEventQuery, useRemoveAttendanceFromEventMutation } from '@/redux/apis/attendance.api'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import AddAttendeeFormModal from './add-attendee-form-modal'
import UpdateAttendeeFormModal from './update-attendee-form-modal'
import MoveAttendeeToEventModal from './move-attendee-form-modal'

const ParticipantsList: React.FunctionComponent = () => {
   const [addFormOpenState, setAddFormOpenState] = useState<boolean>(false)
   const [updateFormOpenState, setUpdateFormOpenState] = useState<boolean>(false)
   const [moveAttendeeFormOpenState, setMoveAttendeeFormOpenState] = useState<boolean>(false)
   const [selectedAttendee, setSelectedAttendee] = useState<number>()
   const { id: eventId } = useParams()
   const { data: attendees, refetch } = useGetAttendeesByEventQuery({ eventId: eventId!, params: { pagination: false } })
   const [attendeeToUpdate, setAttendeeToUpdate] = useState<Partial<UserInterface> | null>(null)
   const columnHelper = createColumnHelper<Atteendees>()
   const handleOpenAddFormModal = useCallback(setAddFormOpenState, [])
   const handleOpenUpdateFormModal = useCallback(setUpdateFormOpenState, [])
   const [removeAttendee] = useRemoveAttendanceFromEventMutation()

   const handleRemoveAttendeeFromEvent = useCallback(
      (id: number) =>
         toast.promise(removeAttendee(id), {
            loading: 'Đang rút sinh viên ra khỏi danh sách ...',
            success: 'Sinh viên đã được rút khỏi danh sách tham gia',
            error: 'Đã có lỗi xảy ra'
         }),
      []
   )

   const columns = [
      columnHelper.accessor('user.name', {
         header: 'Họ tên',
         enableSorting: true,
         enableColumnFilter: true,
         size: 256,
         cell: ({ getValue, row }) => {
            const username = getValue()
            return (
               <Box className='flex items-center gap-x-2'>
                  <Avatar>
                     <AvatarImage src={row.original?.user?.avatar} />
                     <AvatarFallback>{row.original?.user?.name?.charAt(0) ?? 'A'}</AvatarFallback>
                  </Avatar>
                  <span className='whitespace-nowrap'>{username as string}</span>
               </Box>
            )
         }
      }),
      columnHelper.accessor('user.email', {
         header: 'Email',
         enableSorting: true,
         enableColumnFilter: true
      }),
      columnHelper.accessor('user.phone', {
         header: 'Số điện thoại',
         enableColumnFilter: true,
         cell: ({ getValue }) =>
            getValue() ?? (
               <Typography variant='p' color='muted'>
                  Chưa cập nhật
               </Typography>
            )
      }),
      columnHelper.accessor('user.role', {
         header: 'Vai trò',
         enableColumnFilter: true,
         cell: ({ getValue }) => {
            const value = getValue()
            return <Badge variant='outline'>{value}</Badge>
         }
      }),
      columnHelper.accessor('created_at', {
         header: 'Ngày tham gia',
         enableColumnFilter: true,
         enableSorting: true,
         cell: ({ getValue }) => {
            const value = getValue()
            return format(value, 'dd/MM/yyyy')
         }
      }),
      columnHelper.accessor('id', {
         header: 'Thao tác',
         cell: ({ getValue, row }) => {
            const id = getValue()
            return (
               <DataTableRowActions
                  enableEditing={true}
                  enableDeleting={true}
                  onEdit={() => {
                     setAttendeeToUpdate(row.original.user)
                     handleOpenUpdateFormModal(true)
                  }}
                  onDelete={() => handleRemoveAttendeeFromEvent(id)}
                  slot={
                     <DropdownMenuItem
                        className='gap-x-2 whitespace-nowrap'
                        onClick={() => {
                           setSelectedAttendee(id)
                           setMoveAttendeeFormOpenState(true)
                        }}
                     >
                        <Icon name='ArrowRightLeft' /> Chuyển sang sự kiện khác
                     </DropdownMenuItem>
                  }
               />
            )
         }
      })
   ] as ColumnDef<Atteendees>[]

   return (
      <Box className='flex flex-col gap-y-6'>
         <DataTable
            columns={columns}
            data={attendees ?? []}
            loading={false}
            slot={
               <Tooltip content='Thêm người tham gia'>
                  <Button variant='outline' className={cn('h-8 w-8 gap-x-2 text-xs')} size='icon' onClick={() => handleOpenAddFormModal(!addFormOpenState)}>
                     <Icon name='PlusCircle' />
                  </Button>
               </Tooltip>
            }
         />
         <AddAttendeeFormModal open={addFormOpenState} onOpenChange={handleOpenAddFormModal} />
         <UpdateAttendeeFormModal
            open={updateFormOpenState}
            onOpenChange={handleOpenUpdateFormModal}
            onAfterUpdate={refetch}
            defaultValue={attendeeToUpdate!}
         />
         <MoveAttendeeToEventModal open={moveAttendeeFormOpenState} onOpenChange={setMoveAttendeeFormOpenState} selectedAttendee={selectedAttendee} />
      </Box>
   )
}

export default ParticipantsList
