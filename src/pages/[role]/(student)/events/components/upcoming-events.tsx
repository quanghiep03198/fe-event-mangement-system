import 'swiper/css'
import 'swiper/css/navigation'
import { Box, Button, Icon } from '@/components/ui'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { useGetUpcomingEventsQuery } from '@/redux/apis/event.api'
import { EventCard } from './event-card'

const UpcomingEvents = () => {
   const { data } = useGetUpcomingEventsQuery()
   console.log('data', data)
   return (
      <Box className='relative mx-auto max-w-3xl sm:max-w-full'>
         <Swiper
            navigation={{
               prevEl: '.header-slide-prev-btn',
               nextEl: '.header-slide-next-btn'
            }}
            modules={[Navigation, Autoplay]}
            className='header-slide !z-0 [&.swiper-wrapper]:!z-0'
            loop={true}
            spaceBetween={100}
            autoplay={{
               delay: 2500,
               disableOnInteraction: false
            }}
            slidesPerView={1}
         >
            {Array.isArray(data) &&
               data.map((item, index) => (
                  <SwiperSlide key={index} className='z-0 flex items-center justify-center text-center font-medium uppercase sm:h-12 sm:w-3/5 sm:text-xs'>
                     <EventCard data={item} />
                  </SwiperSlide>
               ))}
         </Swiper>
         <Button size='icon' variant='ghost' className='header-slide-prev-btn absolute left-0 top-1/2 z-50 -translate-y-1/2 text-base'>
            <Icon name='ChevronLeft' />
         </Button>

         <Button size='icon' variant='ghost' className='header-slide-next-btn absolute right-0 top-1/2 z-50 -translate-y-1/2 text-base'>
            <Icon name='ChevronRight' />
         </Button>
      </Box>
   )
}

export default UpcomingEvents
