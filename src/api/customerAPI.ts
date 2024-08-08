import { isAxiosError } from "axios";
import api from "../lib/axios"
import { Customer, CustomerCreateForm, customerSchema } from "../types/customer";

type CustomerAPI = {
  _id: Customer['_id']
  formData: CustomerCreateForm
  name: string,
  nit_ci: string,
  phone: string,
  address: string
  params: string
}

export const getCustomers = async (params: CustomerAPI['params']) => {
  try {
    const url = `/customers/${params}`;
    const { data } = await api.get(url);
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export const getCustomer = async (id: CustomerAPI['_id']) => {
  try {
    const url = `/customers/detail/${id}`;
    const { data } = await api.get(url);
    const response = customerSchema.safeParse(data);
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

export const createCustomer = async (formData: CustomerAPI['formData']) => {
  try {
    const url = '/customers';
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

export const updateCustomer = async ({ formData, _id }: Pick<CustomerAPI, 'formData' | '_id'>) => {
  try {
    const url = `/customers/${_id}`;
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

export const deleteCustomer = async (id: CustomerAPI['_id']) => {
  try {
    const url = `/customers/${id}`;
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