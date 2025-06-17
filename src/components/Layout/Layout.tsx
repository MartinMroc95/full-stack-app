import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Route } from 'src/constants'
import { Button } from 'components/ui/button'
import { Separator } from 'components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from 'components/ui/sidebar'

const routes = [
  {
    key: 'main',
    title: 'Main',
    url: Route.Base,
  },
  {
    key: 'account',
    title: 'Account',
    url: Route.Account,
  },
]

interface Props {
  children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  const router = useRouter()

  return (
    <div className="flex w-full">
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <button type="button" className="bg-transparent border-none p-0 m-0 cursor-pointer">
                  <span className="text-base font-semibold">Car Manager</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {routes.map((route) => {
                const isActive = router.pathname === route.url
                const itemTitle = route.title
                return (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={itemTitle}>
                      <Link href={route.url}>
                        <span className="group-data-[state=collapsed]:hidden">{itemTitle}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>

      <div className="w-full grow">
        <header className="flex sticky top-0 z-10 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
          <div className="flex w-full items-center gap-1 p-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1 " />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                <a
                  href="https://github.com/MartinMroc95"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="dark:text-foreground"
                >
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
