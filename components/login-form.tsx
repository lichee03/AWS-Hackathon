"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [selectedToken, setSelectedToken] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = () => {
    if (selectedToken && login(selectedToken)) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">FMCG Analytics</CardTitle>
          <CardDescription>Select your brand to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select your brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coca-cola-token">Coca-Cola</SelectItem>
              <SelectItem value="pepsi-token">Pepsi</SelectItem>
              <SelectItem value="admin-token">Platform Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleLogin} className="w-full" disabled={!selectedToken}>
            Access Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
