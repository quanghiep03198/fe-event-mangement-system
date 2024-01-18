import { UserRoleEnum } from '@/common/constants/enums'
import { useAppSelector } from '@/redux/hook'

type PrivateComponentProps = { roles: Array<UserRoleEnum> } & React.PropsWithChildren

const PrivateComponent: React.FC<PrivateComponentProps> = (props) => {
   const user = useAppSelector((state) => state.auth.user)
   return props.roles.includes(user?.role!) ? props.children : null
}

export default PrivateComponent
