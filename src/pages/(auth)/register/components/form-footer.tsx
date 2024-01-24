import { Paths } from '@/common/constants/pathnames'
import { Link } from 'react-router-dom'
import { Paragraph } from './styled'
import { Divider } from '../../../../components/ui/@custom/divider'

const FormFooter: React.FunctionComponent = () => {
   return (
      <>
         <Divider>hoặc</Divider>
         <Paragraph className='text-center'>
            Đã có tài khoản?{' '}
            <Link to={Paths.LOGIN} className='font-medium text-primary'>
               Đăng nhập
            </Link>
         </Paragraph>
      </>
   )
}

export default FormFooter
