"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Home, BookOpen, PlusCircle, BarChart3, User, Users, Brain, Palette, Bell } from "lucide-react"

export default function TopNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "홈" },
    { href: "/dreams", icon: BookOpen, label: "꿈 일기" },
    { href: "/write", icon: PlusCircle, label: "작성" },
    { href: "/stats", icon: BarChart3, label: "통계" },
    { href: "/community", icon: Users, label: "커뮤니티" },
    { href: "/dejavu", icon: Brain, label: "데자뷰" },
    { href: "/visualize", icon: Palette, label: "시각화" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between pointer-events-auto">
      {/* 좌측: 로고 */}
      <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-500">
        <span role="img" aria-label="moon">🌙</span> 드림아이
      </Link>
      {/* 중앙: 주요 메뉴 */}
      <nav className="hidden md:flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href
              return (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink active={isActive} className="flex items-center gap-1 px-4 py-2 text-base font-medium hover:text-indigo-600 transition-colors">
                      <IconComponent className="w-5 h-5" />
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      {/* 우측: 알림, 프로필 */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="알림">
          <Bell className="w-6 h-6 text-gray-500" />
        </button>
        <Link href="/profile" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold">N</div>
          <span className="hidden md:inline text-base font-semibold text-gray-700">프로필</span>
        </Link>
      </div>
    </header>
  )
} 