import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"
import { Button } from "../components/ui/button"

export function SignUp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sign up with:", { firstName, lastName, email, password })
    // Add sign up logic here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              BookFlix
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-zinc-50">Create Account</h2>
          <p className="text-sm text-zinc-400">Enter your details to create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-zinc-200">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-zinc-200">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-zinc-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-zinc-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
            Sign Up
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link to="/signin" className="text-red-600 hover:text-red-500 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
