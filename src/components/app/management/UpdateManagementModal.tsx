import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductManagement, ProductManagementCreateForm } from "../../../types/managementProduct";
import { getProductManagement, updateProductManagement } from "../../../api/managementProductAPI";
import { useEffect } from "react";
import ErrorMessage from "../../ErrorMessage";
import { toast } from "react-toastify";

const styles = {
  modal: {
    position: 'absolute' as 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  },
  input: {
    '& .MuiStandardInput-root': {
      backgroundColor: '#F3F4F6', // bg-gray-100
      color: '#000000', // Texto en negro para mejor contraste
    },
    '& .MuiStandardInput-root:hover': {
      backgroundColor: '#E5E7EB', // Hover color
    },
    '& .MuiStandardInput-underline:before': {
      borderBottomColor: '#6B7280', // Border color before focus (bg-gray-500)
    },
    '& .MuiStandardInput-underline:after': {
      borderBottomColor: '#6B7280', // Border color after focus (bg-gray-500)
    },
    '& .MuiInputLabel-root': {
      color: '#6B7280', // Label color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#6B7280', // Label color when focused
    }
  }
};

const initialValues: ProductManagementCreateForm = {
  productId: '',
  productPrice: 0
}

type UpdateManagementModalProps = {
  setIdProductEdit: React.Dispatch<React.SetStateAction<string>>
  idProductEdit: ProductManagement['_id']
}

export default function UpdateManagementModal({setIdProductEdit, idProductEdit}: UpdateManagementModalProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const editModalManagement = queryParams.get('editProductManagement');
  const show = editModalManagement ? true : false;
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['productManagementEdit', idProductEdit],
    queryFn: () => getProductManagement(idProductEdit),
    refetchOnWindowFocus: false,
    retry: false
  });

  const { mutate } = useMutation({
    mutationFn: updateProductManagement,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({queryKey: ['getProductsManagement']});
      handleClosedModal();
    }
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const handleUpdateCategorySubmit = (formData: ProductManagementCreateForm) => {
    if(data) {
      const dataSubmit = { productPrice: formData.productPrice, _id: data._id }
      mutate(dataSubmit)
    }
  }

  const handleClosedModal = () => {
    setIdProductEdit('');
    navigate(location.pathname, { replace: true });
  }

  return (
    <Modal
      open={show}
      onClose={handleClosedModal}
    >
      <Box sx={styles.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Editar Categoría
        </Typography>
        <Box mt={2}>
          <form
            onSubmit={handleSubmit(handleUpdateCategorySubmit)}
            noValidate
            autoComplete="off"
          >
            <div className="flex flex-col mb-5">
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

            <div className="flex flex-row-reverse gap-4">
              <Button
                onClick={handleClosedModal}
                variant="contained"
                sx={{
                  backgroundColor: '#374151', // bg-gray-800
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#374151' }, // un poco más claro para el efecto hover
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#1F2937', // bg-gray-700
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#4b5563' }, // un poco más claro para el efecto hover
                }}
              >
                Aceptar
              </Button>
            </div>
          </form>
        </Box>
      </Box>
    </Modal>
  )
}
