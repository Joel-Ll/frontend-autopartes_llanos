import { isAxiosError } from "axios";
import api from "../lib/axios"
import { Category, CategoryCreateForm, categoriesSchema, categorySchema } from "../types/category";

type categoryAPI = {
  _id: string;
  name: string,
  params: string
  formData: CategoryCreateForm;
}

export const getCategory = async (id: Category['_id']) => {
  try {
    const url = `/categories/detail/${id}`;
    const { data } = await api.get(url);
    const response = categorySchema.safeParse(data);
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

export const getCategories = async (params: categoryAPI['params']) => {
  try {
    const encodedTerm = encodeURIComponent(params);
    const url = `/categories/filtered/${encodedTerm}`;
    const { data } = await api.get(url);
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
}

export const getSelectCategory = async () => {
  try {
    const url = '/categories/selected';
    const { data } = await api.get(url);
    const response = categoriesSchema.safeParse(data);
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

export const createCategory = async (name: categoryAPI['name']) => {
  try {
    const url = '/categories';
    const { data } = await api.post<string>(url, { name });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
}

export const updateCategory = async ({ formData, _id }: Pick<categoryAPI, 'formData' | '_id'>) => {
  try {
    const url = `/categories/${_id}`;
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

export const deleteCategory = async (id: Category['_id']) => {
  try {
    const url = `/categories/${id}`;
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