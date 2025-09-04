"use client"

import { BarChart, PieChart, Bus, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Pie, PieChart as RechartsPieChart, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts";

import { analyticsData, shuttles } from "@/lib/data";

const COLORS = ['#29ABE2', '#90EE90', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

export default function AdminDashboard() {
  const { usageByTime, usageByStop } = analyticsData;

  const chartConfigTime = {
    tickets: {
      label: "Tickets Sold",
      color: "hsl(var(--primary))",
    },
  };

  const chartConfigStop = {
    bookings: {
      label: "Bookings",
    },
    ...usageByStop.reduce((acc, cur, i) => {
        acc[cur.stop] = { label: cur.stop, color: COLORS[i % COLORS.length] }
        return acc
    }, {} as any)
  };
  
  const activeShuttles = shuttles.filter(s => s.status === 'active').length;
  const totalShuttles = shuttles.length;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(usageByTime.reduce((acc, cur) => acc + cur.tickets, 0) * 20).toLocaleString()} rs</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageByTime.reduce((acc, cur) => acc + cur.tickets, 0)}</div>
            <p className="text-xs text-muted-foreground">+18.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shuttles</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeShuttles} / {totalShuttles}</div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BarChart className="h-5 w-5" /> Usage by Time of Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigTime} className="h-[300px] w-full">
              <RechartsBarChart data={usageByTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="tickets" fill="var(--color-tickets)" radius={8} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <PieChart className="h-5 w-5" /> Popular Stops
            </CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfigStop} className="h-[300px] w-full">
                <RechartsPieChart>
                  <RechartsTooltip content={<ChartTooltipContent nameKey="stop" hideLabel />} />
                  <Pie data={usageByStop} dataKey="value" nameKey="stop" cx="50%" cy="50%" outerRadius={110} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                    {usageByStop.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="stop" />} />
                </RechartsPieChart>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
