import { UserRoleEnum } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import { useAppSelector } from '@/redux/hook'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Navigation = () => {
   const user = useAppSelector((state) => state.auth.user)
   const navigate = useNavigate()

   useEffect(() => {
      switch (user?.role) {
         case UserRoleEnum.STUDENT:
            navigate(Paths.EVENTS_BOARD)
            break
         case UserRoleEnum.STAFF:
            navigate(Paths.EVENTS_LIST)
            break
         case UserRoleEnum.MANAGER:
            navigate(Paths.MANAGER_DASHBOARD)
            break
         default:
            navigate(Paths.SIGNIN)
            break
      }
   }, [user])

   return null
}

export default Navigation
