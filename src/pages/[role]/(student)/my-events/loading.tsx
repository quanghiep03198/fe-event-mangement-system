import { Box } from '@/components/ui'
import { HorizontalPlaceholderCard } from '../components/shared/event-placeholder-card'

const Loading: React.FunctionComponent = () => {
   const presetItems = Array.apply(null, Array(6)).map((_, i) => i)
   return (
      <Box className='grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2 md:gap-x-4 lg:grid-cols-3'>
         {presetItems.map((item) => (
            <HorizontalPlaceholderCard key={item} />
         ))}
      </Box>
   )
}

export default Loading
