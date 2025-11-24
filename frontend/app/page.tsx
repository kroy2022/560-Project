"use client"

import dynamic from "next/dynamic"

// Dynamically import the React app to avoid SSR issues with React Router
const App = dynamic(() => import("../src/App"), { ssr: false })

export default function Page() {
  return <App />
}
