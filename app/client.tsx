"use client"
import "../i18n"
// 루트 레이아웃 업데이트 (에러 처리 개선)
import type { PropsWithChildren } from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/layout/navigation"
import TopNavigation from "@/components/layout/top-navigation"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "@/components/auth/login-form"
import { Moon, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { FloatingNotice } from "@/components/ui/floating-notice"
import LanguageSwitcher from "@/components/ui/language-switcher"

const inter = Inter({ subsets: ["latin"] })

function AIHelpButton() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { role: "ai", text: "안녕하세요! 꿈 기록, 해석, 시각화 등 궁금한 점을 물어보세요." }
  ])
  const sendMessage = async () => {
    if (!input.trim()) return
    setMessages([...messages, { role: "user", text: input }])
    const userMsg = input
    setInput("")
    try {
      const res = await fetch("/api/ai-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }])
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "AI 답변 생성에 실패했습니다." }])
    }
  }
  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white rounded-full shadow-lg p-4 hover:bg-indigo-700 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="AI 도움말 열기"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 w-80 max-w-full bg-white rounded-xl shadow-2xl p-4 z-50 border">
          <div className="font-bold mb-2">AI 도우미</div>
          <div className="h-40 overflow-y-auto text-sm mb-2 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "ai" ? "text-indigo-700" : "text-gray-800 text-right"}>{msg.text}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage() }}
              placeholder="AI에게 물어보세요..."
            />
            <button className="bg-indigo-500 text-white px-3 py-1 rounded" onClick={sendMessage}>전송</button>
          </div>
        </div>
      )}
    </>
  )
}

function AuthWrapper({ children }: Readonly<PropsWithChildren<unknown>>) {
  const { user, loading, error } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Moon className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">연결 오류</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">데모 모드로 전환됩니다...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <>
      <TopNavigation />
      {children}
      <Navigation />
      <AIHelpButton />
      <FloatingNotice />
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<PropsWithChildren<unknown>>) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50`}>
        <AuthWrapper>
          <div className="flex flex-col min-h-screen">
            <TopNavigation />
            <div className="flex flex-1 overflow-hidden">
              <Navigation className="w-64 border-r hidden md:block bg-white/80 backdrop-blur-sm" />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto w-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <AIHelpButton />
          <FloatingNotice />
          <LanguageSwitcher className="fixed bottom-4 left-4 z-50" />
        </AuthWrapper>
      </body>
    </html>
  )
}
