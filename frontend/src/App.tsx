import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Dashboard } from "./pages/Dashboard"
import { SavedBooks } from "./pages/SavedBooks"
import { BookDetails } from "./pages/BookDetails"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/saved" element={<SavedBooks />} />
          <Route path="/book/:bookId" element={<BookDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
