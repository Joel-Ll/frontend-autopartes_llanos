import { ChangeEvent, useEffect, useState } from "react";
import { TextField, CircularProgress, Paper, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import { useNavigate } from "react-router-dom";
import CreateManagementModal from "../../../components/app/management/CreateManagementModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteProductManagement, getProductsManagement } from "../../../api/managementProductAPI";
import { ProductManagement } from "../../../types/managementProduct";
import { BiDotsVerticalRounded } from "react-icons/bi";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { MdDelete, MdEdit } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import UpdateManagementModal from "../../../components/app/management/UpdateManagementModal";
import CreatePurchaseHistory from "../../../components/app/purchaseHistory/CreatePurchaseHistory";

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

export default function InventoryManagementView() {
  const [idProduct, setIdProduct] = useState<ProductManagement['_id']>('');
  const [idProductAdd, setIdProductAdd] = useState<ProductManagement['_id']>('');
  const [idProductEdit, setIdProductEdit] = useState<ProductManagement['_id']>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchParams, setSearchParams] = useState('');

  const open = Boolean(anchorEl);
  const MySwal = withReactContent(Swal);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: ['getProductsManagement'],
    queryFn: () => getProductsManagement(searchParams),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { mutate: mutateDeleteProductManagement } = useMutation({
    mutationFn: deleteProductManagement,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['getProductsManagement'] });
      toast.success(data);
    }
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['getProductsManagement'] });
  }, [searchParams])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: ProductManagement['_id']) => {
    setAnchorEl(event.currentTarget);
    setIdProduct(id);
  };

  const handleAddProduct = (id: ProductManagement['_id']) => {
    navigate(location.pathname + '?purchaseProduct=true');
    setIdProductAdd(id);
    handleClosePopover()
  }

  const handleEditProduct = (id: ProductManagement['_id']) => {
    navigate(location.pathname + '?editProductManagement=true');
    setIdProductEdit(id);
    handleClosePopover();
  }

  const handleDeleteProduct = (id: ProductManagement['_id']) => {
    handleClosePopover();
    setTimeout(() => {
      MySwal.fire({
        title: "¿Eliminar Registro?",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: 'Cancelar',
        confirmButtonText: "Eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          mutateDeleteProductManagement(id);
        }
      });
    }, 0);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleChage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchParams(e.target.value);
  }

  if (isError) {
    toast.error('Hubo un error');
  }

  if (data) return (
    <>
      <div className="flex justify-between items-center">
        <h1 className='text-2xl text-gray-800'>Gestión de Productos</h1>
        <div className='flex gap-6'>
          <TextField
            value={searchParams}
            onChange={handleChage}
            size='small'
            id="outlined-basic"
            label="Código de producto"
            variant="outlined"
          />

          <button
            className="text-white bg-gray-800 hover:bg-gray-700  font-medium rounded-md text-md px-7 py-2 text-center"
            onClick={() => navigate(location.pathname + '?newManagement=true')}
          >Nueva Gestión</button>
        </div>
      </div>

      <TableContainer component={Paper} className='mt-10'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>Código</StyledTableCell>
              <StyledTableCell align="right">Precio</StyledTableCell>
              <StyledTableCell align="right">Cantidad</StyledTableCell>
              <StyledTableCell align="right">Ventas</StyledTableCell>
              <StyledTableCell align="right">Ingresos</StyledTableCell>
              <StyledTableCell align="right">Egresos</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(isLoading || isFetching) ? (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  <CircularProgress color="inherit" />
                </StyledTableCell>
              </StyledTableRow>
            ) : data.length > 0 ? (
              data.map((productManagement: ProductManagement) => (
                <StyledTableRow key={productManagement._id}>
                  <StyledTableCell align="left">{productManagement.codeProduct}</StyledTableCell>
                  <StyledTableCell align="right">Bs {productManagement.productPrice}</StyledTableCell>
                  <StyledTableCell align="right">{productManagement.productQuantity}</StyledTableCell>
                  <StyledTableCell align="right">{productManagement.salesQuantity}</StyledTableCell>
                  <StyledTableCell align="right">{productManagement.income}</StyledTableCell>
                  <StyledTableCell align="right">{productManagement.expenses}</StyledTableCell>
                  <StyledTableCell align="right">
                    <button onClick={(event) => handleClick(event, productManagement._id)}>
                      <BiDotsVerticalRounded fontSize={25} />
                    </button>
                    <Popover
                      id={idProduct}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClosePopover}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      sx={{
                        '& .MuiPaper-root': {
                          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.10)',
                        },
                      }}
                    >
                      <div className='flex flex-col gap-2 text-sm py-3 px-5 justify-end'>
                        <button
                          className='flex gap-2 items-center'
                          onClick={() => handleAddProduct(idProduct)}
                        >
                          <IoIosAddCircle />
                          <p className='font-medium'>Agregar</p>
                        </button>
                        <button
                          className='flex gap-2 items-center'
                          onClick={() => handleEditProduct(idProduct)}
                        >
                          <MdEdit />
                          <p className='font-medium'>Editar</p>
                        </button>

                        <button
                          className='flex gap-2 items-center'
                          onClick={() => handleDeleteProduct(idProduct)}
                        >
                          <MdDelete />
                          <p className='font-medium'>Eliminar</p>
                        </button>
                      </div>
                    </Popover>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No hay registros
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CreateManagementModal />

      {idProductEdit &&
        <UpdateManagementModal
          setIdProductEdit={setIdProductEdit}
          idProductEdit={idProductEdit}
        />
      }

      {idProductAdd &&
        <CreatePurchaseHistory
          idProductAdd={idProductAdd}
          setIdProductAdd={setIdProductAdd}
        />
      }
    </>
  )
}


