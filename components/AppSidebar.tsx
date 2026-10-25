"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BlocksIcon, CircleUserRound, GlobeIcon, HomeIcon, ShieldAlertIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { title: "Home", href: "/", icon: HomeIcon },
  { title: "Sites", href: "/sites", icon: GlobeIcon },
  { title: "Findings", href: "/findings", icon: ShieldAlertIcon }, //Dummies for now
  { title: "Plugins", href: "/plugins", icon: BlocksIcon },
  { title: "IAM", href: "/iam", icon: CircleUserRound },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <span className="font-heading font-bold">Scan Suite</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ title, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={pathname === href}
                    tooltip={title}
                    render={<Link href={href} />}
                  >
                    <Icon />
                    <span>{title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
