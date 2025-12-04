import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"
import { Button } from "../components/ui/button"
import axios from "axios"
import { API_URL } from "../api/routes"
import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Sign in with:", { email, password })

    try {
      const response = await axios.post(`${API_URL}/auth/signin`, {
        email: email,
        password: password
      })

      console.log("MADE API CALL: ", response)

      if (response.data.isValid) {
        localStorage.setItem('bookflix-user_id', response.data.userID);
        localStorage.setItem('bookflix-name', response.data.firstName + ' ' + response.data.lastName);

        const user_id = localStorage.getItem("bookflix-user_id");
        const user_name = localStorage.getItem("bookflix-name");
        console.log("LOCAL STORAGE VALUES: ", user_id, " - ", user_name)
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error signing in:", error)
      alert("Failed to sign in. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
        <Navbar showSearchBar={false} />
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
          <div className="w-full max-w-md">
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 shadow-2xl">
              <div className="flex flex-col items-center gap-4 mb-8">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <BookOpen className="h-8 w-8 text-red-600" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                    BookFlix
                  </span>
                </Link>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-zinc-50 mb-2">Welcome Back</h2>
                  <p className="text-sm text-zinc-400">Enter your credentials to access your account</p>
                </div>
              </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-200">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-200">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-500">Or</span>
                </div>
              </div>

              <p className="text-center text-sm text-zinc-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-red-600 hover:text-red-500 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </form>
            </div>
          </div>
        </div>
    </div>
  )
}
