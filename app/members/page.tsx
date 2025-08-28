"use client"

import { useState, useEffect } from "react"
import { User, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [currentMember, setCurrentMember] = useState<Member | null>(null)

  useEffect(() => {
    const savedMembers = localStorage.getItem("library-members")
    const savedCurrentMember = localStorage.getItem("library-current-member")

    if (savedMembers) {
      setMembers(JSON.parse(savedMembers))
    }

    if (savedCurrentMember) {
      setCurrentMember(JSON.parse(savedCurrentMember))
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">รายชื่อสมาชิก</h1>
            <p className="text-gray-600">จัดการสมาชิกห้องสมุด</p>
          </div>
          <Link href="/login">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              เพิ่มสมาชิกใหม่
            </Button>
          </Link>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">ยังไม่มีสมาชิกในระบบ</p>
            <Link href="/login">
              <Button className="mt-4">
                <UserPlus className="h-4 w-4 mr-2" />
                สมัครสมาชิกคนแรก
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-sm text-gray-500">{member.phone}</p>
                      <p className="text-xs text-gray-400">สมาชิกตั้งแต่: {member.joinDate}</p>
                    </div>
                    {currentMember?.id === member.id && <Badge variant="default">คุณ</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
