"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  avatar?: string
}

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  members: Member[]
  setMembers: (members: Member[]) => void
  setCurrentMember: (member: Member) => void
}

export function AuthDialog({ isOpen, onClose, members, setMembers, setCurrentMember }: AuthDialogProps) {
  const [loginEmail, setLoginEmail] = useState("")
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
  })

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

    setCurrentMember(member)
    localStorage.setItem("library-current-member", JSON.stringify(member))
    alert(`ยินดีต้อนรับ ${member.name}!`)
    onClose()
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

    setCurrentMember(newMember)
    localStorage.setItem("library-current-member", JSON.stringify(newMember))

    alert(`สมัครสมาชิกเรียบร้อย! ยินดีต้อนรับ ${newMember.name}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>เข้าสู่ระบบห้องสมุด</DialogTitle>
          <DialogDescription>เข้าสู่ระบบหรือสมัครสมาชิกใหม่</DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  )
}
