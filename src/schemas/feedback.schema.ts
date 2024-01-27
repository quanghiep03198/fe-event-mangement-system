import { isEmpty } from 'lodash'
import { z } from 'zod'

export const FeedbackSchema = z.object({
   rating: z
      .string({ required_error: 'Vui lòng chọn đánh giá' })
      .or(z.number({ required_error: 'Vui lòng chọn đánh giá' }))
      .transform((value) => +value),
   content: z.string({ required_error: 'Vui lòng nhập nội dung feedback' }).refine((value) => !isEmpty(value), { message: 'Vui lòng nhập nội dung feedback' }),
   recommend: z.string().optional()
})
