"use client"

import { useState, useEffect } from "react"
import { Search, BookIcon, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Book {
  id: string
  title: string
  author: string
  category: string
  available: boolean
  coverImage: string
  borrowedBy?: string
  borrowedDate?: string
  dueDate?: string
}

interface BorrowHistory {
  id: string
  bookTitle: string
  borrower: string
  borrowedDate: string
  returnedDate?: string
  status: "borrowed" | "returned"
}

interface Member {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [history, setHistory] = useState<BorrowHistory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [currentMember, setCurrentMember] = useState<Member | null>(null)
  const router = useRouter()

  // ข้อมูลหนังสือตัวอย่าง
  useEffect(() => {
    const initialBooks: Book[] = [
      {
        id: "1",
        title: "แฮร์รี่ พอตเตอร์ กับศิลาอาถรรพ์",
        author: "J.K. Rowling",
        category: "นิยาย",
        available: true,
        coverImage: "/placeholder.svg?height=200&width=150&text=Harry+Potter",
      },
      {
        id: "2",
        title: "เศรษฐศาสตร์พอเพียง",
        author: "ศ.ดร.อภิชัย พันธเสน",
        category: "เศรษฐศาสตร์",
        available: true,
        coverImage: "/placeholder.svg?height=200&width=150&text=Economics",
      },
      {
        id: "3",
        title: "คิดเร็ว คิดช้า",
        author: "Daniel Kahneman",
        category: "จิตวิทยา",
        available: false,
        borrowedBy: "สมชาย ใจดี",
        borrowedDate: "2024-01-15",
        dueDate: "2024-01-29",
        coverImage: "/placeholder.svg?height=200&width=150&text=Thinking+Fast+Slow",
      },
      {
        id: "4",
        title: "ประวัติศาสตร์ไทย",
        author: "ศ.ดร.สุจิต วงษ์เทศ",
        category: "ประวัติศาสตร์",
        available: true,
        coverImage: "/placeholder.svg?height=200&width=150&text=Thai+History",
      },
      {
        id: "5",
        title: "การเขียนโปรแกรม JavaScript",
        author: "John Doe",
        category: "เทคโนโลยี",
        available: true,
        coverImage: "/placeholder.svg?height=200&width=150&text=JavaScript",
      },
    ]

    const savedBooks = localStorage.getItem("library-books")
    const savedHistory = localStorage.getItem("library-history")
    const savedCurrentMember = localStorage.getItem("library-current-member")

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks))
    } else {
      setBooks(initialBooks)
      localStorage.setItem("library-books", JSON.stringify(initialBooks))
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }

    if (savedCurrentMember) {
      setCurrentMember(JSON.parse(savedCurrentMember))
    }
  }, [])

  // กรองหนังสือตามคำค้นหา
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // ฟังก์ชันยืมหนังสือ
  const borrowBook = (book: Book) => {
    if (!currentMember) {
      alert("กรุณาเข้าสู่ระบบก่อนยืมหนังสือ")
      router.push("/login")
      return
    }

    const borrowedDate = new Date().toISOString().split("T")[0]
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const updatedBooks = books.map((b) =>
      b.id === book.id ? { ...b, available: false, borrowedBy: currentMember.name, borrowedDate, dueDate } : b,
    )

    const newHistoryEntry: BorrowHistory = {
      id: Date.now().toString(),
      bookTitle: book.title,
      borrower: currentMember.name,
      borrowedDate,
      status: "borrowed",
    }

    setBooks(updatedBooks)
    const updatedHistory = [...history, newHistoryEntry]
    setHistory(updatedHistory)
    localStorage.setItem("library-books", JSON.stringify(updatedBooks))
    localStorage.setItem("library-history", JSON.stringify(updatedHistory))

    setSelectedBook(null)
    alert("ยืมหนังสือเรียบร้อยแล้ว!")
  }

  // ฟังก์ชันคืนหนังสือ
  const returnBook = (book: Book) => {
    const returnedDate = new Date().toISOString().split("T")[0]

    const updatedBooks = books.map((b) =>
      b.id === book.id
        ? { ...b, available: true, borrowedBy: undefined, borrowedDate: undefined, dueDate: undefined }
        : b,
    )

    const updatedHistory = history.map((h) =>
      h.bookTitle === book.title && h.borrower === book.borrowedBy && h.status === "borrowed"
        ? { ...h, returnedDate, status: "returned" as const }
        : h,
    )

    setBooks(updatedBooks)
    setHistory(updatedHistory)
    localStorage.setItem("library-books", JSON.stringify(updatedBooks))
    localStorage.setItem("library-history", JSON.stringify(updatedHistory))

    alert("คืนหนังสือเรียบร้อยแล้ว!")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">รายการหนังสือ</h1>
          <p className="text-gray-600">ค้นหาและยืมหนังสือที่คุณสนใจ</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ค้นหาหนังสือ ชื่อผู้แต่ง หรือหมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-[3/4] relative bg-gray-100">
                <Image
                  src={book.coverImage || "/placeholder.svg"}
                  alt={`ปกหนังสือ ${book.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={book.available ? "default" : "destructive"}>{book.available ? "ว่าง" : "ถูกยืม"}</Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {book.author}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="text-sm text-gray-600">
                  <strong>หมวดหมู่:</strong> {book.category}
                </div>

                {!book.available && (
                  <div className="space-y-2 p-3 bg-red-50 rounded-lg">
                    <div className="text-sm">
                      <strong>ผู้ยืม:</strong> {book.borrowedBy}
                    </div>
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <strong>วันที่ยืม:</strong> {book.borrowedDate}
                    </div>
                    <div className="text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <strong>วันที่ต้องคืน:</strong> {book.dueDate}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {book.available ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1" onClick={() => setSelectedBook(book)}>
                          ยืมหนังสือ
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>ยืมหนังสือ</DialogTitle>
                          <DialogDescription>ยืนยันการยืมหนังสือ "{book.title}"</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="w-20 h-28 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={book.coverImage || "/placeholder.svg"}
                                alt={`ปกหนังสือ ${book.title}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{book.title}</h3>
                              <p className="text-sm text-gray-600">{book.author}</p>
                              <p className="text-sm text-gray-500">{book.category}</p>
                            </div>
                          </div>
                          {currentMember && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm">
                                <strong>ผู้ยืม:</strong> {currentMember.name}
                              </p>
                              <p className="text-sm">
                                <strong>อีเมล:</strong> {currentMember.email}
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button onClick={() => borrowBook(book)} className="flex-1">
                              ยืนยันการยืม
                            </Button>
                            <Button variant="outline" onClick={() => setSelectedBook(null)} className="flex-1">
                              ยกเลิก
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => returnBook(book)}>
                      คืนหนังสือ
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบหนังสือที่ค้นหา</p>
          </div>
        )}
      </div>
    </div>
  )
}
