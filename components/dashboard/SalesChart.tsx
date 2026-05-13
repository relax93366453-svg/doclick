"use client";

import { salesTrend } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function SalesChart() {
  return (
    <div className="card h-80">
      <h3 className="mb-4 font-semibold">銷售與成本趨勢</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={salesTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="sales" name="銷售額" />
          <Area type="monotone" dataKey="cost" name="成本" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
