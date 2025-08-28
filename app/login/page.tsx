"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
}

export default function LoginPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loginEmail, setLoginEmail] = useState("")
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const router = useRouter()

  useEffect(() => {
    const savedMembers = localStorage.getItem("library-members")
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers))
    }

    // ตรวจสอบว่าเข้าสู่ระบบแล้วหรือยัง
    const savedCurrentMember = localStorage.getItem("library-current-member")
    if (savedCurrentMember) {
      router.push("/")
    }
  }, [router])

  const handleLogin = () => {
    if (!loginEmail.trim()) {
      alert("กรุณาใส่อีเมล")
      return
    }

    const member = members.find((m) => m.email === loginEmail)
    if (!member) {
      alert("ไม่พบสมาชิกในระบบ กรุณาสมัครสมาชิกก่อน")
      return
    }

    localStorage.setItem("library-current-member", JSON.stringify(member))
    alert(`ยินดีต้อนรับ ${member.name}!`)
    router.push("/")
  }

  const handleRegister = () => {
    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.phone.trim()) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    // ตรวจสอบอีเมลซ้ำ
    if (members.some((m) => m.email === registerData.email)) {
      alert("อีเมลนี้มีในระบบแล้ว")
      return
    }

    const newMember: Member = {
      id: Date.now().toString(),
      ...registerData,
      joinDate: new Date().toISOString().split("T")[0],
    }

    const updatedMembers = [...members, newMember]
    setMembers(updatedMembers)
    localStorage.setItem("library-members", JSON.stringify(updatedMembers))
    localStorage.setItem("library-current-member", JSON.stringify(newMember))

    alert(`สมัครสมาชิกเรียบร้อย! ยินดีต้อนรับ ${newMember.name}`)
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">ระบบห้องสมุด</h2>
          <p className="mt-2 text-gray-600">เข้าสู่ระบบหรือสมัครสมาชิกใหม่</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">เข้าสู่ระบบ</TabsTrigger>
            <TabsTrigger value="register">สมัครสมาชิก</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">เข้าสู่ระบบ</CardTitle>
                <CardDescription>ใส่อีเมลของคุณเพื่อเข้าสู่ระบบ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="login-email">อีเมล</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <Button onClick={handleLogin} className="w-full">
                  เข้าสู่ระบบ
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">สมัครสมาชิก</CardTitle>
                <CardDescription>กรอกข้อมูลเพื่อสมัครสมาชิกใหม่</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="register-name">ชื่อ-นามสกุล</Label>
                  <Input
                    id="register-name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="ชื่อ นามสกุล"
                  />
                </div>
                <div>
                  <Label htmlFor="register-email">อีเมล</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="register-phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="register-phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="08x-xxx-xxxx"
                  />
                </div>
                <Button onClick={handleRegister} className="w-full">
                  สมัครสมาชิก
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
