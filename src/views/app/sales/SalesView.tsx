import { useState } from "react";
import SalesCreate from "../../../components/app/sales/SalesCreate";
import { ProductSale } from "../../../types/sales";
import SalesInf from "../../../components/app/sales/SalesInf";
import { TextField } from "@mui/material";

export default function SalesView() {
  const [nameCustomer, setNameCustomer] = useState('');
  const [productsSales, setProductSales] = useState<ProductSale[]>([]);
  const [description, setDescription] = useState('');
  const totalPrice = productsSales.reduce((acc, product) => acc + product.subtotal, 0);

  return (
    <>
      <h1 className='text-3xl text-gray-800 mb-5'>Nueva Venta</h1>

      <div className="grid grid-cols-10 gap-5">
        <div className="border-t-4 border-green-600 col-span-4 bg-white px-5 py-10 rounded-sm shadow-md">
          <TextField 
            fullWidth
            value={nameCustomer}
            onChange={(e) => setNameCustomer(e.target.value)}
            label="Nombre del cliente" 
            size="small"  
            variant="outlined" 
          />
          <SalesInf
            nameCustomer={nameCustomer}
            productsSales={productsSales}
            setProductSales={setProductSales}
            totalPrice={totalPrice}
            description={description}
            setDescription={setDescription}
          />
        </div>

        <div className="border-t-4 border-orange-600 col-span-6 bg-white  px-5 py-10 rounded-sm shadow-md">
          <SalesCreate
            setProductSales={setProductSales}
          />
        </div>
      </div>
    </>
  )
}
