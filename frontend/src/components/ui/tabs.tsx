"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

const Tabs = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const handleValueChange = onValueChange || setInternalValue

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("inline-flex h-10 items-center justify-center rounded-md bg-zinc-800 p-1 text-zinc-400", className)}
      {...props}
    />
  ),
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value: triggerValue, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const isActive = context.value === triggerValue

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-zinc-950 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-zinc-950 text-zinc-50 shadow-sm" : "hover:bg-zinc-900 hover:text-zinc-50",
        className,
      )}
      onClick={() => context.onValueChange(triggerValue)}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, value: contentValue, children, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsContent must be used within Tabs")

    if (context.value !== contentValue) return null

    return (
      <div
        ref={ref}
        className={cn(
          "mt-2 ring-offset-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
