import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Supplier, SupplierCreateForm } from "../../../types/supplier";
import { Navigate, useLocation, useNavigate  } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupplier, updateSupplier } from "../../../api/supplierAPI";
import { useEffect } from "react";
import UpdateSupplierModalForm from "./UpdateSupplierModalForm";
import { toast } from "react-toastify";


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
  },
};

const initalValues: SupplierCreateForm = {
  name: '',
  email: '',
  phone: '',
  address: ''
};

type UpdateSupplierModalProps = {
  idSupplierEdit: Supplier['_id']
}

export default function UpdateSupplierModal({idSupplierEdit}: UpdateSupplierModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const supplierModal = queryParams.get('editSupplier'); 
  const showModal = supplierModal ? true : false;

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['supplier', idSupplierEdit],
    queryFn: () => getSupplier(idSupplierEdit),
    retry: false
  });
  const {mutate} = useMutation({
    mutationFn: updateSupplier,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({queryKey: ['suppliers']});
      queryClient.invalidateQueries({queryKey: ['supplier', idSupplierEdit]});
      handleClosedModal();
    }
  })

  const {register, handleSubmit, reset, formState: {errors}} = useForm({defaultValues: initalValues});

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const handleEditSupplierSubmit = (formData: SupplierCreateForm) => {
    const data = { formData, _id: idSupplierEdit }
    mutate(data)
  }

  const handleClosedModal = () => {
    navigate( location.pathname, {replace: true});
    reset();
  }

  if (isLoading) return <CircularProgress color="inherit" />
  if (isError) return <Navigate to={'/404'} />

  if(data) return (
    <Modal
      open={showModal}
      onClose={handleClosedModal}
    >
      <Box sx={styles.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Nuevo Proveedor
        </Typography>
        <Box mt={2}>
          <form
            onSubmit={handleSubmit(handleEditSupplierSubmit)}
            noValidate
            autoComplete="off"
          >
            <UpdateSupplierModalForm 
              register={register}
              errors={errors}
            />

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
