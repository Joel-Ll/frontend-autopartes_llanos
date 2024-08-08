import { TextField } from "@mui/material";
import ErrorMessage from "../../ErrorMessage";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { SupplierCreateForm } from "../../../types/supplier";

const styles = {
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
}

type CreateSupplierModalFormProps = {
  register: UseFormRegister<SupplierCreateForm>
  errors: FieldErrors<SupplierCreateForm>
}

export default function UpdateSupplierModalForm({ register, errors }: CreateSupplierModalFormProps) {
  return (
    <div className="flex flex-col space-y-3 mb-5">
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
        id="email"
        label="E-mail"
        variant="standard"
        size="small"
        sx={styles.input}
        {...register('email', {
          required: "El Email es obligatorio",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "E-mail no válido",
          },
          
        })}
      />
      {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

      <TextField
        id="phone"
        label="Teléfono"
        variant="standard"
        size="small"
        sx={styles.input}
        {...register('phone', {
          required: 'El teléfono es obligatorio',
          validate: value => value.trim() !== '' || 'El teléfono no puede ser solo espacios'
        })}
      />
      {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}

      <TextField
        id="address"
        label="Dirección"
        variant="standard"
        size="small"
        sx={styles.input}
        {...register('address', {
          required: 'La dirección es obligatoria',
          validate: value => value.trim() !== '' || 'La dirección no puede ser solo espacios'
        })}
      />
      {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
    </div>
  )
}
