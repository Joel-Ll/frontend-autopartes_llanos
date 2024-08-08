import { Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material"
import { Category, CategoryCreateForm } from "../../../types/category"
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategory, updateCategory } from "../../../api/categoryAPI";
import { toast } from "react-toastify";
import { normalizeName } from "../../../helpers";
import ErrorMessage from "../../ErrorMessage";
import { useEffect } from "react";

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


type UpdateCustomerModalprops = {
  idCategoryEdit: Category['_id']
}

let initialValues: CategoryCreateForm = {
  name: '',
}

export default function UpdateCategoryModal({idCategoryEdit}: UpdateCustomerModalprops) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const editModalCategory = queryParams.get('editCategory');
  const show = editModalCategory ? true : false;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['category', idCategoryEdit],
    queryFn: () => getCategory(idCategoryEdit),
    retry: false
  });

  const { mutate } = useMutation({
    mutationFn: updateCategory,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({queryKey: ['category', idCategoryEdit]})
      handleClosedModal();
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues});

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const handleUpdateCategorySubmit = (formData: CategoryCreateForm) => {
    const data = {formData, _id: idCategoryEdit}
    mutate(data);
  }

  const handleClosedModal = () => {
    navigate(location.pathname, {replace: true});
    reset();
  }
  if (isLoading) return <CircularProgress color="inherit" />
  if (isError) return <Navigate to={'/404'} />

  if(data) return (
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
            <div className="flex flex-col space-y-3 mb-5">
                <TextField
                  id="name"
                  label="Nombre"
                  variant="standard"
                  sx={styles.input}
                  size="small"
                  {...register('name', {
                    required: 'El nombre es obligatorio',
                    validate: value => {
                      const normalized = normalizeName(value);
                      return normalized ? true : 'El nombre no puede estar vacío o ser solo espacios en blanco';
                    }
                  })}
                />
                {errors.name &&
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
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
