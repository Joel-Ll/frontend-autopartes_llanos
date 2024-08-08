import { Box, Button, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerCreateForm } from "../../../types/customer";
import CreateCustomerModalForm from "./CreateCustomerModalForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "../../../api/customerAPI";
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

const initalValues: CustomerCreateForm = {
  name: '',
  nit_ci: '',
  phone: '',
  address: ''
};

export default function CreateCustomerModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customerModal = queryParams.get('newCustomer');
  const showModal = customerModal ? true : false;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createCustomer,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data),
      queryClient.invalidateQueries({queryKey: ['customers']}),
      handleClosedModal()
    }
  });

  const { register, handleSubmit, reset, formState: {errors}} = useForm({defaultValues: initalValues});

  const handleCreateCustomerSubmit = (formData: CustomerCreateForm) => {
    mutate(formData);
  }

  const handleClosedModal = () => {
    navigate(location.pathname, { replace: true });
    reset();
  }

  return (
    <Modal
      open={showModal}
      onClose={handleClosedModal}
    >
      <Box sx={styles.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Nuevo Cliente
        </Typography>
        <Box mt={2}>
          <form
            onSubmit={handleSubmit(handleCreateCustomerSubmit)}
            noValidate
            autoComplete="off"
          >
            <CreateCustomerModalForm
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
  );
}
