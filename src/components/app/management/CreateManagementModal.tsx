import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getFilteredProduct } from "../../../api/productAPI";
import { toast } from "react-toastify";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ProductManagementCreateForm } from "../../../types/managementProduct";
import ErrorMessage from "../../ErrorMessage";
import { createProductManagement } from "../../../api/managementProductAPI";
import { ProductFilter } from "../../../types/product";

const styles = {
  modal: {
    position: 'absolute' as 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '80vh', 
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', 
  },
  input: {
    '& .MuiStandardInput-root': {
      backgroundColor: '#F3F4F6', 
      color: '#000000', 
    },
    '& .MuiStandardInput-root:hover': {
      backgroundColor: '#E5E7EB',
    },
    '& .MuiStandardInput-underline:before': {
      borderBottomColor: '#6B7280', 
    },
    '& .MuiStandardInput-underline:after': {
      borderBottomColor: '#6B7280',
    },
    '& .MuiInputLabel-root': {
      color: '#6B7280',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#6B7280',
    }
  }
};

const initalState: ProductManagementCreateForm = {
  productId: '',
  productPrice: 0
}

export default function CreateManagementModal() {
  const [code, setCode] = useState('');
  const [productData, setProductData] = useState<ProductFilter>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const ManagementModal = queryParams.get('newManagement');
  const show = ManagementModal ? true : false;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initalState });

  const queryClient = useQueryClient();
  const { mutate: mutateProduct } = useMutation({
    mutationFn: getFilteredProduct,
    onError: (error) => {
      toast.error(error.message);
      setCode('');
      setProductData(null);
    },
    onSuccess: (data) => {
      toast.success('Producto encontrado');
      setProductData(data);
    },
  });
  const { mutate: mutateCreateManagement } = useMutation({
    mutationFn: createProductManagement,
    onError: (error) => {
      toast.error(error.message);
      setCode('');
      setProductData(null);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['getProductsManagement']})
      toast.success(data);
      handleClosedModal();
    },
  });


  const handleCreateManagament = (formData: ProductManagementCreateForm) => {
    if (productData) {
      formData.productId = productData._id
      mutateCreateManagement(formData);
    }
  }

  const handleSearchProduct = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    mutateProduct(code);
  }

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }

  const handleClosedModal = () => {
    setCode('');
    reset(initalState);
    setProductData(null);
    navigate(location.pathname, { replace: true });
  }

  return (
    <>
      <Modal
        open={show}
        onClose={handleClosedModal}
      >
        <Box sx={styles.modal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Nueva Gestión
          </Typography>
          <Box mt={2}>
            <form
              onSubmit={handleSubmit(handleCreateManagament)}
              noValidate
              autoComplete="off"
            >
              <div className="flex gap-4">
                <TextField
                  className="w-2/3"
                  id="code"
                  value={code}
                  onChange={handleChangeCode}
                  label="Introduzca el código de producto"
                  variant="outlined"
                  sx={styles.input}
                  size="small"
                />
                <button
                  disabled={!code}
                  className={`w-1/3 text-white ${code ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-500'} font-normal rounded-md text-md px-2 py-1 text-center`}
                  onClick={handleSearchProduct}
                >Buscar</button>
              </div>

              {productData && (
                <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 mt-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Información del Producto</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Nombre:</span> {productData.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Código:</span> {productData.code}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Categoría:</span> {productData.category.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Descripción:</span> {productData.description}
                    </p>

                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-2" htmlFor="productPrice">
                      Precio de Venta
                    </label>
                    <TextField
                      id="productPrice"
                      type="number"
                      size="small"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      {...register('productPrice', {
                        required: 'El precio es obligatorio',
                        validate: value => value > 0 || 'El precio debe ser mayor a 0'
                      })}
                    />
                    {errors.productPrice &&
                      <ErrorMessage>{errors.productPrice.message}</ErrorMessage>
                    }
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-row-reverse gap-4">
                <Button
                  onClick={handleClosedModal}
                  variant="contained"
                  sx={{
                    backgroundColor: '#374151', // bg-gray-800
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#374151' }, // bg-gray-60
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  disabled={!productData}
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: productData ? '#1F2937' : '#9CA3AF',
                    color: productData ? '#ffffff' : '#6B7280',
                    '&:hover': {
                      backgroundColor: productData ? '#4b5563' : '#9CA3AF',
                    },
                    cursor: productData ? 'pointer' : 'not-allowed',
                  }}
                >
                  Aceptar
                </Button>
              </div>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
