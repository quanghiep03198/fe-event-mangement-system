import { Paths } from '@/common/constants/pathnames'
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
   Icon,
   Typography
} from '@/components/ui'
import Tooltip from '@/components/ui/@override/tooltip'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { signout } from '@/redux/slices/auth.slice'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const UserActions: React.FunctionComponent = () => {
   const user = useAppSelector((state) => state.auth?.user)
   const dispatch = useAppDispatch()

   const handleSignout = () => {
      dispatch(signout())
      localStorage.removeItem('access_token')
      toast.info('Đã đăng xuất thành công')
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className='flex items-center space-x-2 focus:border-none focus:outline-none sm:space-x-1'>
            <Avatar className='h-9 w-9'>
               <AvatarImage src={user?.avatar} className='rounded-full object-cover object-center' width={32} height={32} />
               <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Tooltip content={user?.name!}>
               <Typography variant='small' className='line-clamp-1 max-w-[128px] pl-1 pr-2 text-left text-sm font-normal capitalize sm:hidden'>
                  {user?.name}
               </Typography>
            </Tooltip>
            <Icon name='ChevronDown' className='sm:hidden' />
         </DropdownMenuTrigger>
         <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
               <Link to={Paths.ACCOUNT_SETTINGS}>
                  Tài khoản của tôi
                  <DropdownMenuShortcut>
                     <Icon name='User' />
                  </DropdownMenuShortcut>
               </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleSignout}>
               Đăng xuất
               <DropdownMenuShortcut>
                  <Icon name='LogOut' />
               </DropdownMenuShortcut>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

export default UserActions
