import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material";
import { Customer, CustomerCreateForm } from "../../../types/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomer, updateCustomer } from "../../../api/customerAPI";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import UpdateCustomerModalForm from "./UpdateCustomerModalForm";
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
  }
};

type UpdateCustomerModalprops = {
  idCustomerEdit: Customer['_id']
}

let initialValues: CustomerCreateForm = {
  name: '',
  nit_ci: '',
  phone: '',
  address: ''
}

export default function UpdateCustomerModal({ idCustomerEdit }: UpdateCustomerModalprops) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const modalEditCustomer = queryParams.get('editCustomer');
  const show = modalEditCustomer ? true : false;

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['customer', idCustomerEdit],
    queryFn: () => getCustomer(idCustomerEdit),
    retry: false
  });

  const { mutate } = useMutation({
    mutationFn: updateCustomer,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['customers'] }),
      queryClient.invalidateQueries({queryKey: ['customer', idCustomerEdit ]})
      handleClosedModal()
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const handleUpdateCustomerSubmit = (formData: CustomerCreateForm) => {
    const data = { formData, _id: idCustomerEdit }
    mutate(data)
  }

  const handleClosedModal = () => {
    navigate(location.pathname, { replace: true });
    reset();
  }

  if (isLoading) return <CircularProgress color="inherit" />
  if (isError) return <Navigate to={'/404'} />
  if (data) return (
    <Modal
      open={show}
      onClose={handleClosedModal}
    >
      <Box sx={styles.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Editar Cliente
        </Typography>
        <Box mt={2}>
          <form
            onSubmit={handleSubmit(handleUpdateCustomerSubmit)}
            noValidate
            autoComplete="off"
          >
            <UpdateCustomerModalForm
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
                Actualizar
              </Button>
            </div>
          </form>
        </Box>
      </Box>
    </Modal>
  )
}
