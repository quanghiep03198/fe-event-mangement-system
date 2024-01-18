import { Box } from '@/components/ui'
import { HorizontalPlaceholderCard } from '../components/shared/event-placeholder-card'

const Loading: React.FunctionComponent = () => {
   const presetItems = Array.apply(null, Array(12)).map((_, i) => i)
   return (
      <Box className='grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-1 md:grid-cols-1'>
         {presetItems.map((item) => (
            <HorizontalPlaceholderCard key={item} />
         ))}
      </Box>
   )
}

export default Loading
