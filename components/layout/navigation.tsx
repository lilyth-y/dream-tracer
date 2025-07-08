// 네비게이션 컴포넌트 (업데이트)
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, BookOpen, PlusCircle, BarChart3, User, Users, Brain, Palette } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "홈", badge: null },
    { href: "/dreams", icon: BookOpen, label: "꿈 일기", badge: null },
    { href: "/write", icon: PlusCircle, label: "작성", badge: null },
    { href: "/stats", icon: BarChart3, label: "통계", badge: null },
    { href: "/community", icon: Users, label: "커뮤니티", badge: "NEW" },
    { href: "/dejavu", icon: Brain, label: "데자뷰", badge: null },
    { href: "/visualize", icon: Palette, label: "시각화", badge: null },
    { href: "/profile", icon: User, label: "프로필", badge: null },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 md:hidden overflow-x-auto">
      <div className="flex items-center justify-between min-w-max">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="flex flex-col gap-1 h-auto py-2 px-2 relative min-w-[60px]"
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
                {item.badge && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-8 p-0 text-xs bg-red-500">{item.badge}</Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
