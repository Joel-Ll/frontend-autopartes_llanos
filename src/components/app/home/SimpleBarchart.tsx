import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { getProductsManagement } from '../../../api/managementProductAPI';
import { useEffect } from 'react';

export default function SimpleBarchart() {
  const searchParams = ''
  
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['getProductosIncomeAndExpenses'],
    queryFn: () => getProductsManagement(searchParams),
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['getProductosIncomeAndExpenses'] });
  }, [searchParams])

  const topSellingProducts = (data || [])
  .sort((a, b) => b.salesQuantity - a.salesQuantity)
  .slice(0, 5);

  return (
    <ResponsiveContainer width="100%" aspect={2}>
      <BarChart
        data={topSellingProducts}
        width={400} 
        height={250}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray='3 3 3' />
        <XAxis dataKey='codeProduct' />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* Las barras deben estar dentro del componente BarChart */}
        <Bar dataKey="salesQuantity" fill='#0ea5e9' />
      </BarChart>
    </ResponsiveContainer>
  )
}
