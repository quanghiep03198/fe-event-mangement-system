import { UserRoleValues } from '@/common/constants/constants'
import { UserRoleEnum } from '@/common/constants/enums'
import { Excel } from '@/common/libs/xlsx'
import { UserInterface } from '@/common/types/entities'
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
   Badge,
   Box,
   Button,
   DataTable,
   DataTableRowActions,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   Icon,
   Label,
   Typography
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import Tooltip from '@/components/ui/@override/tooltip'
import { useDeleteUserMutation, useGetUsersQuery, useImportUsersListMutation } from '@/redux/apis/user.api'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import CreateUserFormModal from '../components/shared/create-user-form-modal'
import UpdateUserFormModal from '../components/shared/update-user-form-modal'
import { sampleData } from './data/sample-data'
import { createFormData } from '@/common/utils/form-data'

type TableDataType = UserInterface & { index: number }

const excelHandler = new Excel<Pick<UserInterface, 'name' | 'code' | 'email' | 'phone'> & { index: string }>({
   index: 'STT',
   name: 'Họ tên',
   code: 'Mã sinh viên',
   email: 'Email',
   phone: 'Số điện thoại'
})

const StudentsListPage: React.FunctionComponent = () => {
   const { data, isLoading } = useGetUsersQuery({ role: UserRoleEnum.STUDENT, pagination: false })
   const [openConfirmState, setOpenConfirmState] = useState<boolean>(false)
   const [createFormOpenState, setCreateFormOpenState] = useState<boolean>(false)
   const [updateFormOpenState, setUpdateFormOpenState] = useState<boolean>(false)
   const [userToUpdate, setUserToUpdate] = useState<Partial<UserInterface>>({})
   const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
   const [deleteUser] = useDeleteUserMutation()
   const [importUsersList] = useImportUsersListMutation()

   const columnHelper = createColumnHelper<TableDataType>()

   const handleDeleteUser = useCallback(async () => {
      try {
         if (selectedRowId) {
            await deleteUser(selectedRowId).unwrap()
            toast.success('Đã xóa sinh viên')
         }
      } catch (error) {
         toast.error('Xóa sinh viên thất bại')
      } finally {
         setOpenConfirmState(false)
         setSelectedRowId(null)
      }
   }, [selectedRowId])

   const handleImportStudents: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (e.target.files instanceof FileList) {
         const payload = createFormData({ listUser: e.target.files[0] })
         toast.promise(importUsersList(payload).unwrap(), {
            loading: 'Đang import từ danh sách',
            success: () => {
               e.target.files = null
               return 'Tải lên danh sách thành công'
            },
            error: () => {
               e.target.files = null
               return 'Tải lên danh sách thất bại'
            }
         })
      }
   }

   const columns = [
      columnHelper.accessor('name', {
         header: 'Họ tên',
         enableColumnFilter: true,
         enableSorting: true,
         cell: ({ row }) => {
            return (
               <Box className='flex items-center gap-x-2'>
                  <Avatar>
                     <AvatarImage src={row.original.avatar} />
                     <AvatarFallback>{row.original?.name?.charAt(0) ?? 'A'}</AvatarFallback>
                  </Avatar>
                  <span className='whitespace-nowrap capitalize'>{row.original.name}</span>
               </Box>
            )
         }
      }),
      columnHelper.accessor('email', {
         header: 'Email',
         enableColumnFilter: true,
         enableSorting: true
      }),
      columnHelper.accessor('phone', {
         header: 'Số điện thoại',
         enableColumnFilter: true,
         enableSorting: true
      }),
      columnHelper.accessor('role', {
         header: 'Vai trò',
         enableGlobalFilter: false,
         cell: ({ getValue }) => {
            const value = getValue()
            return (
               <Badge variant='outline' className='whitespace-nowrap capitalize'>
                  {UserRoleValues.get(value)}
               </Badge>
            )
         }
      }),
      columnHelper.accessor('created_at', {
         header: 'Ngày tham gia',
         enableColumnFilter: true,
         enableSorting: true,
         enableGlobalFilter: false,
         filterFn: 'fuzzy',
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
                  canEdit
                  canDelete
                  onEdit={() => {
                     setUserToUpdate(row.original)
                     setUpdateFormOpenState(true)
                  }}
                  onDelete={() => {
                     setSelectedRowId(id)
                     setOpenConfirmState(true)
                  }}
               />
            )
         }
      })
   ]

   return (
      <>
         <Box className='space-y-10'>
            <Box className='space-y-1'>
               <Typography variant='h6'>Danh sách sinh viên</Typography>
               <Typography variant='small' color='muted'>
                  Danh sách hiển thị người dùng với vai trò là sinh viên
               </Typography>
            </Box>
            <DataTable
               columns={columns as ColumnDef<TableDataType>[]}
               data={data as UserInterface[]}
               loading={isLoading}
               slot={
                  <>
                     <Tooltip content='Tải file mẫu'>
                        <Button size='icon' variant='outline' className='h-8 w-8' onClick={() => excelHandler.exportData(sampleData)}>
                           <Icon name='Download' />
                        </Button>
                     </Tooltip>
                     <DropdownMenu>
                        <Tooltip content='Thêm mới'>
                           <DropdownMenuTrigger asChild>
                              <Button variant='outline' className='h-8 w-8' size='icon'>
                                 <Icon name='Plus' />
                              </Button>
                           </DropdownMenuTrigger>
                        </Tooltip>
                        <DropdownMenuContent align='end'>
                           <DropdownMenuItem asChild className='gap-x-2'>
                              <Label htmlFor='file'>
                                 <Icon name='FileUp' />
                                 Tải lên file Excel
                              </Label>
                           </DropdownMenuItem>
                           <DropdownMenuItem className='gap-x-2' onClick={() => setCreateFormOpenState(true)}>
                              <Icon name='FormInput' />
                              Nhập form
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </>
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
         <CreateUserFormModal openState={createFormOpenState} onOpenStateChange={setCreateFormOpenState} createForRole={UserRoleEnum.STUDENT} />
         <UpdateUserFormModal openState={updateFormOpenState} onOpenStateChange={setUpdateFormOpenState} defaultValue={userToUpdate} />
         <input type='file' className='hidden' id='file' onChange={handleImportStudents} />
      </>
   )
}

export default StudentsListPage
