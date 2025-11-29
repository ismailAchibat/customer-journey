import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LanguageSwitcher } from "./language-switcher";
import { useI18n } from "@/app/context/i18n";

export function AppSidebar() {
  const { t } = useI18n();

  const items = [
    {
      title: t('home'),
      url: "#",
      icon: Home,
    },
    {
      title: t('inbox'),
      url: "#",
      icon: Inbox,
    },
    {
      title: t('calendar'),
      url: "#",
      icon: Calendar,
    },
    {
      title: t('search'),
      url: "#",
      icon: Search,
    },
    {
      title: t('settings'),
      url: "#",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('application')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>{t('language')}</SidebarGroupLabel>
            <SidebarGroupContent>
                <LanguageSwitcher />
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}