import { Button } from "@mui/material";
import { Product } from "../../../types/product";
import { ProductSale } from "../../../types/sales"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "../../../api/salesAPI";
import { toast } from "react-toastify";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

type SalesInfProps = {
  nameCustomer: string
  totalPrice: number
  description: string
  productsSales: ProductSale[]
  setProductSales: React.Dispatch<React.SetStateAction<ProductSale[]>>
  setDescription: React.Dispatch<React.SetStateAction<string>>
}
export default function SalesInf({ nameCustomer, productsSales, setProductSales, totalPrice, description, setDescription }: SalesInfProps) {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createSale,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(data);
      navigate('/sales-history');
    }
  });

  const handleSubmit = () => {
    const data = {nameCustomer, products: productsSales, totalPrice, description}
    setTimeout(() => {
      MySwal.fire({
        title: "¿Registrar Venta?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancelar',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.isConfirmed) {
          mutate(data);
        }
      });
    }, 0); 
  }

  const updateProductQuantity = (idProduct: Product['_id'], newQuantity: string) => {
    setProductSales((prevProducts) =>
      prevProducts.map((product) =>
        product.idProduct === idProduct
          ? {
            ...product,
            quantity: parseInt(newQuantity, 10),
            subtotal: parseInt(newQuantity, 10) * product.unitPrice,
          }
          : product
      )
    );
  };

  const removeProduct = (idProduct: Product['_id']) => {
    setProductSales((prevProducts) =>
      prevProducts.filter((product) => product.idProduct !== idProduct)
    );
  };

  return (
    <>
      <div className="mt-5">
        {productsSales.length ? (
          <ul className="space-y-4">
            {productsSales.map((product) => (
              <li key={product.idProduct} className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 w-4/5">
                  <button
                    onClick={() => removeProduct(product.idProduct)}
                    className="bg-red-500 text-white px-3 py-2 hover:bg-red-600 focus:outline-none"
                    style={{ borderRight: 'none' }}
                  >
                    X
                  </button>
                  <p className="px-2">{product.nameProduct}</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => updateProductQuantity(product.idProduct, e.target.value)}
                  className="border p-2 text-center w-1/4"
                />
                <p
                  className="border p-2 text-center w-1/4"
                >Bs {product.subtotal}</p>
              </li>
            ))}

            <div className="text-right">
              <p className="text-base font-semibold">Total: Bs {totalPrice}</p>
            </div>

            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-slate-800"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Por concepto de: "
            ></textarea>

            <div className="flex justify-end">
              <Button
                type="submit"
                onClick={ handleSubmit }
                variant="contained"
                className="cursor-pointer"
                sx={{
                  backgroundColor: '#1F2937',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#4b5563' },
                }}
              >
                Registrar Venta
              </Button>
            </div>
          </ul>
        ) : (
          <p className='text-center py-20'>No hay productos seleccionados</p>
        )}
      </div>
    </>
  )
}
