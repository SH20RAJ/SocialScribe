"use client"

import { StackProvider } from "@stackframe/stack"
import { stackServerApp } from "@/stack"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackServerApp}>
      {children}
    </StackProvider>
  )
}