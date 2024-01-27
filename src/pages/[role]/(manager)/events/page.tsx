import { EventStatusValues } from '@/common/constants/constants'
import { EventStatus } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import { EventInterface } from '@/common/types/entities'
import { Badge, Box, Button, DataTable, DataTableRowActions, Icon, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import Tooltip from '@/components/ui/@override/tooltip'
import { useDeleteEventMutation, useGetEventsQuery } from '@/redux/apis/event.api'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import React, { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

type EventListWithoutPagination = Exclude<OptionalPagination<EventInterface>, Pagination<EventInterface>>

const EventListPage: React.FunctionComponent = () => {
   const { data, isLoading } = useGetEventsQuery({ pagination: false, limit: 10 })
   const [deleteEvent] = useDeleteEventMutation()
   const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
   const [confirmDialogOpenState, setConfirmDialogOpenState] = useState<boolean>(false)
   const navigate = useNavigate()

   const eventsList = useMemo(() => data as EventListWithoutPagination, [data])

   const handleDeleteButtonClick = (id: number) => {
      setConfirmDialogOpenState(true)
      setSelectedRowId(id)
   }

   const handleDeleteEvent = useCallback(async () => {
      try {
         const response = await deleteEvent(selectedRowId).unwrap()
         toast.success(response?.message)
      } catch (error) {
         const errorResponse = error as ErrorResponse
         toast.error(errorResponse.data?.message)
      } finally {
         setSelectedRowId(null)
      }
   }, [selectedRowId])

   const columnHelper = createColumnHelper<EventInterface>()

   const columns = [
      columnHelper.accessor('name', {
         header: 'Tên sự kiện',
         enableSorting: true,
         enableColumnFilter: true,
         size: 208
      }),
      columnHelper.accessor('contact', {
         header: 'Số điện thoại liên hệ',
         enableColumnFilter: true,
         size: 144
      }),
      columnHelper.accessor('location', {
         header: 'Địa điểm',
         enableColumnFilter: true,
         size: 240
      }),
      columnHelper.accessor('start_time', {
         header: 'Thời gian bắt đầu',
         enableSorting: true,
         enableMultiSort: true,
         enableResizing: false,
         cell: ({ getValue }) => {
            const value = getValue()
            return format(value, 'dd/MM/yyyy')
         }
      }),
      columnHelper.accessor('end_time', {
         header: 'Thời gian kết thúc',
         enableSorting: true,
         enableMultiSort: true,
         enableResizing: false,
         cell: ({ getValue }) => {
            const value = getValue()
            return format(value, 'dd/MM/yyyy')
         }
      }),
      columnHelper.accessor('status', {
         header: 'Trạng thái',
         enableColumnFilter: true,
         enableResizing: false,
         filterFn: 'equals',
         cell: ({ getValue }) => {
            const value = getValue() as string
            return (
               <Badge
                  className='whitespace-nowrap'
                  variant={
                     value === EventStatusValues.get(EventStatus.ACTIVE)
                        ? 'success'
                        : value === EventStatusValues.get(EventStatus.UPCOMING)
                          ? 'warning'
                          : 'destructive'
                  }
               >
                  {value}
               </Badge>
            )
         }
      }),
      columnHelper.accessor('id', {
         header: 'Thao tác',
         enableResizing: false,
         size: 64,
         enableHiding: false,
         cell: ({ cell }) => {
            const id = cell.getValue()
            return (
               <DataTableRowActions
                  canViewDetails={true}
                  canEdit={true}
                  canDelete={true}
                  onViewDetails={() => navigate(Paths.EVENT_STATISTICS_DETAILS.replace(':id', id.toString()))}
                  onEdit={() => navigate(Paths.EDIT_EVENT.replace(':id', id.toString()))}
                  onDelete={() => handleDeleteButtonClick(id)}
               />
            )
         }
      })
   ] as ColumnDef<EventInterface>[]

   return (
      <Box className='space-y-10'>
         <Box className='space-y-1'>
            <Typography variant='h6'>Danh sách sự kiện</Typography>
            <Typography variant='small' color='muted'>
               Danh sách liệt kê các sự kiện đã và đang tổ chức
            </Typography>
         </Box>
         <DataTable
            enableColumnResizing
            columns={columns}
            data={eventsList!}
            loading={isLoading}
            slot={
               <Tooltip content='Thêm mới'>
                  <Button variant='outline' className='h-8 w-8' size='icon' asChild>
                     <Link to={Paths.CREATE_EVENT}>
                        <Icon name='PlusCircle' />
                     </Link>
                  </Button>
               </Tooltip>
            }
         />
         <ConfirmDialog
            open={confirmDialogOpenState}
            onOpenStateChange={setConfirmDialogOpenState}
            title='Bạn chắc chắn muốn xóa sự kiện này?'
            description='Sự kiện này sau khi xóa khỏi hệ thống sẽ không thể được khôi phục.'
            onConfirm={handleDeleteEvent}
         />
      </Box>
   )
}

export default EventListPage
