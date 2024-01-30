import { EventStatusValues } from '@/common/constants/constants'
import { EventStatus, UserRoleEnum } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useQueryParams from '@/common/hooks/use-query-params'
import { EventInterface } from '@/common/types/entities'
import {
   Badge,
   Box,
   Button,
   DataTable,
   DataTableRowActions,
   DropdownMenuItem,
   Icon,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
   Typography
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import Tooltip from '@/components/ui/@override/tooltip'
import { useDeleteEventMutation, useGetEventsQuery, useGetJoinedEventsQuery } from '@/redux/apis/event.api'
import { useAppSelector } from '@/redux/hook'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import React, { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const EventListPage: React.FunctionComponent = () => {
   const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
   const [confirmDialogOpenState, setConfirmDialogOpenState] = useState<boolean>(false)
   const navigate = useNavigate()
   const [params, setParam] = useQueryParams('type')

   const user = useAppSelector((state) => state.auth.user)
   const { data: allEvents, isLoading } = useGetEventsQuery({ pagination: false, limit: 10 })
   const { data: joinedEvents } = useGetJoinedEventsQuery({ pagination: false })
   const [deleteEvent] = useDeleteEventMutation()

   const eventsList = useMemo(() => (params.type === 'joined' ? joinedEvents : allEvents) as Array<EventInterface>, [params.type, allEvents, joinedEvents])

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
                  enableEditing={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF].includes(user?.role)}
                  enableDeleting={user?.role === UserRoleEnum.MANAGER}
                  onEdit={() => navigate(Paths.EDIT_EVENT.replace(':id', id.toString()))}
                  onDelete={() => handleDeleteButtonClick(id)}
                  slot={
                     <DropdownMenuItem
                        className='flex items-center gap-x-3'
                        onClick={() => {
                           navigate(Paths.EVENT_STATISTICS_DETAILS.replace(':id', id.toString()))
                        }}
                     >
                        <Icon name='MousePointerClick' />
                        Chi tiết
                     </DropdownMenuItem>
                  }
               />
            )
         }
      })
   ] as ColumnDef<EventInterface>[]

   return (
      <Box className='space-y-10'>
         <Box className='flex items-center sm:flex-col sm:items-stretch sm:gap-y-6'>
            <Box className='flex-1 space-y-1'>
               <Typography variant='h6'>Danh sách sự kiện</Typography>
               <Typography variant='small' color='muted'>
                  Danh sách các sự kiện đã và đang tổ chức.
               </Typography>
            </Box>

            <Select defaultValue={params.type ?? 'all'} onValueChange={(value) => setParam('type', value)}>
               <SelectTrigger id='type-select' className='h-8 max-w-[16rem] sm:max-w-full'>
                  <Box className='flex items-center gap-x-2'>
                     <Icon name='ListFilter' />
                     <SelectValue placeholder='Lọc' />
                  </Box>
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value='all'>Tất cả</SelectItem>
                  <SelectItem value='joined'>Đã tham gia tổ chức</SelectItem>
               </SelectContent>
            </Select>
         </Box>

         <DataTable
            enableColumnResizing
            columns={columns}
            data={eventsList}
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
