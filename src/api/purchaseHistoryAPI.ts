import { isAxiosError } from "axios";
import api from "../lib/axios"
import { PurchaseHistoryCreateForm, purchaseHistorySchema, purchasesHistorySchema } from "../types/purchaseHistory";

type PurchaseHistoryAPI = {
  _id: string;
  formData: PurchaseHistoryCreateForm,
  searchParams: string;
  startDate: string;
  endDate: string;
}

export const getPurchasesHistorysAll = async (searchParams: string, startDate?: string | null, endDate?: string | null) => {
  try {
    const params = new URLSearchParams();
    
    if (searchParams) {
      params.append('term', searchParams);
    }

    // Solo agregar las fechas si ambas están presentes
    if (startDate && endDate) {
      params.append('startDate', startDate);
      params.append('endDate', endDate);
    }
    
    const url = `/purchase-history${params.toString() ? `?${params.toString()}` : ''}`;

    const { data } = await api.get(url);
    const response = purchasesHistorySchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
};

export const createPurchaseHistory = async (formData: PurchaseHistoryAPI['formData']) => {
  try {
    const url = '/purchase-history';
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

export const deletePurchaseHistory = async (id: PurchaseHistoryAPI['_id']) => {
  try {
    const url = `/purchase-history/${id}`;
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

export const getPurchaseHistory = async (id: PurchaseHistoryAPI['_id']) => {
  try {
    const url = `/purchase-history/${id}`;
    const { data } = await api.get(url);
    const response = purchaseHistorySchema.safeParse(data);
    if (response.success) {
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
