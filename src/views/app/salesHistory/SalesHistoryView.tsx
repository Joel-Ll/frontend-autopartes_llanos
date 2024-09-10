import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteSale, getAllSales, getSale } from '../../../api/salesAPI';
import { formatDate } from '../../../helpers';
import { FaTrashAlt } from 'react-icons/fa';
import { FaFilePdf } from "react-icons/fa6";
import { Sale } from '../../../types/sales';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

export default function SalesHistoryView() {
  const MySwal = withReactContent(Swal);

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['sales'],
    queryFn: getAllSales,
    retry: false
  });

  const { mutate } = useMutation({
    mutationFn: deleteSale,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success(data);
    }
  });

  const { mutate: mutateSale } = useMutation({
    mutationFn: getSale,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      const doc = new jsPDF({
        format: "letter",
        unit: "pt",
      });
      // Título con formato
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Nota de Venta", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

      // Línea debajo del título
      doc.setLineWidth(1);
      doc.setDrawColor(0, 0, 0); // Color negro
      const titleWidth = doc.getTextWidth("Nota de Venta");
      const titleX = doc.internal.pageSize.getWidth() / 2 - titleWidth / 2;
      doc.line(titleX, 45, titleX + titleWidth, 45);

      // Nombre de la tienda
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
      doc.text("AutoPartes Llanos", doc.internal.pageSize.getWidth() / 2, 60, { align: "center" });

      // Estilo de las etiquetas y valores
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Nro:", 40, 70);  // Etiqueta en negrita
      doc.setFont("Helvetica", "normal");
      doc.text(`1002`, 80, 70);   // Valor normal

      doc.setFont("Helvetica", "bold");
      doc.text("Nombre Cliente:", 40, 90);  // Etiqueta en negrita
      doc.setFont("Helvetica", "normal");
      doc.text(`${data?.nameCustomer || 'Juan Perez'}`, 140, 90);  // Valor normal

      doc.setFont("Helvetica", "bold");
      doc.text("Fecha:", 40, 110);  // Etiqueta en negrita
      doc.setFont("Helvetica", "normal");
      doc.text(`${formatDate(data?.createdAt!)} - Tarija - Bolivia`, 90, 110);  // Valor normal



      const columns = ['Nro', 'Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']

      let finalY: number = 130;
      const rowHeight = 5;
      const dataSales = data?.products.map((product, index) => [
        index + 1,
        product.nameProduct,
        product.quantity,
        product.unitPrice,
        product.subtotal
      ]);


      autoTable(doc, {
        head: [columns],
        body: dataSales,
        startY: finalY,
        styles: {
          fontSize: 10,
        },
        didDrawCell: () => {
          finalY += rowHeight;
        },
      });
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Nro:", 40, 70);  // Etiqueta en negrita
      doc.setFont("Helvetica", "normal");
      doc.text(`1002`, 80, 70);   // Valor normal

      doc.setFont("Helvetica", "bold");
      doc.text(`Total: Bs ${data?.totalPrice}`, 40, finalY + 20);

      doc.setFont("Helvetica", "bold");
      doc.text(`Por concepto de: `, 40, finalY + 40);
      doc.setFont("Helvetica", "normal");
      doc.text(`${data?.description}`, 145, finalY + 40);
      

      // Línea de firma centrada en la página
      const pageWidth = doc.internal.pageSize.getWidth();
      const signatureLineWidth = 200; // Ancho de la línea de firma
      const signatureX = (pageWidth - signatureLineWidth) / 2; // Calcular posición X para centrar

      // Ajustar la posición vertical de la línea de firma
      const signatureY = finalY + 150; // Posición vertical de la línea de firma

      // Línea para firma
      doc.setLineWidth(1);
      doc.setDrawColor(0, 0, 0); // Color negro
      doc.line(signatureX, signatureY, signatureX + signatureLineWidth, signatureY); // Línea para firma

      // // Texto "Propietario" sobre la línea
      doc.setFont("Helvetica", "bold");
      doc.text("Propietario", pageWidth / 2, signatureY + 20, { align: "center" });


      doc.save(`nota_venta_${data?._id}`);
    }
  });


  const handleDeleteSale = (idSale: Sale['_id']) => {
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
          mutate(idSale);
        }
      });
    }, 0);
  }

  const handleCreatePDF = (idSale: Sale['_id']) => {
    mutateSale(idSale);
  }

  if (data) return (
    <>
      <h1 className='text-3xl text-gray-800 mb-5'>Registro de Ventas</h1>

      <TableContainer component={Paper} className='mt-10'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>Nro</StyledTableCell>
              <StyledTableCell align='left'>Fecha</StyledTableCell>
              <StyledTableCell align="right">Cliente</StyledTableCell>
              <StyledTableCell align="right">Monto Total</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(isLoading || isFetching) ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  <CircularProgress color="inherit" />
                </StyledTableCell>
              </StyledTableRow>
            ) : data.length > 0 ? (
              data.map((sale, index) => (
                <StyledTableRow key={sale._id}>
                  <StyledTableCell align="left">{index + 1}</StyledTableCell>
                  <StyledTableCell align="left">{formatDate(sale.createdAt)}</StyledTableCell>
                  <StyledTableCell align="right">{sale.nameCustomer ? sale.nameCustomer : 'Anónimo'}</StyledTableCell>
                  <StyledTableCell align="right">Bs {sale.totalPrice}</StyledTableCell>
                  <StyledTableCell align="right">
                    {/* PDF */}
                    <button
                      className='bg-lime-500 mr-2 p-2 rounded'
                      onClick={() => handleCreatePDF(sale._id)}
                    >
                      <FaFilePdf />
                    </button>
                    {/* Eliminar */}
                    <button
                      className='bg-red-500  p-2 rounded'
                      onClick={() => handleDeleteSale(sale._id)}
                    ><FaTrashAlt color='#fff' /></button>
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
