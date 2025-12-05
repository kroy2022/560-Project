import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Landing } from "./pages/Landing"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { Dashboard } from "./pages/Dashboard"
import { BookDetails } from "./pages/BookDetails"
import { Authors } from "./pages/Authors"
import { AuthorPage } from "./components/AuthorPage"
import { AllBooks } from "./pages/AllBooks"
import AuthGuard from "./pages/AuthGuard"

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
          <Route path="/book" element={
              <AuthGuard>
                <BookDetails />
              </AuthGuard>
            } />
          <Route path="/authors" element={
              <AuthGuard>
                <Authors />
              </AuthGuard>
            } />
          <Route path="/author/:authorId" element={
              <AuthGuard>
                <AuthorPage />
              </AuthGuard>
            } />
          <Route path="/books" element={
              <AuthGuard>
                <AllBooks />
              </AuthGuard>
            } />
        </Routes>
    </BrowserRouter>
  )
}

export default App
