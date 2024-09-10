import { isAxiosError } from "axios";
import api from "../lib/axios"
import { Product, ProductCreateForm, productSchema, productSchemaFilter, productsSchema } from "../types/product";

type ProductAPI = {
  _id: string;
  name: string,
  params: string
  formData: ProductCreateForm
  searchParams: string;
  searchState: string;
  searchCategory: string;
}

export const getFilteredProduct = async (code: Product['code']) => {
  try {
    const url = '/products/filtered-product';
    const { data } = await api.post(url, {code} );
    const response = productSchemaFilter.safeParse(data);
    if( response.success ) {
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

export const getProductsAll = async ({
  searchParams,
  searchState,
  searchCategory,
}: Pick<ProductAPI, 'searchParams' | 'searchState' | 'searchCategory'>) => {
  try {
    const params = new URLSearchParams();
    
    if (searchParams) {
      // const encodedTerm = encodeURIComponent(searchParams);
      params.append('term', searchParams);
    }
    if (searchState) {
      params.append('status', searchState);
    }
    if (searchCategory) {
      params.append('category', searchCategory);
    }
    const url = `/products${params.toString() ? `?${params.toString()}` : ''}`;

    const { data } = await api.get(url);
    const response = productsSchema.safeParse(data);
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

export const getProduct = async (id: ProductAPI['_id']) => {
  try {
    const url = `/products/${id}`;
    const { data } = await api.get(url);
    const response = productSchema.safeParse(data);
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

export const createProduct = async (formData: ProductAPI['formData']) => {
  try {
    const url = '/products';
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

export const updateProduct = async ({ _id, formData }: Pick<ProductAPI, '_id' | 'formData'>) => {
  try {
    const url = `/products/${_id}`;
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

export const deleteProduct = async (id: ProductAPI['_id']) => {
  try {
    const url = `/products/${id}`;
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