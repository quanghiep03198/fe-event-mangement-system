import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import {
   Button,
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuSeparator,
   Icon
} from '@/components/ui'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import Tooltip from '../../components/ui/@override/tooltip'

const ThemeSelect: React.FunctionComponent = () => {
   const { theme, setTheme } = useTheme()
   const currentThemeIcon: React.ComponentProps<typeof Icon>['name'] = theme === Theme.LIGHT ? 'Sun' : 'Moon'

   return (
      <DropdownMenu>
         <Tooltip content='Theme'>
            <DropdownMenuTrigger asChild className='ring-0 focus:border-none focus:outline-none'>
               <Button variant='ghost' className='rounded-full' size='icon'>
                  <Icon name={currentThemeIcon} />
               </Button>
            </DropdownMenuTrigger>
         </Tooltip>
         <DropdownMenuContent className='w-48'>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={theme} onValueChange={(theme) => setTheme(theme as Theme)}>
               <DropdownMenuRadioItem value={Theme.LIGHT}>Light</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value={Theme.DARK}>Dark</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}

export default ThemeSelect
