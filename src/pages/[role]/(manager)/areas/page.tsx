import { AreaInterface } from '@/common/types/entities'
import { Box, Button, DataTable, DataTableRowActions, Icon, Typography } from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import { useDeleteAreaMutation, useGetAllAreasQuery } from '@/redux/apis/area.api'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import CreateAreaFormDialog from './components/create-area-form-dialog'
import UpdateAreaFormDialog from './components/update-area-form-dialog'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'

const AreasListPage: React.FunctionComponent = () => {
   const { data } = useGetAllAreasQuery({ pagination: false })
   const [createAreaDialogOpen, setCreateAreaDialogOpen] = useState<boolean>(false)
   const [updateAreaDialogOpen, setUpdateAreaDialogOpen] = useState<boolean>(false)
   const [deleteAreaDialogOpen, setDeleteAreaDialogOpen] = useState<boolean>(false)
   const [selectedArea, setSelectedArea] = useState<AreaInterface | null>(null)
   const columnHelper = createColumnHelper<AreaInterface>()
   const [deleteArea, deleteAreaResult] = useDeleteAreaMutation()

   const handleDeleteArea = (id: number) => {
      toast.promise(deleteArea(id).unwrap(), {
         loading: 'Đang xóa cơ sở ...',
         success: 'Đã xóa cơ sở',
         error: (error) => {
            return error.data?.message
         }
      })
   }

   const handleOpenCreateAreaForm = useCallback(setCreateAreaDialogOpen, [])
   const handleOpenUpdateAreaForm = useCallback(setUpdateAreaDialogOpen, [])

   const columns = [
      columnHelper.accessor('name', {
         header: 'Tên cơ sở',
         size: 256,
         enableSorting: true,
         enableColumnFilter: true
      }),
      columnHelper.accessor('address', {
         header: 'Địa chỉ',
         size: 320,
         enableSorting: true,
         enableColumnFilter: true,
         cell: ({ getValue }) => {
            const value = getValue()
            return <span className='capitalize'>{value}</span>
         }
      }),
      columnHelper.accessor('created_at', {
         header: 'Ngày tạo',
         enableSorting: true,
         enableColumnFilter: true,
         cell: ({ getValue }) => {
            const value = getValue()
            return format(value, 'dd/MM/yyyy')
         }
      }),
      columnHelper.accessor('updated_at', {
         header: 'Cập nhật lần gần nhất',
         enableSorting: true,
         enableColumnFilter: true,
         cell: ({ getValue }) => {
            const value = getValue()
            return format(value, 'dd/MM/yyyy')
         }
      }),
      columnHelper.accessor('id', {
         header: 'Thao tác',
         enableSorting: true,
         enableColumnFilter: true,
         cell: ({ row }) => {
            return (
               <DataTableRowActions
                  enableEditing={true}
                  enableDeleting={true}
                  onDelete={() => {
                     setSelectedArea(row.original)
                     setDeleteAreaDialogOpen(true)
                  }}
                  onEdit={() => {
                     console.log('row.original', row.original)
                     handleOpenUpdateAreaForm(true)
                     setSelectedArea(row.original)
                  }}
               />
            )
         }
      })
   ]

   return (
      <>
         <Box className='space-y-10'>
            <Box className='space-y-2'>
               <Typography variant='h6'>Danh sách cơ sở</Typography>
               <Typography variant='small' color='muted'>
                  Danh sách các cơ sở hiện của FPT Polytechnic
               </Typography>
            </Box>
            <DataTable
               data={data ?? []}
               columns={columns}
               enableColumnResizing={true}
               slot={
                  <Tooltip content='Thêm mới'>
                     <Button size='icon' className='h-8 w-8' variant='outline' onClick={() => handleOpenCreateAreaForm(true)}>
                        <Icon name='PlusCircle' />
                     </Button>
                  </Tooltip>
               }
            />
         </Box>
         <CreateAreaFormDialog open={createAreaDialogOpen} onOpenChange={handleOpenCreateAreaForm} />
         <UpdateAreaFormDialog
            open={updateAreaDialogOpen}
            selectedArea={selectedArea}
            onOpenChange={handleOpenUpdateAreaForm}
            onAfterUpdate={setSelectedArea}
         />
         <ConfirmDialog
            open={deleteAreaDialogOpen}
            onOpenStateChange={setDeleteAreaDialogOpen}
            title='Bạn chắc chắn muốn tiếp tục'
            description='Cơ sở sau khi bị xóa không thể khôi phục và có thể ảnh hưởng đến các thông tin liên quan'
            onConfirm={() => {
               if (!deleteAreaResult.isLoading) {
                  handleDeleteArea(selectedArea.id)
                  setSelectedArea(null)
               }
            }}
         />
      </>
   )
}

export default AreasListPage
