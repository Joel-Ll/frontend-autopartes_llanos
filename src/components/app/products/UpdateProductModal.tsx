import { Autocomplete, Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Product, ProductCreateForm } from "../../../types/product";
import { Controller, useForm } from "react-hook-form";
import { Category } from "../../../types/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct, updateProduct } from "../../../api/productAPI";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ErrorMessage from "../../ErrorMessage";

const styles = {
  modal: {
    position: 'absolute' as 'absolute',
    top: '30%',
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
  },
};

const initalValues: ProductCreateForm = {
  category: '',
  name: '',
  code: '',
  description: ''
};

type EditProductModalProps = {
  setIdProductEdit: React.Dispatch<React.SetStateAction<string>>
  idProductEdit: Product['_id']
  dataCategories: Category[]
}

export default function UpdateProductModal({ setIdProductEdit, idProductEdit, dataCategories }: EditProductModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productModal = queryParams.get('editProduct');
  const showModal = productModal ? true : false;

  const queryClient = useQueryClient();
  const { data: dataProduct } = useQuery({
    queryKey: ['productEdit', idProductEdit],
    queryFn: () => getProduct(idProductEdit),
    refetchOnWindowFocus: false,
    retry: false
  });

  const { mutate } = useMutation({
    mutationFn: updateProduct,
    onError(error) {
      toast.error(error.message)
    },
    onSuccess(data) {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['productEdit', idProductEdit] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      handleClosedModal();
    }
  });

  const { control, register, reset, handleSubmit, formState: { errors } } = useForm({ defaultValues: initalValues });

  useEffect(() => {
    if (dataProduct) {
      reset(dataProduct);
    }
  }, [dataProduct, reset]);

  const handleSubmitUpdateProduct = (formData: ProductCreateForm) => {
    const data = { _id: idProductEdit, formData }
    mutate(data);
  }

  const handleClosedModal = () => {
    navigate(location.pathname, { replace: true });
    setIdProductEdit('');
  }

  if (dataProduct && dataCategories) return (
    <Modal
      open={showModal}
      onClose={handleClosedModal}
    >
      <Box sx={styles.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Editar Producto
        </Typography>

        <Box mt={2}>
          <form
            onSubmit={handleSubmit(handleSubmitUpdateProduct)}
          >
            <div className="flex flex-col space-y-3 mb-5">
              <Controller
                name="category"
                control={control}
                defaultValue={dataProduct.category}
                render={({ field }) => (
                  <Autocomplete
                    defaultValue={dataCategories.find((category: Category) => category._id === dataProduct.category) || null}
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={dataCategories}
                    getOptionLabel={(option: Category) => option.name}
                    onChange={(_, value) => field.onChange(value ? value._id : '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        label="Seleccionar Categoría"
                      />
                    )}
                  />
                )}
                rules={{
                  required: 'La categoría es obligatoria',
                  validate: (value) => value !== '' || 'Debes seleccionar una categoría válida',
                }}
              />
              {errors.category && <ErrorMessage>{errors.category.message}</ErrorMessage>}

              <TextField
                id="name"
                label="Nombre"
                variant="standard"
                sx={styles.input}
                size="small"
                {...register('name', {
                  required: 'El nombre es obligatorio',
                  validate: value => value.trim() !== '' || 'El nombre no puede ser solo espacios'
                })}
              />
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

              <TextField
                id="code"
                label="Código"
                variant="standard"
                size="small"
                sx={styles.input}
                {...register('code', {
                  required: 'El código es obligatorio',
                  validate: value => value.trim() !== '' || 'El código no puede ser solo espacios'
                })}
              />
              {errors.code && <ErrorMessage>{errors.code.message}</ErrorMessage>}

              <TextField
                id="description"
                label="Descripción"
                variant="standard"
                size="small"
                sx={styles.input}
                {...register('description', {
                  required: 'La descripción es obligatoria',
                  validate: value => value.trim() !== '' || 'La descripción no puede ser solo espacios'
                })}
              />
              {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
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
