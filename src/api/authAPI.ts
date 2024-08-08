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
