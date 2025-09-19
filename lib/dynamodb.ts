// DynamoDB integration utilities for real-time brand analytics
import type { BrandData } from "./auth"

export interface DynamoDBConfig {
  region: string
  tableName: string
  accessKeyId?: string
  secretAccessKey?: string
}

export class FMCGDynamoDBClient {
  private config: DynamoDBConfig

  constructor(config: DynamoDBConfig) {
    this.config = config
  }

  // ✅ Correct class method syntax
  async scanRecords(brand?: string): Promise<BrandData[]> {
    const query = brand ? `?brand=${encodeURIComponent(brand)}` : ""

    const response = await fetch(
      `https://1qpqvcemec.execute-api.us-east-1.amazonaws.com/dev/scan-records${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch scan records: ${response.statusText}`)
    }

    const data = (await response.json()) as BrandData[]
    return data
  }

  async getRealtimeStats(brand?: string): Promise<{
    totalDetections: number
    avgConfidence: number
    recentActivity: number
    topMaterials: Array<{ material: string; count: number }>
  }> {
    // still mocked until you add a Lambda endpoint
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      totalDetections: Math.floor(Math.random() * 10000) + 5000,
      avgConfidence: Math.random() * 0.2 + 0.8,
      recentActivity: Math.floor(Math.random() * 50) + 10,
      topMaterials: [
        { material: "Plastic Bottle", count: Math.floor(Math.random() * 1000) + 500 },
        { material: "Aluminum Can", count: Math.floor(Math.random() * 800) + 400 },
        { material: "Glass Bottle", count: Math.floor(Math.random() * 300) + 100 },
        { material: "Cardboard", count: Math.floor(Math.random() * 200) + 50 },
      ],
    }
  }

  async queryByTimeRange(
    brand: string,
    startTime: string,
    endTime: string
  ): Promise<BrandData[]> {
    const records = await this.scanRecords(brand)

    return records.filter((record) => {
      const recordTime = new Date(record.timestamp)
      return recordTime >= new Date(startTime) && recordTime <= new Date(endTime)
    })
  }
}
