import { isAxiosError } from "axios";
import api from "../lib/axios"
import { ProductManagement, ProductManagementCreateForm, productIncomeAndExpenses, productManagementSchema, productsManagementSchema } from "../types/managementProduct";
import { Product } from "../types/product";

type ManagementProductAPI = {
  _id: ProductManagement['_id'];
  productId: Product['_id']
  productPrice: number;
  formData: ProductManagementCreateForm;
  params: string;
}

export const createProductManagement = async (formData: ManagementProductAPI['formData']) => {
  try {
    const url = '/products-management';
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

export const getProductsManagement = async (params: ManagementProductAPI['params']) => {
  try {
    const encodedTerm = encodeURIComponent(params);
    const url = `/products-management/${encodedTerm}`;
    const { data } = await api.get(url);
    const response = productsManagementSchema.safeParse(data);
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export const getExpensesAndIncome = async () => {
  try {
    const url = `/products-management/}`;
    const { data } = await api.get(url);
    const response = productIncomeAndExpenses.safeParse(data);
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export const getProductManagement = async (id: ManagementProductAPI['_id']) => {
  try {
    const url = `/products-management/detail/${id}`;
    const { data } = await api.get(url);
    const response = productManagementSchema.safeParse(data);
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
}

export const updateProductManagement = async ({ productPrice, _id }: Pick<ManagementProductAPI, 'productPrice' | '_id'>) => {
  try {
    const url = `/products-management/${_id}`;
    const { data } = await api.put<string>(url, { productPrice });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
}

export const deleteProductManagement = async (id: ManagementProductAPI['_id']) => {
  try {
    const url = `/products-management/${id}`;
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