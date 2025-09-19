"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode"


interface DecodedIdToken {
  sub: string
  email: string
  "cognito:groups"?: string[]
  [key: string]: any
}

interface User {
  id: string
  email: string
  brand: string
  role: "brand" | "admin"
  companyData?: CompanyRegistration
}

interface CompanyRegistration {
  // Company / Brand identity
  companyName: string
  brandNames: string[]
  companyId?: string
  contactPerson: string
  contactEmail: string
  accountAdmin: string
  accountAdminEmail: string
  logoUrl?: string

  // Operational metadata
  rvmPartnerIds: string[]
  defaultCurrency: string
  defaultRegion: string
  materialMappingPreference: string

  // Product data
  products: ProductData[]

  // Targets & policy
  sustainabilityTargets: string
  reportingBoundary: string
  verificationStatus: "self-reported" | "third-party-verified"
  certificateUrl?: string

  // Permissions
  consentPublicDashboard: boolean
  consentDataSharing: boolean
}

interface ProductData {
  id: string
  sku?: string
  barcode?: string
  packagingType: string
  materials: { material: string; percentage: number }[]
  unitWeight: number
  recyclability: "yes" | "no" | "partial"
  recyclabilityComments?: string
}

interface AuthContextType {
  user: User | null
  login: () => void
  logout: () => void
  signup: () => void
  updateCompanyData: (data: Partial<CompanyRegistration>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

useEffect(() => {
  const storedTokens = localStorage.getItem("fmcg-tokens")
  if (storedTokens) {
    const { id_token } = JSON.parse(storedTokens)
    const decoded: DecodedIdToken = jwtDecode(id_token)

    const userData: User = {
      id: decoded.sub,
      email: decoded.email,
      brand: decoded["custom:brand"] || "Unknown",
      role: decoded["cognito:groups"]?.includes("admin") ? "admin" : "brand",
    }

    setUser(userData)
  }
}, [])

  // const login = (token: string): boolean => {
  //   // Mock authentication logic
  //   let userData: User | null = null

  //   switch (token) {
  //     case "coca-cola-token":
  //       userData = {
  //         id: "1",
  //         email: "admin@coca-cola.com",
  //         brand: "Coca-Cola",
  //         role: "brand",
  //       }
  //       break
  //     case "pepsi-token":
  //       userData = {
  //         id: "2",
  //         email: "admin@pepsi.com",
  //         brand: "Pepsi",
  //         role: "brand",
  //       }
  //       break
  //     case "admin-token":
  //       userData = {
  //         id: "admin",
  //         email: "admin@fmcganalytics.com",
  //         brand: "Platform Admin",
  //         role: "admin",
  //       }
  //       break
  //     default:
  //       return false
  //   }

  //   if (userData) {
  //     setUser(userData)
  //     localStorage.setItem("fmcg-user", JSON.stringify(userData))
  //     return true
  //   }
  //   return false
  // }

const login = () => {
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
  const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!

  const url = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`
  window.location.href = url
}



const signup = () => {
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
  const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!

  const url = `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`
  window.location.href = url
}



  const updateCompanyData = (data: Partial<CompanyRegistration>) => {
    if (user) {
      const updatedUser = {
        ...user,
        companyData: { ...user.companyData, ...data } as CompanyRegistration,
      }
      setUser(updatedUser)
      localStorage.setItem("fmcg-user", JSON.stringify(updatedUser))
    }
  }

const logout = () => {
  localStorage.removeItem("fmcg-tokens")
  setUser(null)

  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
  const logoutUri = `https://us-east-1soapnsqlc.auth.us-east-1.amazoncognito.com/logout?client_id=577rimi4qbt84p573ernvle9bh&logout_uri=<logout uri>`

  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
}

}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
