import { isAxiosError } from "axios";
import api from "../lib/axios"
import { ProductSale, Sale, saleSchema, salesSchema } from "../types/sales";

type SaleAPI = {
  idSale: Sale['_id'],
  formData: {
    nameCustomer: string,
    products: ProductSale[],
    totalPrice: number,
    description: string
  }
}

export const createSale = async (formData: SaleAPI['formData']) => {
  try {
    const url = '/sales';
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }

  }
}

export const getAllSales = async () => {
  try {
    const url = '/sales';
    const { data } = await api.get(url);
    const response = salesSchema.safeParse(data);
    if(response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
}

export const deleteSale = async (idSale: SaleAPI['idSale']) => {
  try {
    const url = `/sales/${idSale}`
    const { data } = await api.delete<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
}

export const getSale = async (idSale: SaleAPI['idSale']) => {
  try {
    const url = `/sales/detail/${idSale}`;
    const { data } = await api.get(url);
    const response = saleSchema.safeParse(data);
    if(response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
}
