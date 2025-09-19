"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { AnalyticsData } from "@/lib/analytics-data"

interface AnalyticsChartsProps {
  data: AnalyticsData
  brand: string
}

export function AnalyticsCharts({ data, brand }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Brand Trends Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Brand Detection Trends</CardTitle>
          <CardDescription>Monthly detection volume and confidence for {brand}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              detections: {
                label: "Detections",
                color: "#9392956B",
              },
              confidence: {
                label: "Confidence",
                color: "#6D6CECEEE8",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.brandTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="detections" fill="var(--color-detections)" name="Detections" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="confidence"
                  stroke="var(--color-confidence)"
                  name="Avg Confidence"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Material Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Material Breakdown</CardTitle>
          <CardDescription>Distribution by packaging material</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Count",
                color: "#DEE6DA",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.materialBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  // label={({ material, percentage }) => `${material}: ${percentage.toFixed(1)}%`}
                >
                  {data.materialBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Time Series */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Detection Activity</CardTitle>
          <CardDescription>Last 30 days performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              detections: {
                label: "Daily Detections",
                color: "#D9DFE9F1",
              },
              accuracy: {
                label: "Accuracy",
                color: "#F784AFB498",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="detections"
                  stroke="var(--color-detections)"
                  name="Detections"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--color-accuracy)"
                  name="Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Confidence Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Confidence Score Distribution</CardTitle>
          <CardDescription>Quality of brand recognition across detections</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Count",
                color: "#9392956B",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.confidenceDistribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="range" type="category" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
