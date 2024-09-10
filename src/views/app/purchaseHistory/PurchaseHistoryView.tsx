import { ChangeEvent, useEffect, useState } from 'react';
import { CircularProgress, Paper, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, styled, tableCellClasses } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePurchaseHistory, getPurchasesHistorysAll } from '../../../api/purchaseHistoryAPI';
import { PurchaseHistory } from '../../../types/purchaseHistory';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IoEye } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { formatDate } from '../../../helpers';
import { toast } from 'react-toastify';
import ViewPurchaseHistory from '../../../components/app/purchaseHistory/ViewPurchaseHistory';

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

export default function PurchaseHistoryView() {
  const [searchParams, setSearchParams] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [idPurchaseHistory, setIdPurchaseHistory] = useState<PurchaseHistory['_id']>('');
  const [idPurchaseHistoryView, setIdPurchaseHistoryView] = useState<PurchaseHistory['_id']>('');
  const MySwal = withReactContent(Swal);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const { data, isLoading } = useQuery({
    queryKey: ['getPurchasesHistory'],
    queryFn: () => getPurchasesHistorysAll(searchParams, startDate, endDate),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !startDate && !endDate || (!!startDate && !!endDate),
  });

  const { mutate } = useMutation({
    mutationFn: deletePurchaseHistory,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['getPurchasesHistory'] })
      toast.success(data);
    }
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['getPurchasesHistory'] });
  }, [searchParams, startDate, endDate]);

  const handleViewPurchaseHistory = (id: PurchaseHistory['_id']) => {
    navigate(location.pathname + '?viewPurchaseHistory=true');
    setIdPurchaseHistoryView(id);
    handleClosePopover()
  }

  const handleDeletePurchaseHistory = (id: PurchaseHistory['_id']) => {
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
          mutate(id);
        }
      });
    }, 0);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: PurchaseHistory['_id']) => {
    setAnchorEl(event.currentTarget);
    setIdPurchaseHistory(id)
  }

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleChage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchParams(e.target.value);
  }

  if (data) return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className='text-2xl text-gray-800'>Historial de Compras</h1>

        <TextField
          value={searchParams}
          onChange={handleChage}
          size='small'
          sx={{width: 270}}
          id="outlined-basic"
          label="Buscar por código o proveedor"
          variant="outlined"
        />
        <div className="flex items-center gap-4">
          <input
            id='init-date'
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:border-gray-800"
            placeholder="Fecha inicial"
          />

          <p>-</p>
          
          <input
            id='end-date'
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:border-gray-800"
            placeholder="Fecha final"
          />
        </div>

      </div>

      <TableContainer component={Paper} className='mt-10'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>Fecha de Compra</StyledTableCell>
              <StyledTableCell align="right">Proveedor</StyledTableCell>
              <StyledTableCell align="right">Código de Producto</StyledTableCell>
              <StyledTableCell align="right">Cantidad Unitaria</StyledTableCell>
              <StyledTableCell align="right">Precio de Compra</StyledTableCell>
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
            ) : data.length > 0 ? (
              data.map((purchaseHistory: PurchaseHistory) => (
                <StyledTableRow key={purchaseHistory._id}>
                  <StyledTableCell align="left">{formatDate(purchaseHistory.createdAt)}</StyledTableCell>
                  <StyledTableCell align="right">{purchaseHistory.nameSupplier}</StyledTableCell>
                  <StyledTableCell align="right">{purchaseHistory.codeProduct}</StyledTableCell>
                  <StyledTableCell align="right">{purchaseHistory.unitQuantity} Unidades</StyledTableCell>
                  <StyledTableCell align="right">Bs {purchaseHistory.purchasePrice}</StyledTableCell>
                  <StyledTableCell align="right">
                    <button onClick={(event) => handleClick(event, purchaseHistory._id)}>
                      <BiDotsVerticalRounded fontSize={25} />
                    </button>
                    <Popover
                      id={idPurchaseHistory}
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
                          onClick={() => handleViewPurchaseHistory(idPurchaseHistory)}
                        >
                          <IoEye />
                          <p className='font-medium'>Ver</p>
                        </button>

                        <button
                          className='flex gap-2 items-center'
                          onClick={() => handleDeletePurchaseHistory(idPurchaseHistory)}
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

      {
        idPurchaseHistoryView && (
          <ViewPurchaseHistory
            idPurchaseHistoryView={idPurchaseHistoryView}
            setIdPurchaseHistoryView={setIdPurchaseHistoryView}
          />
        )
      }
    </>
  )
}
