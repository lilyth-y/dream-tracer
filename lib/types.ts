// 타입 정의
export interface Dream {
  id: string
  userId: string
  title: string
  content: string
  date: Date
  emotion: string
  tags: string[]
  vividness: number
  isLucid: boolean
  sleepQuality: string
  dreamType: string
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Date
  preferences: {
    notifications: boolean
    reminderTime: string
    theme: "light" | "dark"
  }
}

export interface DreamStats {
  totalDreams: number
  thisMonth: number
  streak: number
  favoriteEmotion: string
  averageVividness: number
  lucidDreamCount: number
  mostUsedTags: string[]
}
