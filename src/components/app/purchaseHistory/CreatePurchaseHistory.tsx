import { ProductManagement } from "../../../types/managementProduct"
import { Autocomplete, Box, Button, Modal, TextField, Typography } from "@mui/material"
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { getProductManagement } from "../../../api/managementProductAPI";
import { useEffect, useState } from "react";
import ErrorMessage from "../../ErrorMessage";
import { toast } from "react-toastify";
import { getSelectSupplier } from "../../../api/supplierAPI";
import { SupplierSelect } from "../../../types/supplier";
import { PurchaseHistoryCreateForm } from "../../../types/purchaseHistory";
import { createPurchaseHistory } from "../../../api/purchaseHistoryAPI";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

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

const initalValues: PurchaseHistoryCreateForm = {
  nameSupplier: '',
  codeProduct: '',
  unitQuantity: 0,
  purchasePrice: 0,
  purchaseDesc: '',
};

type CreatePurchaseHistoryProps = {
  idProductAdd: ProductManagement['_id']
  setIdProductAdd: React.Dispatch<React.SetStateAction<string>>
}
export default function CreatePurchaseHistory({ idProductAdd, setIdProductAdd }: CreatePurchaseHistoryProps) {
  const [itemUnit, setItemUnit] = useState(1);
  const [unitPerItem, setUnitPerItem] = useState(1);
  const [unitQuantity, setUnitQuantity] = useState(1)
  const [codeProduct, setCodeProduct] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const purchaseProductModal = queryParams.get('purchaseProduct');
  const show = purchaseProductModal ? true : false;
  const MySwal = withReactContent(Swal);

  const queryClient = useQueryClient();

  const { data: dataSuppliers } = useQuery({
    queryKey: ['getSuppliers'],
    queryFn: getSelectSupplier,
    retry: false,
  });

  const { data: dataProductManagement } = useQuery({
    queryKey: ['productManagementAdd', idProductAdd],
    queryFn: () => getProductManagement(idProductAdd),
    refetchOnWindowFocus: false,
    retry: false
  });

  const { mutate } = useMutation({
    mutationFn: createPurchaseHistory,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['getProductsManagement'] });
      handleClosedModal();
      toast.success(data);
    }
  });

  useEffect(() => {
    if (dataProductManagement) {
      setCodeProduct(dataProductManagement.codeProduct);
    }
  }, [dataProductManagement]);

  useEffect(() => {
    setUnitQuantity(itemUnit * unitPerItem);
  }, [itemUnit, unitPerItem])



  const { control, register, reset, handleSubmit, formState: { errors } } = useForm({ defaultValues: initalValues });

  const handleCreatePurchaseHistory = (formData: PurchaseHistoryCreateForm) => {
    const { nameSupplier, purchaseDesc, purchasePrice } = formData;
    const data = {
      idProductManagement: idProductAdd,
      nameSupplier,
      codeProduct,
      unitQuantity: +unitQuantity,
      purchasePrice: +purchasePrice,
      purchaseDesc
    }

    navigate(location.pathname, { replace: true });

    setTimeout(() => {
      MySwal.fire({
        title: "Se registrará la compra con la siguiente descripción",
        text: `${purchaseDesc}`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancelar',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.isConfirmed) {
          mutate(data)
        } else if (result.dismiss === MySwal.DismissReason.cancel) {
          setIdProductAdd('');
          reset();              
        }
      });
    }, 0);
  }

  const handleClosedModal = () => {
    setIdProductAdd('');
    reset();
    navigate(location.pathname, { replace: true });
  }

  const handleChangeItemUnit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setItemUnit(+e.target.value);
  }

  const handleChangeUnitPerItem = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUnitPerItem(+e.target.value);
  }

  if (dataSuppliers && dataProductManagement) return (
    <Modal
      open={show}
      onClose={handleClosedModal}
    >
      <Box sx={styles.modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Registrar Compra
        </Typography>
        <Box mt={2}>
          <form
            onSubmit={handleSubmit(handleCreatePurchaseHistory)}
            noValidate
            autoComplete="off"
          >

            <div className="flex flex-col space-y-3 mb-5">
              <Controller
                name="nameSupplier"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="nameSupplier"
                    size="small"
                    options={dataSuppliers}
                    getOptionLabel={(option: SupplierSelect) => option.name.toUpperCase()}
                    onChange={(_, value) => field.onChange(value ? value.name : '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        label="Seleccionar Proveedor"
                      />
                    )}
                  />
                )}
                rules={{
                  required: 'El proveedor es obligatorio',
                  validate: (value) => value !== '' || 'Debes seleccionar una proveedor válido',
                }}
              />

              {errors.nameSupplier &&
                <ErrorMessage>{errors.nameSupplier.message}</ErrorMessage>
              }

              <TextField
                id="codeProduct"
                value={codeProduct}
                disabled={true}
                label="Codigo de producto"
                variant="outlined"
                sx={styles.input}
                size="small"
              />


              <div className="flex gap-4">
                <TextField
                  label="Cantidad de Items"
                  value={itemUnit}
                  onChange={handleChangeItemUnit}
                  type="number"
                  size="small"
                  sx={{
                    ...styles.input,
                    width: '100%',
                    flexGrow: 1,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: 1,
                  }}
                />

                <TextField
                  label="Cantidad por Item"
                  value={unitPerItem}
                  onChange={handleChangeUnitPerItem}
                  type="number"
                  size="small"
                  sx={{
                    ...styles.input,
                    width: '100%',
                    flexGrow: 1,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: 1,
                  }}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col">
                  <TextField
                    id="unitQuantity"
                    label="Cantidad Unitaria"
                    value={unitQuantity}
                    type="number"
                    size="small"
                    sx={{
                      ...styles.input,
                      flexGrow: 1, 
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}

                  />
                  {errors.unitQuantity &&
                    <ErrorMessage>{errors.unitQuantity.message}</ErrorMessage>
                  }
                </div>

                <div className="flex-1 flex flex-col">
                  <TextField
                    id="purchasePrice"
                    label="Precio de compra"
                    type="number"
                    size="small"
                    sx={{
                      ...styles.input,
                      flexGrow: 1, 
                    }}

                    {...register('purchasePrice', {
                      required: 'El precio de compra es obligatorio',
                      validate: value => value > 0 || 'El precio de compra debe ser mayor a 0'
                    })}
                  />
                  {errors.purchasePrice &&
                    <ErrorMessage>{errors.purchasePrice.message}</ErrorMessage>
                  }
                </div>
              </div>

              <textarea
                className="w-full p-2 border border-gray-300 rounded-md text-slate-800"
                placeholder="Descripcion de la compra realizada"
                {...register('purchaseDesc', {
                  required: 'La descripción de la compra es obligatorio'
                })}
              ></textarea>
              {errors.purchaseDesc &&
                <ErrorMessage>{errors.purchaseDesc.message}</ErrorMessage>
              }
            </div>


            <div className="flex flex-row-reverse gap-4">
              <Button
                onClick={handleClosedModal}
                variant="contained"
                sx={{
                  backgroundColor: '#374151',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#374151' },
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#1F2937',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#4b5563' },
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