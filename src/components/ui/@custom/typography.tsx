import { cn } from '@/common/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, useMemo, useRef } from 'react'

type TypographyProps = {
   as?: React.ElementType
} & React.HTMLAttributes<HTMLElement> &
   VariantProps<typeof typographyVariants> &
   React.PropsWithChildren

export const typographyVariants = cva('', {
   variants: {
      variant: {
         default: 'text-base tracking-tight',
         h1: 'text-6xl sm:text-5xl font-extrabold scroll-m-20 font-extrabold tracking-tight',
         h2: 'text-5xl sm:text-4xl font-bold scroll-m-20 tracking-tight',
         h3: 'text-4xl sm:text-3xl font-bold tracking-tight scroll-m-20',
         h4: 'text-3xl sm:text-2xl font-semibold tracking-tight scroll-m-20',
         h5: 'text-2xl sm:text-xl font-semibold tracking-tight scroll-m-20',
         h6: 'text-xl sm:text-lg font-semibold',
         p: 'leading-7',
         blockquote: 'mt-6 border-l-2 pl-6 italic',
         small: 'text-sm leading-snug'
      },
      color: {
         default: 'text-foreground',
         primary: 'text-primary',
         accent: 'accent',
         secondary: 'text-secondary',
         muted: 'text-muted-foreground',
         success: 'text-success',
         destructive: 'text-destructive'
      }
   },
   defaultVariants: {
      variant: 'default',
      color: 'default'
   }
})

export const Typography = forwardRef<HTMLElement, TypographyProps>((props, ref) => {
   const { as = 'p', className, children, color, variant, ...restProps } = props

   const localRef = useRef(null)
   const resolvedRef = ref ?? localRef

   const Element = useMemo(() => {
      if (!variant || variant === 'default' || as) return as
      return variant as React.ElementType
   }, [variant, as])

   return (
      <Element ref={resolvedRef} className={cn(typographyVariants({ variant, color, className }))} {...restProps}>
         {children}
      </Element>
   )
})
