// Authentication and brand access control utilities
export interface User {
  id: string
  email: string
  brand: string
  role: "admin" | "brand"  
}

export interface BrandData {
  id: string
  name: string
  material: string
  imageUrl: string
  confidence: Record<string, number>
  timestamp: string
}

// Mock JWT verification for MVP - replace with real JWT in production
export function verifyToken(token: string): User | null {
  try {
    // Mock implementation - in production, use proper JWT verification
    const mockUsers: Record<string, User> = {
      "coca-cola-token": {
        id: "1",
        email: "admin@coca-cola.com",
        brand: "Coca-Cola",
        role: "brand",
      },
      "pepsi-token": {
        id: "2",
        email: "admin@pepsi.com",
        brand: "Pepsi",
        role: "brand",
      },
      "admin-token": {
        id: "3",
        email: "admin@fmcg-platform.com",
        brand: "all",
        role: "admin",
      },
    }

    return mockUsers[token] || null
  } catch {
    return null
  }
}

export function hasAccessToBrand(user: User, brand: string): boolean {
  return user.role === "admin" || user.brand === brand || user.brand === "all"
}

// Mock brand data for demonstration
export const mockBrandData: BrandData[] = [
  {
    id: "1",
    name: "Coca-Cola",
    material: "Plastic Bottle",
    imageUrl: "/coca-cola-bottle.jpg",
    confidence: { brand_recognition: 0.95, material_detection: 0.88 },
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Coca-Cola",
    material: "Aluminum Can",
    imageUrl: "/coca-cola-can.jpg",
    confidence: { brand_recognition: 0.92, material_detection: 0.91 },
    timestamp: "2024-01-15T11:45:00Z",
  },
  {
    id: "3",
    name: "Pepsi",
    material: "Plastic Bottle",
    imageUrl: "/pepsi-bottle.jpg",
    confidence: { brand_recognition: 0.89, material_detection: 0.85 },
    timestamp: "2024-01-15T12:15:00Z",
  },
]
