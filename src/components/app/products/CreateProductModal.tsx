import { Box, Button,  Modal, Typography } from "@mui/material";
import { useMutation,  useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductCreateForm } from "../../../types/product";
import CreateProductModalForm from "./CreateProductModalForm";
import { createProduct } from "../../../api/productAPI";
import { Category } from "../../../types/category";

const styles = {
  modal: {
    position: 'absolute' as 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  }
}

const initalValues: ProductCreateForm = {
  category: '',
  name: '',
  code: '',
  description: ''
};

type CreateProductModalProps = {
   dataCategories: Category[]
}

export default function CreateProductModal({dataCategories}:CreateProductModalProps ) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productModal = queryParams.get('newProduct');
  const showModal = productModal ? true : false;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createProduct,
    onError: (error) => {
      toast.error(error.message);
    }, 
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['products']});
      toast.success(data);
      handleClosedModal();
    }
  });

  const { control, register, reset, handleSubmit, formState: { errors } } = useForm({ defaultValues: initalValues });

  const handleCreateProductSubmit = (formData: ProductCreateForm) => {
    mutate(formData)
  }

  const handleClosedModal = () => {
    navigate(location.pathname, { replace: true });
    reset();
  }


  if (dataCategories) return (
    <Modal
      open={showModal}
      onClose={handleClosedModal}
    >
      <Box sx={styles.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Nuevo Producto
        </Typography>

        <Box mt={2}>
          <form
            onSubmit={handleSubmit(handleCreateProductSubmit)}
            noValidate
            autoComplete="off"
          >

            <CreateProductModalForm 
              dataCategories={dataCategories}
              control={control}
              errors={errors}
              register={register}
            />

            <div className="mt-5 flex flex-row-reverse gap-4">
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
