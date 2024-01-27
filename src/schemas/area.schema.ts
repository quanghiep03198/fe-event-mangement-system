import { z } from 'zod'

export const AreaSchema = z.object({
   name: z.string({ required_error: 'Vui lòng nhập tên khu vực/cơ sở' }),
   address: z.string({ required_error: 'Vui lòng nhập địa chỉ' })
})
