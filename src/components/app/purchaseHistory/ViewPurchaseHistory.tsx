import { Box, Modal } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { PurchaseHistory } from "../../../types/purchaseHistory";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPurchaseHistory } from "../../../api/purchaseHistoryAPI";
import { formatDate } from "../../../helpers";

const styles = {
  modal: {
    position: 'absolute' as 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  }
};

type ViewPurchaseHistoryProps = {
  idPurchaseHistoryView: PurchaseHistory['_id']
  setIdPurchaseHistoryView: React.Dispatch<React.SetStateAction<string>>
}

export default function ViewPurchaseHistory({ idPurchaseHistoryView, setIdPurchaseHistoryView }: ViewPurchaseHistoryProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const purchaseHistoryModal = queryParams.get('viewPurchaseHistory');
  const showModal = purchaseHistoryModal ? true : false;
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['purchaseHistoryView', idPurchaseHistoryView],
    queryFn: () => getPurchaseHistory(idPurchaseHistoryView),
    refetchOnWindowFocus: false,
    retry: false
  })

  const handleClosedModal = () => {
    navigate(location.pathname, { replace: true });
    queryClient.invalidateQueries({ queryKey: ['purchaseHistoryView', idPurchaseHistoryView] })
    setIdPurchaseHistoryView('');
  }

  if (data) return (
    <Modal
      open={showModal}
      onClose={handleClosedModal}
    >
      <Box sx={styles.modal}>
        <p className="text-center font-bold text-xl">Información de la Compra</p>

        <Box mt={2}>
          <div className="flex flex-col space-y-2">
            <p className="font-bold">Fecha de compra: <span className="font-normal">{formatDate(data.createdAt)}</span></p>
            <p className="font-bold">Proveedor: <span className="font-normal">{data.nameSupplier}</span></p>
            <p className="font-bold">Código de producto: <span className="font-normal">{data.codeProduct}</span ></p>
            <p className="font-bold">Cantidad unitaria: <span className="font-normal">{data.unitQuantity}</span></p>
            <p className="font-bold">Precio de compra: <span className="font-normal">Bs {data.purchasePrice}</span></p>
            <p className="font-bold">Descripción de la compra: <span className="font-normal">{data.purchaseDesc}</span></p>
          </div>
        </Box>
      </Box>
    </Modal>
  )
}
