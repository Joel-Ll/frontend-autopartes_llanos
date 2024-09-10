import { Chip, CircularProgress, Paper, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import { Autocomplete, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateProductModal from "../../../components/app/products/CreateProductModal";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProduct, getProductsAll } from '../../../api/productAPI';
import { Product } from '../../../types/product';
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from "react-icons/md";
import { Category } from '../../../types/category';
import { getSelectCategory } from '../../../api/categoryAPI';
import { toast } from 'react-toastify';
import { IoEye } from "react-icons/io5";
import ViewProductModal from '../../../components/app/products/ViewProductModal';
import { colorStatus, productsStatus, statusDictionary } from '../../../locales';
import UpdateProductModal from '../../../components/app/products/UpdateProductModal';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

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

export default function Products() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchState, setSearchState] = useState('');
  const [searchParams, setSearchParams] = useState('');
  const [idProduct, setIdProduct] = useState<Product['_id']>('');
  const [idProductView, setIdProductView] = useState<Product['_id']>('');
  const [idProductEdit, setIdProductEdit] = useState<Product['_id']>('');
  const open = Boolean(anchorEl);
  const MySwal = withReactContent(Swal);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProductsAll({ searchParams, searchState, searchCategory }),
    refetchOnWindowFocus: false,
    retry: false
  });

  const { data: dataCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['selectCategories'],
    queryFn: getSelectCategory,
    refetchOnWindowFocus: false,
    retry: false
  });

  const {mutate} = useMutation({
    mutationFn: deleteProduct,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [searchParams, searchState, searchCategory])


  const handleChangeSearchParams = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchParams(e.target.value)
  }

  const handleViewProduct = (id: Product['_id']) => {
    navigate(location.pathname + '?viewProduct=true');
    setIdProductView(id);
    handleClosePopover()
  }

  const handleEditProduct = (id: Product['_id']) => {
    navigate(location.pathname + '?editProduct=true');
    setIdProductEdit(id);
    handleClosePopover();
  }

  const handleDeleteProduct = (id: Product['_id']) => {
    handleClosePopover(); 
    setTimeout(() => {
      MySwal.fire({
        title: "¿Eliminar Registro?",
        text: "Se eliminará el producto de la categoría asociada",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: 'Cancelar',
        confirmButtonText: "Eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          mutate(id);
        }
      });
    }, 0); 
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: Product['_id']) => {
    setAnchorEl(event.currentTarget);
    setIdProduct(id);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  if (isError) {
    toast.error('hubo un error');
  }

  if (data && dataCategories) return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className='text-2xl text-gray-800'>Productos</h1>
        <button
          className="text-white bg-gray-800 hover:bg-gray-700  font-medium rounded-md text-md px-7 py-2 text-center"
          onClick={() => navigate(location.pathname + '?newProduct=true')}
        >Nuevo Producto</button>
      </div>

      <div className='flex gap-6 '>
        <Autocomplete
          disablePortal
          size="small"
          sx={{ width: 250 }}
          options={dataCategories}
          getOptionLabel={(option: Category) => option.name.toUpperCase()}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              label="Seleccionar Categoría"
            />
          )}
          onChange={(_event, value) => {
            if (value) {
              setSearchCategory(value._id);
            } else {
              setSearchCategory('');
            }
          }}
        />

        <Autocomplete
          disablePortal
          size="small"
          options={productsStatus}
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Filtrar por estado"
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
          onChange={(_event, value) => {
            if (value) {
              setSearchState(value.status);
            } else {
              setSearchState('');
            }
          }}
        />

        <TextField
          value={searchParams}
          sx={{ width: 250 }}
          onChange={handleChangeSearchParams}
          size='small'
          label="Buscar Producto"
          variant="outlined"
        />
      </div>

      <TableContainer component={Paper} className='mt-10'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>Nombre</StyledTableCell>
              <StyledTableCell align='left'>Descripción</StyledTableCell>
              <StyledTableCell align="right">Codígo</StyledTableCell>
              <StyledTableCell align="right">Precio</StyledTableCell>
              <StyledTableCell align="right">Estado</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(isLoadingCategories || isLoading || isFetching) ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  <CircularProgress color="inherit" />
                </StyledTableCell>
              </StyledTableRow>
            ) : data.length > 0 ? (
              data.map((product: Product) => (
                <StyledTableRow key={product._id}>
                  <StyledTableCell align="left">{product.name}</StyledTableCell>
                  <StyledTableCell align="left">{product.description}</StyledTableCell>
                  <StyledTableCell align="right">{product.code}</StyledTableCell>
                  <StyledTableCell align="right">Bs {product.salePrice}</StyledTableCell>
                  <StyledTableCell align="right"><Chip size="small" variant='filled' color={colorStatus[product.state]} label={statusDictionary[product.state]} /></StyledTableCell>
                  <StyledTableCell align="right">
                    <button onClick={(event) => handleClick(event, product._id)}>
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
                          onClick={() => handleViewProduct(idProduct)}
                        >
                          <IoEye />
                          <p className='font-medium'>Ver</p>
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
                <StyledTableCell colSpan={6} align="center">
                  No hay registros
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateProductModal
        dataCategories={dataCategories}
      />

      {idProductView &&
        <ViewProductModal
          setIdProductView={setIdProductView}
          idProductView={idProductView}
        />
      }

      {idProductEdit &&
        <UpdateProductModal
          setIdProductEdit={setIdProductEdit}
          idProductEdit={idProductEdit}
          dataCategories={dataCategories}
        />
      }
    </>
  )
}




