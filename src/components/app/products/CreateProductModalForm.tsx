import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { Category } from "../../../types/category";
import { ProductCreateForm } from "../../../types/product";
import { Autocomplete, TextField } from "@mui/material";
import ErrorMessage from "../../ErrorMessage";

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

type CreateProductModalFormProps = {
  dataCategories: Category[],
  control: Control<ProductCreateForm, any>
  errors: FieldErrors<ProductCreateForm>
  register: UseFormRegister<ProductCreateForm>
}


export default function CreateProductModalForm({dataCategories, control, errors, register}: CreateProductModalFormProps) {
  return (
    <div className="flex flex-col space-y-3 mb-5">
      <Controller
        name="category"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            size="small"
            options={dataCategories}
            getOptionLabel={(option: Category) => option.name.toUpperCase()}
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
  )
}
