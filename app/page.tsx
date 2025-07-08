"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useDreams } from "@/hooks/useDreams"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import {
  Moon,
  PlusCircle,
  BookOpen,
  Calendar as CalendarIcon,
  Heart,
  Sparkles,
  TrendingUp,
  Clock,
  ImageIcon,
  Brain,
  Palette,
  Users,
  Zap,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Navigation } from "@/components/layout/navigation"
import type { Dream } from "@/lib/types"
import FeatureCards from "@/components/ui/feature-cards"
import InfoWidgets from "@/components/ui/info-widgets"

// 슈팅스타 컴포넌트
type ShootingStarProps = Readonly<{ top: number; left: number; animationDelay: string }>
function ShootingStar({ top, left, animationDelay }: ShootingStarProps) {
  return (
    <div
      className="shooting-star"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        animationDelay,
      }}
      aria-hidden="true"
    />
  )
}
// 별 컴포넌트
type DreamStarProps = Readonly<{ left: number; top: number; animationDelay: string; id: string }>
function DreamStar({ left, top, animationDelay, id }: DreamStarProps) {
  return (
    <div
      key={id}
      className="dream-star"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        animationDelay,
      }}
      aria-hidden="true"
    />
  )
}

export default function LucidDreamDiary() {
  const router = useRouter()
  const { dreams, loading } = useDreams()
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dreamTip, setDreamTip] = useState("")

  const dreamTips = [
    "꿈을 더 생생하게 기억하려면 잠에서 깨자마자 바로 기록하는 것이 좋습니다.",
    "루시드 드림을 위해 하루 종일 '지금 꿈을 꾸고 있나?'라고 자문해보세요.",
    "꿈 일기를 쓸 때는 감정과 색깔, 소리 등 세부사항도 함께 적어보세요.",
    "명상과 규칙적인 수면 패턴이 꿈의 질을 향상시킵니다.",
    "꿈 속에서 손을 보는 연습을 하면 루시드 드림에 도움이 됩니다.",
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    setDreamTip(dreamTips[Math.floor(Math.random() * dreamTips.length)])
    return () => clearInterval(timer)
  }, [])

  const recentDreams = dreams.slice(0, 3)

  function calculateStreak(dreams: Dream[]): number {
    if (!dreams || dreams.length === 0) return 0
    const days = Array.from(
      new Set(
        dreams.map((d: Dream) => {
          const date = new Date(d.date)
          date.setHours(0, 0, 0, 0)
          return date.getTime()
        })
      )
    ).sort((a: number, b: number) => b - a)
    let streak = 0
    let today = new Date()
    today.setHours(0, 0, 0, 0)
    for (const day of days) {
      if (day === today.getTime() - 86400000 * streak) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const dreamDates = Array.from(
    new Set(
      dreams.map((d: Dream) => {
        const date = new Date(d.date)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })
    )
  ).map((ts: number) => new Date(ts))

  const stats = {
    totalDreams: dreams.length,
    thisMonth: dreams.filter((dream) => {
      const now = new Date()
      const dreamDate = new Date(dream.date)
      return dreamDate.getMonth() === now.getMonth() && dreamDate.getFullYear() === now.getFullYear()
    }).length,
    streak: calculateStreak(dreams),
    favoriteEmotion: "기쁨",
    lucidDreams: dreams.filter((dream) => dream.isLucid).length,
  }

  const getMoonPhase = () => {
    const phases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
    const day = currentTime.getDate()
    return phases[day % 8]
  }

  // 별 위치 useMemo로 고정
  const stars = useMemo(
    () =>
      Array.from({ length: 20 }, () => ({
        id: crypto.randomUUID(),
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: `${Math.random() * 3}s`,
      })),
    []
  )

  if (loading) {
    return (
      <div className="min-h-screen dreamy-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Moon className="h-16 w-16 text-purple-600 animate-pulse mx-auto mb-4 float-animation" />
            <ShootingStar top={20} left={20} animationDelay="0s" />
            <ShootingStar top={40} left={60} animationDelay="1s" />
            <ShootingStar top={10} left={100} animationDelay="2s" />
          </div>
          <p className="text-gray-600 neon-text">꿈의 세계로 들어가는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative pb-16">      
      {/* 배경 별들 */}
      <div className="fixed inset-0 pointer-events-none -z-5">
        {stars.map((star) => (
          <DreamStar key={star.id} id={star.id} left={star.left} top={star.top} animationDelay={star.animationDelay} />
        ))}
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">나의 꿈 일기장</h1>
            <p className="text-sm text-gray-500">{currentTime.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs">
              <PlusCircle className="h-4 w-4 mr-1" />
              새 기록
            </Button>
          </div>
        </div>

        {/* 주요 기능 카드 영역 */}
        {/* 주요 기능 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCards />
        </div>

        {/* 정보/통계/팁 위젯 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoWidgets stats={{
            ...stats,
            monthGoal: 15 // 예시: 이번 달 목표 15회
          }} currentTime={currentTime} dreamTip={dreamTip} />
        </div>

        {/* 최근 꿈 일기 섹션 */}
        <Card className="glass-effect shadow-lg rounded-2xl overflow-hidden border-0">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg font-semibold">최근 꿈 일기</CardTitle>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  {recentDreams.length}개
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                모두 보기
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentDreams.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="relative inline-block">
                  <Moon className="h-16 w-16 text-indigo-200 mx-auto mb-4 animate-float" />
                  <div className="absolute -inset-2 bg-indigo-100 rounded-full opacity-50 blur-md -z-10"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">기록된 꿈이 없어요</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">오늘 본 꿈을 기록하고, 나만의 꿈 일기를 시작해보세요</p>
                <Button
                  onClick={() => router.push("/write")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300 px-6 py-2 rounded-full font-medium"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  첫 꿈 기록하기
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentDreams.map((dream) => (
                  <button
                    key={dream.id}
                    type="button"
                    className="w-full text-left p-5 hover:bg-white/50 transition-all duration-300 flex flex-col gap-2 group relative overflow-hidden card-hover-effect"
                    onClick={() => router.push(`/dreams/${dream.id}`)}
                    tabIndex={0}
                    aria-label={`꿈 일기: ${dream.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") router.push(`/dreams/${dream.id}`)
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-indigo-700 transition-colors">{dream.title}</h4>
                      <div className="flex items-center space-x-2 text-xs">
                        {dream.images.length > 0 && (
                          <span className="text-indigo-400">
                            <ImageIcon className="h-3.5 w-3.5" />
                          </span>
                        )}
                        {dream.isLucid && (
                          <span className="text-amber-400">
                            <Sparkles className="h-3.5 w-3.5" />
                          </span>
                        )}
                        <span className="text-gray-500 bg-white/50 px-2 py-0.5 rounded-full">
                          {new Date(dream.date).toLocaleDateString("ko-KR", {month: 'numeric', day: 'numeric'})}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 text-left group-hover:text-gray-800 transition-colors">{dream.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <Badge 
                          variant="secondary" 
                          className="text-[11px] h-6 px-2 bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200 transition-colors"
                        >
                          {dream.emotion}
                        </Badge>
                        {dream.tags.slice(0, 2).map((tag, idx) => (
                          <Badge 
                            key={`${dream.id}-tag-${tag}-${idx}`} 
                            variant="outline" 
                            className="text-[11px] h-6 px-2 bg-white/70 text-gray-600 border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {dream.tags.length > 2 && (
                          <Badge 
                            variant="outline" 
                            className="text-[11px] h-6 px-2 bg-white/70 text-gray-400 border-gray-200"
                          >
                            +{dream.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>{dream.vividness}/5</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
