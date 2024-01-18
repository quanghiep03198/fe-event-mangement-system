import BannerImage from '@/assets/images/image.webp'
import { Box, Typography } from '@/components/ui'
import { Description, Image, Logo } from './styled'

const Banner: React.FunctionComponent = () => {
   return (
      <Box className='relative flex h-screen basis-1/2 flex-col justify-between gap-y-12 !bg-zinc-950/90 p-10 text-white bg-blend-overlay dark:!bg-zinc-500/10 sm:hidden md:hidden lg:hidden'>
         <Image src={BannerImage} alt='banner' />
         <Logo src='/logo.webp' />
         <Typography variant='h3' className='translate-y-1/3 justify-self-start !leading-[4rem] text-white'>
            Đăng ký để tham gia những sự kiện vô cùng hấp dẫn ngay bây giờ.
         </Typography>
         <Description className='text-white'>©2023 FPT Polytechic College, Inc. All rights reserved.</Description>
      </Box>
   )
}

export default Banner
