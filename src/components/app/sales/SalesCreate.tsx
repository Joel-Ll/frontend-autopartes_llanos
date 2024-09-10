import { Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSelectCategory } from "../../../api/categoryAPI";
import { getProductsAll } from "../../../api/productAPI";
import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Category } from "../../../types/category";
import { Product } from '../../../types/product';
import { ProductSale } from '../../../types/sales';

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


type SalesCreateProps = {
  setProductSales: React.Dispatch<React.SetStateAction<ProductSale[]>>
}

export default function SalesCreate({setProductSales}: SalesCreateProps) {

  const [searchCategory, setSearchCategory] = useState('');
  const [searchParams, setSearchParams] = useState('');
  const searchState = '';

  const queryClient = useQueryClient()

  const { data: dataProducts, isLoading, isFetching } = useQuery({
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

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [searchParams, searchState, searchCategory])

  const handleChangeSearchParams = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchParams(e.target.value)
  }

  const handleAddProduct = (product: ProductSale) => {
    setProductSales((prevProducts ) => {
      const productsSet = new Set(prevProducts.map( p => p.idProduct));
      if(!productsSet.has(product.idProduct)) {
        return [...prevProducts, product];
      }
      return prevProducts
    });
  }

  if (dataCategories && dataProducts) return (
    <>
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

        <TextField
          value={searchParams}
          sx={{ width: 250 }}
          onChange={handleChangeSearchParams}
          size='small'
          label="Buscar por descripción"
          variant="outlined"
        />
      </div>

      <TableContainer component={Paper} className='mt-5'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>Código</StyledTableCell>
              <StyledTableCell align="left">Descripción</StyledTableCell>
              <StyledTableCell align="left">Stock</StyledTableCell>
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
            ) : dataProducts.length > 0 ? (
              dataProducts.map((product: Product) => (
                <StyledTableRow key={product._id}>
                  <StyledTableCell align="left">{product.code}</StyledTableCell>
                  <StyledTableCell align="left">{product.description}</StyledTableCell>
                  <StyledTableCell align="left">{product.stock}</StyledTableCell>
                  <StyledTableCell align="right">
                    { product.stock > 0 ?
                    <Button 
                      size='small' color='success' variant="outlined"
                      onClickCapture={ () => handleAddProduct({
                        idProduct: product._id,
                        nameProduct: product.name,
                        quantity: 1,
                        unitPrice: product.salePrice,
                        subtotal: product.salePrice
                      })}
                    >Agregar</Button> : 
                    <p className='text-red-400'>No disponible</p>
                  }
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
    </>
  )
}
