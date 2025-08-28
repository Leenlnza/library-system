// Global variables
let books = []
let history = []

// Initialize sample data
function initializeData() {
  // Sample books
  const sampleBooks = [
    {
      id: "1",
      title: "แฮร์รี่ พอตเตอร์ กับศิลาอาถรรพ์",
      author: "J.K. Rowling",
      category: "นิยาย",
      available: true,
      coverImage: "https://via.placeholder.com/150x200/4f46e5/ffffff?text=Harry+Potter",
    },
    {
      id: "2",
      title: "เศรษฐศาสตร์พอเพียง",
      author: "ศ.ดร.อภิชัย พันธเสน",
      category: "เศรษฐศาสตร์",
      available: true,
      coverImage: "https://via.placeholder.com/150x200/059669/ffffff?text=Economics",
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
      borrowerPhone: "081-234-5678",
      coverImage: "https://via.placeholder.com/150x200/dc2626/ffffff?text=Thinking",
    },
    {
      id: "4",
      title: "ประวัติศาสตร์ไทย",
      author: "ศ.ดร.สุจิต วงษ์เทศ",
      category: "ประวัติศาสตร์",
      available: true,
      coverImage: "https://via.placeholder.com/150x200/d97706/ffffff?text=History",
    },
    {
      id: "5",
      title: "การเขียนโปรแกรม JavaScript",
      author: "John Doe",
      category: "เทคโนโลยี",
      available: true,
      coverImage: "https://via.placeholder.com/150x200/7c3aed/ffffff?text=JavaScript",
    },
  ]

  // Load data from localStorage or use sample data
  books = JSON.parse(localStorage.getItem("library-books")) || sampleBooks
  history = JSON.parse(localStorage.getItem("library-history")) || []

  // Save sample data if not exists
  if (!localStorage.getItem("library-books")) {
    localStorage.setItem("library-books", JSON.stringify(sampleBooks))
  }
}

// Check if book is overdue
function isOverdue(dueDate) {
  const today = new Date()
  const due = new Date(dueDate)
  return today > due
}

// Calculate days overdue
function getDaysOverdue(dueDate) {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = today - due
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

// Load and display books
function loadBooks() {
  initializeData()
  const booksGrid = document.getElementById("booksGrid")
  const noResults = document.getElementById("noResults")

  if (!booksGrid) return

  if (books.length === 0) {
    booksGrid.style.display = "none"
    noResults.style.display = "block"
    return
  }

  booksGrid.innerHTML = ""
  books.forEach((book) => {
    const bookCard = createBookCard(book)
    booksGrid.appendChild(bookCard)
  })
}

// Create book card element
function createBookCard(book) {
  const card = document.createElement("div")
  card.className = "book-card"

  let statusClass = book.available ? "status-available" : "status-borrowed"
  let statusText = book.available ? "ว่าง" : "ถูกยืม"

  // Check if overdue
  if (!book.available && book.dueDate && isOverdue(book.dueDate)) {
    statusClass = "status-overdue"
    statusText = "เกินกำหนด"
  }

  const borrowedInfo = !book.available
    ? `
        <div class="book-borrowed-info ${isOverdue(book.dueDate) ? "overdue" : ""}">
            <p><strong>ผู้ยืม:</strong> ${book.borrowedBy}</p>
            <p><strong>เบอร์โทร:</strong> ${book.borrowerPhone || "ไม่ระบุ"}</p>
            <p><i class="fas fa-calendar"></i> <strong>วันที่ยืม:</strong> ${book.borrowedDate}</p>
            <p><i class="fas fa-calendar"></i> <strong>วันที่ต้องคืน:</strong> ${book.dueDate}</p>
            ${isOverdue(book.dueDate) ? `<p style="color: #ef4444; font-weight: bold;"><i class="fas fa-exclamation-triangle"></i> เกินกำหนด ${getDaysOverdue(book.dueDate)} วัน</p>` : ""}
        </div>
    `
    : ""

  card.innerHTML = `
        <div class="book-cover">
            <img src="${book.coverImage}" alt="ปกหนังสือ ${book.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\"fas fa-book\\"></i>'">
            <div class="book-status ${statusClass}">
                ${statusText}
            </div>
        </div>
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">
                <i class="fas fa-user"></i>
                ${book.author}
            </p>
            <p class="book-category"><strong>หมวดหมู่:</strong> ${book.category}</p>
            ${borrowedInfo}
            <div class="book-actions">
                ${
                  book.available
                    ? `<button class="btn btn-primary" onclick="openBorrowModal('${book.id}')">ยืมหนังสือ</button>`
                    : `<button class="btn btn-danger" onclick="returnBook('${book.id}')">คืนหนังสือ</button>`
                }
            </div>
        </div>
    `

  return card
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById("searchInput")
  if (!searchInput) return

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    const filteredBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm),
    )

    displayFilteredBooks(filteredBooks)
  })
}

// Display filtered books
function displayFilteredBooks(filteredBooks) {
  const booksGrid = document.getElementById("booksGrid")
  const noResults = document.getElementById("noResults")

  if (filteredBooks.length === 0) {
    booksGrid.style.display = "none"
    noResults.style.display = "block"
    return
  }

  noResults.style.display = "none"
  booksGrid.style.display = "grid"
  booksGrid.innerHTML = ""

  filteredBooks.forEach((book) => {
    const bookCard = createBookCard(book)
    booksGrid.appendChild(bookCard)
  })
}

// Borrow modal functionality
function setupBorrowModal() {
  const modal = document.getElementById("borrowModal")
  const closeBtn = document.querySelector(".modal-close")
  const cancelBtn = document.getElementById("cancelBorrowBtn")

  if (!modal) return

  closeBtn.addEventListener("click", closeBorrowModal)
  cancelBtn.addEventListener("click", closeBorrowModal)

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeBorrowModal()
    }
  })
}

// Open borrow modal
function openBorrowModal(bookId) {
  const book = books.find((b) => b.id === bookId)
  if (!book) return

  const modal = document.getElementById("borrowModal")
  const modalBookCover = document.getElementById("modalBookCover")
  const modalBookTitle = document.getElementById("modalBookTitle")
  const modalBookAuthor = document.getElementById("modalBookAuthor")
  const modalBookCategory = document.getElementById("modalBookCategory")
  const confirmBtn = document.getElementById("confirmBorrowBtn")

  modalBookCover.src = book.coverImage
  modalBookTitle.textContent = book.title
  modalBookAuthor.textContent = book.author
  modalBookCategory.textContent = book.category

  confirmBtn.onclick = () => borrowBook(bookId)

  modal.classList.add("show")
}

// Close borrow modal
function closeBorrowModal() {
  const modal = document.getElementById("borrowModal")
  modal.classList.remove("show")

  // Clear form
  document.getElementById("borrowerName").value = ""
  document.getElementById("borrowerPhone").value = ""
}

// Borrow book
function borrowBook(bookId) {
  const book = books.find((b) => b.id === bookId)
  const borrowerName = document.getElementById("borrowerName").value.trim()
  const borrowerPhone = document.getElementById("borrowerPhone").value.trim()

  if (!book) return

  if (!borrowerName) {
    alert("กรุณาใส่ชื่อผู้ยืม")
    return
  }

  const borrowedDate = new Date().toISOString().split("T")[0]
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  // Update book
  book.available = false
  book.borrowedBy = borrowerName
  book.borrowerPhone = borrowerPhone
  book.borrowedDate = borrowedDate
  book.dueDate = dueDate

  // Add to history
  const historyEntry = {
    id: Date.now().toString(),
    bookTitle: book.title,
    borrower: borrowerName,
    borrowerPhone: borrowerPhone,
    borrowedDate: borrowedDate,
    dueDate: dueDate,
    status: "borrowed",
  }
  history.push(historyEntry)

  // Save to localStorage
  localStorage.setItem("library-books", JSON.stringify(books))
  localStorage.setItem("library-history", JSON.stringify(history))

  closeBorrowModal()
  loadBooks()
  alert("ยืมหนังสือเรียบร้อยแล้ว!")
}

// Return book
function returnBook(bookId) {
  const book = books.find((b) => b.id === bookId)
  if (!book) return

  const returnedDate = new Date().toISOString().split("T")[0]

  // Update book
  book.available = true
  const borrowerName = book.borrowedBy
  delete book.borrowedBy
  delete book.borrowerPhone
  delete book.borrowedDate
  delete book.dueDate

  // Update history
  const historyEntry = history.find(
    (h) => h.bookTitle === book.title && h.borrower === borrowerName && h.status === "borrowed",
  )
  if (historyEntry) {
    historyEntry.returnedDate = returnedDate
    historyEntry.status = "returned"
  }

  // Save to localStorage
  localStorage.setItem("library-books", JSON.stringify(books))
  localStorage.setItem("library-history", JSON.stringify(history))

  loadBooks()
  alert("คืนหนังสือเรียบร้อยแล้ว!")
}

// Load borrowed books
function loadBorrowedBooks() {
  initializeData()
  const borrowedList = document.getElementById("borrowedList")
  const noBorrowed = document.getElementById("noBorrowed")

  if (!borrowedList) return

  const borrowedBooks = books.filter((book) => !book.available)

  if (borrowedBooks.length === 0) {
    borrowedList.style.display = "none"
    noBorrowed.style.display = "block"
    return
  }

  noBorrowed.style.display = "none"
  borrowedList.style.display = "block"
  borrowedList.innerHTML = ""

  borrowedBooks.forEach((book) => {
    const borrowedItem = document.createElement("div")
    borrowedItem.className = `borrowed-item ${isOverdue(book.dueDate) ? "overdue" : ""}`

    borrowedItem.innerHTML = `
            <div class="borrowed-info">
                <h3>
                    <i class="fas fa-book"></i>
                    ${book.title}
                    ${isOverdue(book.dueDate) ? '<i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>' : ""}
                </h3>
                <p><strong>ผู้แต่ง:</strong> ${book.author}</p>
                <p><strong>หมวดหมู่:</strong> ${book.category}</p>
                <div class="borrowed-details">
                    <div><strong>ผู้ยืม:</strong> ${book.borrowedBy}</div>
                    <div><strong>เบอร์โทร:</strong> ${book.borrowerPhone || "ไม่ระบุ"}</div>
                    <div><strong>วันที่ยืม:</strong> ${book.borrowedDate}</div>
                    <div><strong>วันที่ต้องคืน:</strong> ${book.dueDate}</div>
                    ${isOverdue(book.dueDate) ? `<div style="color: #ef4444; font-weight: bold;"><strong>เกินกำหนด:</strong> ${getDaysOverdue(book.dueDate)} วัน</div>` : ""}
                </div>
            </div>
            <div class="borrowed-actions">
                <button class="btn btn-danger" onclick="returnBook('${book.id}')">คืนหนังสือ</button>
            </div>
        `

    borrowedList.appendChild(borrowedItem)
  })
}

// Setup borrower search
function setupBorrowerSearch() {
  const searchInput = document.getElementById("searchBorrower")
  if (!searchInput) return

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    const borrowedBooks = books.filter((book) => !book.available)
    const filteredBooks = borrowedBooks.filter(
      (book) => book.title.toLowerCase().includes(searchTerm) || book.borrowedBy.toLowerCase().includes(searchTerm),
    )

    displayFilteredBorrowedBooks(filteredBooks)
  })
}

// Display filtered borrowed books
function displayFilteredBorrowedBooks(filteredBooks) {
  const borrowedList = document.getElementById("borrowedList")
  const noBorrowed = document.getElementById("noBorrowed")

  if (filteredBooks.length === 0) {
    borrowedList.style.display = "none"
    noBorrowed.style.display = "block"
    return
  }

  noBorrowed.style.display = "none"
  borrowedList.style.display = "block"
  borrowedList.innerHTML = ""

  filteredBooks.forEach((book) => {
    const borrowedItem = document.createElement("div")
    borrowedItem.className = `borrowed-item ${isOverdue(book.dueDate) ? "overdue" : ""}`

    borrowedItem.innerHTML = `
            <div class="borrowed-info">
                <h3>
                    <i class="fas fa-book"></i>
                    ${book.title}
                    ${isOverdue(book.dueDate) ? '<i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>' : ""}
                </h3>
                <p><strong>ผู้แต่ง:</strong> ${book.author}</p>
                <p><strong>หมวดหมู่:</strong> ${book.category}</p>
                <div class="borrowed-details">
                    <div><strong>ผู้ยืม:</strong> ${book.borrowedBy}</div>
                    <div><strong>เบอร์โทร:</strong> ${book.borrowerPhone || "ไม่ระบุ"}</div>
                    <div><strong>วันที่ยืม:</strong> ${book.borrowedDate}</div>
                    <div><strong>วันที่ต้องคืน:</strong> ${book.dueDate}</div>
                    ${isOverdue(book.dueDate) ? `<div style="color: #ef4444; font-weight: bold;"><strong>เกินกำหนด:</strong> ${getDaysOverdue(book.dueDate)} วัน</div>` : ""}
                </div>
            </div>
            <div class="borrowed-actions">
                <button class="btn btn-danger" onclick="returnBook('${book.id}')">คืนหนังสือ</button>
            </div>
        `

    borrowedList.appendChild(borrowedItem)
  })
}

// Update summary
function updateSummary() {
  initializeData()

  const totalBooks = books.length
  const availableBooks = books.filter((book) => book.available).length
  const borrowedBooks = books.filter((book) => !book.available).length
  const overdueBooks = books.filter((book) => !book.available && book.dueDate && isOverdue(book.dueDate)).length

  const totalBooksEl = document.getElementById("totalBooks")
  const availableBooksEl = document.getElementById("availableBooks")
  const borrowedBooksEl = document.getElementById("borrowedBooks")
  const overdueBooksEl = document.getElementById("overdueBooks")

  if (totalBooksEl) totalBooksEl.textContent = totalBooks
  if (availableBooksEl) availableBooksEl.textContent = availableBooks
  if (borrowedBooksEl) borrowedBooksEl.textContent = borrowedBooks
  if (overdueBooksEl) overdueBooksEl.textContent = overdueBooks
}

// Load history
function loadHistory() {
  initializeData()
  const historyList = document.getElementById("historyList")
  const noHistory = document.getElementById("noHistory")

  if (!historyList) return

  if (history.length === 0) {
    historyList.style.display = "none"
    noHistory.style.display = "block"
    return
  }

  noHistory.style.display = "none"
  historyList.style.display = "block"

  displayHistory(history)
}

// Display history
function displayHistory(historyData) {
  const historyList = document.getElementById("historyList")
  historyList.innerHTML = ""

  // Sort by date (newest first)
  const sortedHistory = [...historyData].reverse()

  sortedHistory.forEach((record) => {
    const historyItem = document.createElement("div")
    historyItem.className = "history-item"

    historyItem.innerHTML = `
            <div class="history-info">
                <h3>
                    <i class="fas fa-book"></i>
                    ${record.bookTitle}
                </h3>
                <p><strong>ผู้ยืม:</strong> ${record.borrower}</p>
                <p><strong>เบอร์โทร:</strong> ${record.borrowerPhone || "ไม่ระบุ"}</p>
                <div class="history-dates">
                    <span><i class="fas fa-calendar"></i> วันที่ยืม: ${record.borrowedDate}</span>
                    <span><i class="fas fa-calendar"></i> วันที่ต้องคืน: ${record.dueDate}</span>
                    ${record.returnedDate ? `<span><i class="fas fa-calendar-check"></i> วันที่คืน: ${record.returnedDate}</span>` : ""}
                </div>
            </div>
            <div class="history-status ${record.status === "borrowed" ? "status-borrowed" : "status-returned"}">
                ${record.status === "borrowed" ? "กำลังยืม" : "คืนแล้ว"}
            </div>
        `

    historyList.appendChild(historyItem)
  })
}

// Setup history filter
function setupHistoryFilter() {
  const statusFilter = document.getElementById("statusFilter")
  const searchHistory = document.getElementById("searchHistory")

  if (statusFilter) {
    statusFilter.addEventListener("change", filterHistory)
  }

  if (searchHistory) {
    searchHistory.addEventListener("input", filterHistory)
  }
}

// Filter history
function filterHistory() {
  const statusFilter = document.getElementById("statusFilter")
  const searchHistory = document.getElementById("searchHistory")

  const statusValue = statusFilter ? statusFilter.value : "all"
  const searchValue = searchHistory ? searchHistory.value.toLowerCase() : ""

  let filteredHistory = history

  // Filter by status
  if (statusValue !== "all") {
    filteredHistory = filteredHistory.filter((record) => record.status === statusValue)
  }

  // Filter by search term
  if (searchValue) {
    filteredHistory = filteredHistory.filter(
      (record) =>
        record.bookTitle.toLowerCase().includes(searchValue) || record.borrower.toLowerCase().includes(searchValue),
    )
  }

  displayHistory(filteredHistory)
}
