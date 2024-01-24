import ThemeSelect from '@/pages/components/theme-select'
import { Box } from '@/components/ui'
import Banner from './components/banner'
import FormFooter from './components/form-footer'
import FormHeader from './components/form-header'
import FormBody from './components/form-body'

const Signup: React.FunctionComponent = () => {
   return (
      <Box className='relative flex h-screen w-full items-stretch overflow-hidden scrollbar-none'>
         <Box className='fixed right-2 top-2'>
            <ThemeSelect />
         </Box>
         <Banner />
         <Box className='flex h-full w-full basis-1/2 flex-col gap-10 overflow-y-auto py-10 scrollbar-none sm:basis-full sm:p-3 md:basis-full md:p-10 lg:basis-full lg:p-10'>
            <FormHeader />
            <FormBody />
            <FormFooter />
         </Box>
      </Box>
   )
}

export default Signup
