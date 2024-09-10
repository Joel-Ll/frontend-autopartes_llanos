import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, styled, tableCellClasses } from '@mui/material';
import CreateSupplierModal from "../../../components/app/suppliers/CreateSupplierModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { deleteSupplier, getSuppliers } from "../../../api/supplierAPI";
import { Supplier } from "../../../types/supplier";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import UpdateSupplierModal from "../../../components/app/suppliers/UpdateSupplierModal";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1F2937',
    color: theme.palette.common.white,

  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function Suppliers() {
  const [searchParams, setSearchParams] = useState('');
  const [idSupplier, setIdSupplier] = useState('');
  const MySwal = withReactContent(Swal)
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => getSuppliers(searchParams),
    refetchOnWindowFocus: false,
    retry: false
  });
  const { mutate } = useMutation({
    mutationFn: deleteSupplier,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    }
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['suppliers'] });
  }, [searchParams])

  const handleChage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchParams(e.target.value);
  }

  const handleEditSupplier = (id: Supplier['_id']) => {
    setIdSupplier(id);
    navigate('?editSupplier=true');
  }

  const handleDeleteSupplier = (id: Supplier['_id']) => {
    MySwal.fire({
      title: "¿Eliminar Registro?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(id)
      }
    });
  }

  if (isError) {
    toast.error('Hubo un error');
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className='text-2xl text-gray-800'>Proveedores</h1>
        <div className='flex gap-6'>
          <TextField
            value={searchParams}
            onChange={handleChage}
            size='small'
            id="outlined-basic"
            label="Buscar proveedor"
            variant="outlined"
          />

          <button
            className="text-white bg-gray-800 hover:bg-gray-700  font-medium rounded-md text-md px-7 py-2 text-center"
            onClick={() => navigate(location.pathname + '?newSupplier=true')}
          >Nuevo Proveedor</button>
        </div>
      </div>

      <TableContainer component={Paper} className='mt-10'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>Nombre</StyledTableCell>
              <StyledTableCell align="right">Correo Electrónico</StyledTableCell>
              <StyledTableCell align="right">Teléfono</StyledTableCell>
              <StyledTableCell align="right">Dirección</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(isLoading || isFetching) ? (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center">
                  <CircularProgress color="inherit" />
                </StyledTableCell>
              </StyledTableRow>
            ) : data?.length > 0 ? (
              data.map((supplier: Supplier) => (
                <StyledTableRow key={supplier._id}>
                  <StyledTableCell align="left">{supplier.name}</StyledTableCell>
                  <StyledTableCell align="right">{supplier.email}</StyledTableCell>
                  <StyledTableCell align="right">{supplier.phone}</StyledTableCell>
                  <StyledTableCell align="right">{supplier.address}</StyledTableCell>
                  <StyledTableCell align="right">
                    {/* Editar */}
                    <button
                      className='bg-lime-500 mr-2 p-2 rounded'
                      onClick={() => handleEditSupplier(supplier._id)}
                    ><FaEdit /></button>
                    {/* Eliminar */}
                    <button
                      className='bg-red-500  p-2 rounded'
                      onClick={() => handleDeleteSupplier(supplier._id)}
                    ><FaTrashAlt color='#fff' /></button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center">
                  No hay registros
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateSupplierModal />
      {
        idSupplier &&
        <UpdateSupplierModal
          idSupplierEdit={idSupplier}
        />
      }
    </>
  )
}
