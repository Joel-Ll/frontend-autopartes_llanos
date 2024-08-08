import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import TextField from '@mui/material/TextField';
import CreateCustomerModal from '../../../components/app/customers/CreateCustomerModal';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCustomer, getCustomers } from '../../../api/customerAPI';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Customer } from '../../../types/customer';
import UpdateCustomerModal from '../../../components/app/customers/UpdateCustomerModal';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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

export default function Customers() {
  const [searchParams, setSearchParams] = useState('');
  const [idCustomer, setIdCustomer] = useState('');
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal)

  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(searchParams),
    retry: false,
  });

  const { mutate } = useMutation({
    mutationFn: deleteCustomer,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['customers']});
    }
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  }, [searchParams])

  const handleChage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchParams(e.target.value);
  }

  const handleEditCustomer = (id: Customer['_id']) => {
    setIdCustomer(id);
    navigate('?editCustomer=true');
  }

  const handleDeleteCustomer = (id: Customer['_id']) => {
    MySwal.fire({
      title: "¿Eliminar Registro?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if(result.isConfirmed) {
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
        <h1 className='text-2xl text-gray-800'>Clientes</h1>
        <div className='flex gap-6'>
          <TextField
            value={searchParams}
            onChange={handleChage}
            size='small'
            id="outlined-basic"
            label="Buscar cliente"
            variant="outlined"
          />

          <button
            className="text-white bg-gray-800 hover:bg-gray-700  font-medium rounded-md text-md px-7 py-2 text-center"
            onClick={() => navigate(location.pathname + '?newCustomer=true')}
          >Nuevo Cliente</button>
        </div>
      </div>

      <TableContainer component={Paper} className='mt-10'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>Nombre</StyledTableCell>
              <StyledTableCell align="right">NIT/CI</StyledTableCell>
              <StyledTableCell align="right">Teléfono</StyledTableCell>
              <StyledTableCell align="right">Dirección</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center">
                  <CircularProgress color="inherit" />
                </StyledTableCell>
              </StyledTableRow>
            ) : data?.length > 0 ? (
              data.map((customer: Customer) => (
                <StyledTableRow key={customer._id}>
                  <StyledTableCell align="left">{customer.name}</StyledTableCell>
                  <StyledTableCell align="right">{customer.nit_ci}</StyledTableCell>
                  <StyledTableCell align="right">{customer.phone}</StyledTableCell>
                  <StyledTableCell align="right">{customer.address}</StyledTableCell>
                  <StyledTableCell align="right">
                    {/* Editar */}
                    <button
                      className='bg-lime-500 mr-2 p-2 rounded'
                      onClick={ () => handleEditCustomer(customer._id)}
                    ><FaEdit /></button>
                    {/* Eliminar */}
                    <button 
                      className='bg-red-500  p-2 rounded'
                      onClick={() => handleDeleteCustomer(customer._id) }
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
      <CreateCustomerModal />
      {
        idCustomer &&
        <UpdateCustomerModal
          idCustomerEdit={idCustomer}
        />
      }
    </>
  )
}
