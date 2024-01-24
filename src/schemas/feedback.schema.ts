import { z } from 'zod'

export const FeedbackSchema = z.object({
   rating: z.string({ required_error: 'Vui lòng chọn đánh giá' }).transform((value) => +value),
   content: z.string({ required_error: 'Vui lòng nhập nội dung feedback' })
})
