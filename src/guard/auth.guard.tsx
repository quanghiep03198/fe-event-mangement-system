import { Paths } from '@/common/constants/pathnames'
import { useAppSelector } from '@/redux/hook'
import { Navigate } from 'react-router-dom'

const AuthGuard: React.FC<React.PropsWithChildren> = (props) => {
   const authenticated = useAppSelector((state) => state.auth.authenticated)
   return authenticated ? props.children : <Navigate to={Paths.LOGIN} />
}

export default AuthGuard
