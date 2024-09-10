import { Box, Modal } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Product } from "../../../types/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct } from "../../../api/productAPI";
import { getCategory } from "../../../api/categoryAPI";
import { statusDictionary } from "../../../locales";

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

type ViewProductModalProps = {
  idProductView: Product['_id']
  setIdProductView: React.Dispatch<React.SetStateAction<string>>
}

export default function ViewProductModal({ idProductView, setIdProductView }: ViewProductModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productModal = queryParams.get('viewProduct');
  const showModal = productModal ? true : false;

  const queryClient = useQueryClient();

  const { data: productData } = useQuery({
    queryKey: ['productView', idProductView],
    queryFn: () => getProduct(idProductView),
    refetchOnWindowFocus: false,
    retry: false
  });

  const categoryId = productData?.category!;

  const { data: categoryData } = useQuery({
    queryKey: ['categoryView', categoryId],
    queryFn: () => getCategory(categoryId),
    enabled: !!categoryId,
    refetchOnWindowFocus: false,
    retry: false
  });

  const handleClosedModal = () => {
    navigate(location.pathname, { replace: true });
    queryClient.invalidateQueries({ queryKey: ['productView', idProductView] })
    queryClient.invalidateQueries({ queryKey: ['categoryView', categoryId] })
    setIdProductView('');
  }


  if (productData && categoryData) return (
    <Modal
      open={showModal}
      onClose={handleClosedModal}
    >
      <Box sx={styles.modal}>
        <p className="text-center font-bold text-xl">Información del Producto</p>

        <Box mt={2}>
          <div className="flex flex-col space-y-2">
            <p className="font-bold">Categoría: <span className="font-normal">{categoryData.name}</span></p>
            <p className="font-bold">Nombre: <span className="font-normal">{productData.name}</span></p>
            <p className="font-bold">Código: <span className="font-normal">{productData.code}</span ></p>
            <p className="font-bold">Precio: <span className="font-normal"> Bs {productData.salePrice}</span></p>
            <p className="font-bold">Descripción: <span className="font-normal">{productData.description}</span></p>
            <p className="font-bold">Estado: <span className="font-normal">{statusDictionary[ productData.state]}</span></p>
          </div>
        </Box>
      </Box>
    </Modal>
  )
}
