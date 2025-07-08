// 프로필 페이지 (완전히 새로 구현)
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { updateProfile, updatePassword } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, ArrowLeft, User, Camera, Bell, Shield, Save, Star, Trophy, Palette } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    bio: "",
    dreamGoal: "",
    favoriteTheme: "",
    joinDate: "",
  })

  const [preferences, setPreferences] = useState({
    notifications: {
      dreamReminder: true,
      weeklyReport: true,
      communityUpdates: false,
      aiInsights: true,
    },
    privacy: {
      profilePublic: false,
      shareStats: true,
      allowMessages: true,
    },
    display: {
      theme: "light" as "light" | "dark" | "auto",
      language: "ko",
      dateFormat: "korean",
    },
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [stats, setStats] = useState({
    totalDreams: 47,
    lucidDreams: 12,
    streak: 5,
    joinedDays: 120,
    achievements: ["첫 꿈 기록", "일주일 연속", "루시드 드림 달성"],
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        bio: "꿈을 통해 자아를 탐구하는 여행자입니다.",
        dreamGoal: "매일 꿈 기록하기",
        favoriteTheme: "자연",
        joinDate: user.metadata.creationTime
          ? new Date(user.metadata.creationTime).toLocaleDateString("ko-KR")
          : "2024년 1월",
      })
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      // Firebase가 설정된 경우에만 실제 업데이트
      const isFirebaseConfigured =
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key"

      if (isFirebaseConfigured) {
        await updateProfile(user, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL,
        })
      }

      alert("프로필이 업데이트되었습니다.")
    } catch (error) {
      console.error("Profile update error:", error)
      alert("프로필 업데이트에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setLoading(true)
    try {
      // 데모 모드에서는 로컬 URL 사용
      const isFirebaseConfigured =
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key"

      if (isFirebaseConfigured && storage) {
        const imageRef = ref(storage, `profile-images/${user.uid}`)
        await uploadBytes(imageRef, file)
        const downloadURL = await getDownloadURL(imageRef)
        setProfileData({ ...profileData, photoURL: downloadURL })
      } else {
        // 데모 모드: 로컬 URL 사용
        const localURL = URL.createObjectURL(file)
        setProfileData({ ...profileData, photoURL: localURL })
      }

      alert("프로필 사진이 업데이트되었습니다.")
    } catch (error) {
      console.error("Image upload error:", error)
      alert("이미지 업로드에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.")
      return
    }

    setLoading(true)
    try {
      const isFirebaseConfigured =
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key"

      if (isFirebaseConfigured) {
        await updatePassword(user, passwordData.newPassword)
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      alert("비밀번호가 변경되었습니다.")
    } catch (error) {
      console.error("Password update error:", error)
      alert("비밀번호 변경에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Moon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">로그인이 필요합니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="preferences">환경설정</TabsTrigger>
            <TabsTrigger value="security">보안</TabsTrigger>
            <TabsTrigger value="achievements">성취</TabsTrigger>
          </TabsList>

          {/* 프로필 탭 */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 프로필 정보 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>기본 정보</CardTitle>
                    <CardDescription>프로필 정보를 수정할 수 있습니다</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      {/* 프로필 사진 */}
                      <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profileData.photoURL || "/placeholder.svg"} />
                          <AvatarFallback className="text-lg">
                            {profileData.displayName?.charAt(0) || user.email?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-image"
                          />
                          <label htmlFor="profile-image">
                            <Button variant="outline" size="sm" asChild>
                              <span className="cursor-pointer">
                                <Camera className="h-4 w-4 mr-2" />
                                사진 변경
                              </span>
                            </Button>
                          </label>
                          <p className="text-xs text-gray-500">JPG, PNG 파일만 지원</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">이름</Label>
                          <Input
                            id="displayName"
                            value={profileData.displayName}
                            onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                            placeholder="이름을 입력하세요"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">이메일</Label>
                          <Input id="email" type="email" value={profileData.email} disabled className="bg-gray-50" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">자기소개</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          placeholder="자신을 소개해주세요"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dreamGoal">꿈 목표</Label>
                          <Input
                            id="dreamGoal"
                            value={profileData.dreamGoal}
                            onChange={(e) => setProfileData({ ...profileData, dreamGoal: e.target.value })}
                            placeholder="예: 매일 꿈 기록하기"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="favoriteTheme">좋아하는 꿈 테마</Label>
                          <Select
                            value={profileData.favoriteTheme}
                            onValueChange={(value) => setProfileData({ ...profileData, favoriteTheme: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="테마 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="자연">자연</SelectItem>
                              <SelectItem value="모험">모험</SelectItem>
                              <SelectItem value="판타지">판타지</SelectItem>
                              <SelectItem value="일상">일상</SelectItem>
                              <SelectItem value="추억">추억</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? "저장 중..." : "프로필 저장"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* 프로필 미리보기 */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>프로필 미리보기</CardTitle>
                    <CardDescription>다른 사용자에게 보이는 모습</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={profileData.photoURL || "/placeholder.svg"} />
                        <AvatarFallback>{profileData.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{profileData.displayName || "이름 없음"}</h3>
                      <p className="text-sm text-gray-500">{profileData.bio || "자기소개가 없습니다"}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">꿈 목표</span>
                        <span>{profileData.dreamGoal || "없음"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">좋아하는 테마</span>
                        <span>{profileData.favoriteTheme || "없음"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">가입일</span>
                        <span>{profileData.joinDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 환경설정 탭 */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 알림 설정 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    알림 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>꿈 기록 리마인더</Label>
                      <p className="text-xs text-gray-500">매일 저녁 알림</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.dreamReminder}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, dreamReminder: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>주간 리포트</Label>
                      <p className="text-xs text-gray-500">일주일 꿈 분석</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.weeklyReport}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, weeklyReport: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>커뮤니티 업데이트</Label>
                      <p className="text-xs text-gray-500">새 게시물 알림</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.communityUpdates}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, communityUpdates: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>AI 인사이트</Label>
                      <p className="text-xs text-gray-500">AI 분석 결과</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.aiInsights}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, aiInsights: checked },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 개인정보 설정 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    개인정보 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>프로필 공개</Label>
                      <p className="text-xs text-gray-500">다른 사용자에게 프로필 공개</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.profilePublic}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          privacy: { ...preferences.privacy, profilePublic: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>통계 공유</Label>
                      <p className="text-xs text-gray-500">꿈 통계 정보 공유</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.shareStats}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          privacy: { ...preferences.privacy, shareStats: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>메시지 허용</Label>
                      <p className="text-xs text-gray-500">다른 사용자의 메시지 수신</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.allowMessages}
                      onCheckedChange={(checked) =>
                        setPreferences({
                          ...preferences,
                          privacy: { ...preferences.privacy, allowMessages: checked },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 화면 설정 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-600" />
                    화면 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>테마</Label>
                    <Select
                      value={preferences.display.theme}
                      onValueChange={(value: "light" | "dark" | "auto") =>
                        setPreferences({
                          ...preferences,
                          display: { ...preferences.display, theme: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">라이트 모드</SelectItem>
                        <SelectItem value="dark">다크 모드</SelectItem>
                        <SelectItem value="auto">시스템 설정</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>언어</Label>
                    <Select
                      value={preferences.display.language}
                      onValueChange={(value) =>
                        setPreferences({
                          ...preferences,
                          display: { ...preferences.display, language: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ko">한국어</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>날짜 형식</Label>
                    <Select
                      value={preferences.display.dateFormat}
                      onValueChange={(value) =>
                        setPreferences({
                          ...preferences,
                          display: { ...preferences.display, dateFormat: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="korean">2024년 1월 15일</SelectItem>
                        <SelectItem value="international">15/01/2024</SelectItem>
                        <SelectItem value="american">01/15/2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 보안 탭 */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  비밀번호 변경
                </CardTitle>
                <CardDescription>보안을 위해 정기적으로 비밀번호를 변경하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="현재 비밀번호"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="새 비밀번호"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="새 비밀번호 확인"
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    <Shield className="h-4 w-4 mr-2" />
                    {loading ? "변경 중..." : "비밀번호 변경"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 성취 탭 */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 통계 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    나의 통계
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalDreams}</div>
                      <div className="text-sm text-gray-600">총 꿈 기록</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.lucidDreams}</div>
                      <div className="text-sm text-gray-600">루시드 드림</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
                      <div className="text-sm text-gray-600">연속 기록</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{stats.joinedDays}</div>
                      <div className="text-sm text-gray-600">가입 일수</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 성취 배지 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    성취 배지
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.achievements.map((achievement) => (
                      <div key={achievement.id || achievement.name} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
