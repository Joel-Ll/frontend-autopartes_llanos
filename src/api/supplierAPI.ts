import { isAxiosError } from "axios";
import api from "../lib/axios"
import { Supplier, SupplierCreateForm, supplierSchema, suppliersSelectSchema } from "../types/supplier";

type SupplierAPI = {
  _id: Supplier['_id']
  formData: SupplierCreateForm
  name: string,
  email: string,
  phone: string,
  address: string
  params: string
}

export const getSuppliers = async (params: SupplierAPI['params']) => {
  try {
    const encodedTerm = encodeURIComponent(params);
    const url = `suppliers/filtered/${encodedTerm}`;
    const { data } = await api.get(url);
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export const getSupplier = async (id: SupplierAPI['_id']) => {
  try {
    const url = `/suppliers/detail/${id}`;
    const { data } = await api.get(url);
    const response = supplierSchema.safeParse(data);
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

export const getSelectSupplier = async () => {
  try {
    const url = '/suppliers/selected';
    const { data } = await api.get(url);
    const response = suppliersSelectSchema.safeParse(data);
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

export const createSupplier = async (formData: SupplierAPI['formData']) => {
  try {
    const url = '/suppliers';
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

export const updateSupplier = async ({ formData, _id }: Pick<SupplierAPI, 'formData' | '_id'>) => {
  try {
    const url = `/suppliers/${_id}`;
    const { data } = await api.put<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
}

export const deleteSupplier = async (id: SupplierAPI['_id']) => {
  try {
    const url = `/suppliers/${id}`;
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

