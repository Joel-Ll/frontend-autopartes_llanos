// import SimpleBarchart from "../../../components/app/home/SimpleBarchart";
// import { StakerAreaChart } from "../../../components/app/home/StakerAreaChart";
import { FaBox, FaDollarSign, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import { useQuery } from "@tanstack/react-query";
import { getProductsAll } from "../../../api/productAPI";
import { getAllSales } from "../../../api/salesAPI";
import { getProductsManagement } from "../../../api/managementProductAPI";
import { useAuth } from '../../../hooks/useAuth';

export default function Home() {
  const { data: name, isError, isLoading } = useAuth();
  // funcion para traerse el total de productos..
  const searchParams = ''
  const { data: dataProducts } = useQuery({
    queryKey: ['totalProducts'],
    queryFn: () => getProductsAll({ searchParams: '', searchState: '', searchCategory: '' }),
    refetchOnWindowFocus: false,
    retry: false
  });

  const { data: dataSales } = useQuery({
    queryKey: ['totalSales'],
    queryFn: () => getAllSales(),
    refetchOnWindowFocus: false,
    retry: false
  });

  const { data } = useQuery({
    queryKey: ['getProductsIncomeAndSales'],
    queryFn: () => getProductsManagement(searchParams),
    refetchOnWindowFocus: false,
    retry: false,
  });


  const totalProducts = Array.isArray(dataProducts) ? dataProducts.length : 0;
  const totalSales = Array.isArray(dataSales) ? dataSales.length : 0

  const totalIncome = Array.isArray(data)
    ? data.reduce((acc, item) => acc + (item.income || 0), 0)
    : 0;

  const totalExpense = Array.isArray(data)
    ? data.reduce((acc, item) => acc + (item.expenses || 0), 0)
    : 0;

  return (
    <>
      <h1 className="text-3xl text-gray-800 mb-5">Dashboard</h1>

      <div className='text-center mb-10 text-slate-500 font-bold'>
        <h2 className='text-2xl'>Bienvenido <span className='uppercase'>{name}</span> </h2>
        <p className='text-xl'>Resumen de Actividades</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-10">
        {/* Tarjeta de Productos */}
        <div className="bg-sky-400 shadow rounded-lg min-h-30 flex items-center gap-4">
          <div className="bg-sky-500 h-full p-4 rounded-l-lg">
            <FaBox size={70} color="#fff" />
          </div>

          <div>
            <p className="text-white text-lg font-bold">Productos: </p>
            <p className="text-2xl text-white font-medium">{totalProducts}</p>
          </div>
        </div>

        {/* Tarjeta de Ventas */}
        <div className="bg-lime-500 shadow rounded-lg flex items-center gap-4">
          <div className="bg-lime-600 h-full p-4 rounded-l-lg">
            <FaShoppingCart size={70} color="#fff" />
          </div>
          <div>
            <p className="text-white text-lg font-bold">Ventas: </p>
            <p className="text-2xl text-white font-medium">{totalSales}</p>
          </div>
        </div>
        {/* Tarjeta de Ingresos */}
        <div className="bg-amber-400 shadow rounded-lg flex items-center gap-4">
          <div className="bg-amber-500 h-full p-4 rounded-l-lg">
            <FaDollarSign size={70} color="#fff" />
          </div>
          <div>
            <p className="text-white text-lg font-bold">Ingresos</p>
            <p className="text-2xl text-white font-medium">Bs {totalIncome}</p>
          </div>
        </div>

        {/* Tarjeta de Egresos */}
        <div className="bg-rose-400 shadow rounded-lg flex items-center gap-4">
          <div className="bg-rose-500 h-full p-4 rounded-l-lg">
            <FaMoneyBillWave size={70} color="#fff" />
          </div>
          <div>
            <p className="text-white text-lg font-bold">Egresos</p>
            <p className="text-2xl text-white font-medium">Bs {totalExpense}</p>
          </div>
        </div>
      </div>



      {/* <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="mb-5 font-semibold text-center text-lg text-slate-600">Gráfica de Ingresos vs Egresos</p>
          <StakerAreaChart />
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <p className="mb-5 font-semibold text-center text-lg text-slate-600">Productos más vendidos</p>
          <SimpleBarchart />
        </div>
      </div> */}


    </>
  )
}
