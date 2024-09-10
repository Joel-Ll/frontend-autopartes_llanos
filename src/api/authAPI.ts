import { isAxiosError } from "axios";
import api from "../lib/axios"

type AuthAPI = {
  name: string,
  password: string,
}

export const login = async (formData: Pick<AuthAPI, 'name' | 'password'>) => {
  try {
    const url = '/auth/login';
    const { data } = await api.post<string>(url, formData);
    localStorage.setItem('AUTH_TOKEN', data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } 
  }
}

export const confirmPassword = async (current_password: AuthAPI['password']) => {
  try {
    const url = '/auth/confirm-password';
    const { data } = await api.post(url, {current_password} );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Hubo un error');
    }
  }
}

export const getUser = async () => {
  try {
    const url = '/auth/user';
    const { data } = await api.get<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
