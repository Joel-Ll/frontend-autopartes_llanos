import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, styled, tableCellClasses } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CreateCategoryModal from "../../../components/app/categories/CreateCategoryModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategory, getCategories } from "../../../api/categoryAPI";
import { toast } from "react-toastify";
import { Category } from "../../../types/category";
import { capitalizeFirstLetter } from "../../../helpers";
import UpdateCategoryModal from "../../../components/app/categories/UpdateCategoryModal";
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


export default function CategoriesView() {
  const [searchParams, setSearchParams] = useState('');
  const [idCategory, setIdCategory] = useState('');
  const MySwal = withReactContent(Swal)

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(searchParams),
    retry: false
  });

  const {mutate} = useMutation({
    mutationFn: deleteCategory,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['categories']});
    }
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  }, [searchParams])

  const handleChage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchParams(e.target.value);
  }

  const handleEditCategory = (id: Category['_id']) => {
    setIdCategory(id);
    navigate('?editCategory=true');
  }

  const handleDeleteCategory = (id: Category['_id']) => {
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
        <h1 className='text-2xl text-gray-800'>Categorías</h1>
        <div className='flex gap-6'>
          <TextField
            value={searchParams}
            onChange={handleChage}
            size='small'
            id="outlined-basic"
            label="Buscar Categoría"
            variant="outlined"
          />

          <button
            className="text-white bg-gray-800 hover:bg-gray-700  font-medium rounded-md text-md px-7 py-2 text-center"
            onClick={() => navigate(location.pathname + '?newCategory=true')}
          >Nueva Categoría</button>
        </div>
      </div>

      <TableContainer component={Paper} className='mt-10'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>Nombre Categoria</StyledTableCell>
              <StyledTableCell align="right">Editar</StyledTableCell>
              <StyledTableCell align="right">Eliminar</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={3} align="center">
                  <CircularProgress color="inherit" />
                </StyledTableCell>
              </StyledTableRow>
            ) : data?.length > 0 ? (
              data.map((category: Category) => (
                <StyledTableRow key={category._id}>
                  <StyledTableCell align="left">{capitalizeFirstLetter(category.name)}</StyledTableCell>
                  <StyledTableCell align="right">
                    {/* Editar */}
                    <button
                      className='bg-lime-500 mr-2 p-2 rounded'
                      onClick={() => handleEditCategory(category._id)}
                    ><FaEdit /></button>
                  </StyledTableCell>
                  {/* Eliminar */}
                  <StyledTableCell align="right">
                    <button
                      className='bg-red-500  p-2 rounded'
                      onClick={ () => handleDeleteCategory(category._id)}
                    ><FaTrashAlt color='#fff' /></button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={3} align="center">
                  No hay registros
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateCategoryModal />
      {
        idCategory &&
        <UpdateCategoryModal
          idCategoryEdit={idCategory}
        />
      }
    </>
  )
}
