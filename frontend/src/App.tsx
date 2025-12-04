import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { Dashboard } from "./pages/Dashboard"
import { SavedBooks } from "./pages/SavedBooks"
import { BookDetails } from "./pages/BookDetails"
import { Authors } from "./pages/Authors"
import AuthGuard from "./pages/AuthGuard"

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
          <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
          <Route path="/saved" element={
              <AuthGuard>
                <SavedBooks />
              </AuthGuard>
            } />
          <Route path="/book/:bookId" element={
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
                <Authors />
              </AuthGuard>
            } />  
        </Routes>
    </BrowserRouter>
  )
}

export default App
