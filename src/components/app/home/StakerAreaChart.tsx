import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getExpensesAndIncome } from "../../../api/managementProductAPI";

export const StakerAreaChart = () => {

  const { data } = useQuery({
    queryKey: ['getProductosIncomeAndExpenses'],
    queryFn: () => getExpensesAndIncome(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (data) return (
    <ResponsiveContainer width='100%' aspect={2}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff6961" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ff6961" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey='codeProduct'/>
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Area type='monotone' dataKey='income' stackId='1' stroke="#82ca9d" fill="url(#colorIncome)" />
        <Area type='monotone' dataKey='expenses' stackId='1' stroke="#ff6961" fill="url(#colorExpenses)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
