import { UserRoleValues } from '@/common/constants/constants'
import { UserRoleEnum } from '@/common/constants/enums'
import { UserInterface } from '@/common/types/entities'
import { Avatar, AvatarFallback, AvatarImage, Badge, Box, Button, DataTable, DataTableRowActions, Icon, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import Tooltip from '@/components/ui/@override/tooltip'
import { useDeleteUserMutation, useGetUsersQuery } from '@/redux/apis/user.api'
import { useAppSelector } from '@/redux/hook'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'
import UpdateUserFormModal from '../components/shared/update-user-form-modal'
import CreateUserFormModal from '../components/shared/create-user-form-modal'

const StaffsListPage: React.FunctionComponent = () => {
   const user = useAppSelector((state) => state.auth.user)
   const { data, isLoading } = useGetUsersQuery({ pagination: false, role: UserRoleEnum.STAFF })
   const [openConfirmState, setOpenConfirmState] = useState<boolean>(false)
   const [createFormOpenState, setCreateFormOpenState] = useState<boolean>(false)
   const [updateFormOpenState, setUpdateFormOpenState] = useState<boolean>(false)
   const [userToUpdate, setUserToUpdate] = useState<Partial<UserInterface>>({})
   const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

   const [deleteParticipant] = useDeleteUserMutation()
   const columnHelper = createColumnHelper<Partial<UserInterface>>()

   const handleDeleteUser = useCallback(async () => {
      try {
         if (selectedRowId) {
            await deleteParticipant(selectedRowId).unwrap()
            toast.success('Đã xóa cộng tác viên')
         }
      } catch (error) {
         toast.error('Xóa cộng tác viên thất bại')
      } finally {
         setOpenConfirmState(false)
         setSelectedRowId(null)
      }
   }, [selectedRowId])

   const handleUpdateButtonClick = useCallback((participant: Partial<UserInterface>) => {
      setUserToUpdate(participant)
      setUpdateFormOpenState(true)
   }, [])

   const columns = [
      columnHelper.accessor('name', {
         header: 'Họ tên',
         enableColumnFilter: true,
         enableSorting: true,
         cell: ({ row }) => (
            <Box className='flex items-center gap-x-2'>
               <Avatar className='z-0 items-center'>
                  <AvatarImage className='relative z-[0] aspect-[1] h-8 w-8 rounded-full' src={row.original?.avatar} />
                  <AvatarFallback>F</AvatarFallback>
               </Avatar>
               <span className='whitespace-nowrap'>{row.original?.name}</span>
            </Box>
         )
      }),
      columnHelper.accessor('email', {
         header: 'Email',
         enableColumnFilter: true,
         enableSorting: true
      }),
      columnHelper.accessor('phone', {
         header: 'Số điện thoại',
         enableColumnFilter: true,
         enableSorting: true,
         cell: ({ getValue }) => {
            const value = getValue()
            return value ? (
               value
            ) : (
               <Typography variant='small' color='muted' className='italic'>
                  Chưa cập nhật
               </Typography>
            )
         }
      }),
      columnHelper.accessor('role', {
         header: 'Vai trò',
         cell: ({ getValue }) => {
            const value = getValue()
            return (
               <Badge variant='outline' className='whitespace-nowrap capitalize'>
                  {UserRoleValues.get(value!)}
               </Badge>
            )
         }
      }),
      columnHelper.accessor('id', {
         header: 'Thao tác',
         cell: ({ getValue, row }) => {
            const id = getValue()!
            return (
               <DataTableRowActions
                  enableEditing
                  enableDeleting
                  onEdit={() => handleUpdateButtonClick(row.original)}
                  onDelete={() => {
                     setOpenConfirmState(true)
                     setSelectedRowId(id)
                  }}
               />
            )
         }
      })
   ] as ColumnDef<Partial<UserInterface>>[]

   return (
      <>
         <Box className='space-y-10'>
            <Box className='space-y-1'>
               <Typography variant='h6'>Danh sách cộng tác viên</Typography>
               <Typography variant='small' color='muted'>
                  Danh sách hiển thị người dùng với vai trò là cộng tác viên
               </Typography>
            </Box>
            <DataTable
               enableColumnResizing={false}
               data={data as Partial<UserInterface>[]}
               loading={isLoading}
               columns={columns}
               slot={
                  <Tooltip content='Thêm mới'>
                     <Button variant='outline' className='h-8 w-8' size='icon' onClick={() => setCreateFormOpenState(true)}>
                        <Icon name='Plus' />
                     </Button>
                  </Tooltip>
               }
            />
         </Box>

         <ConfirmDialog
            open={openConfirmState}
            onOpenStateChange={setOpenConfirmState}
            title='Bạn chắc chắn muốn tiếp tục?'
            description='Hành động này không thể khôi phục. Người dùng này sẽ bị xóa vĩnh viễn khỏi hệ thống.'
            onConfirm={handleDeleteUser}
         />
         <CreateUserFormModal openState={createFormOpenState} onOpenStateChange={setCreateFormOpenState} createForRole={UserRoleEnum.STAFF} />
         <UpdateUserFormModal openState={updateFormOpenState} onOpenStateChange={setUpdateFormOpenState} defaultValue={userToUpdate} />
      </>
   )
}

export default StaffsListPage
