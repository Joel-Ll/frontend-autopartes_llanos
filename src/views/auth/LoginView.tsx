import { useForm } from 'react-hook-form';
import { UserLoginForm } from '../../types/auth';
import LoginForm from '../../components/auth/LoginForm';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/authAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initalValues: UserLoginForm = {
  name: '',
  password: '',
};

export default function LoginView() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<UserLoginForm>({ defaultValues: initalValues });
  const {mutate} = useMutation({
    mutationFn: login,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      navigate('/home');
    }
  });

  const handleLoginSubmit = (formData: UserLoginForm) => {
    mutate(formData);
  }

  return (
    <>
      <form
        className="space-y-4 p-10 bg-gray-800 mt-10 shadow rounded-lg border border-gray-700"
        onSubmit={handleSubmit(handleLoginSubmit)}
        noValidate
      >
        <h1 className="text-3xl font-black text-white mb-7">Iniciar Sesión</h1>

        <LoginForm 
          register={register}
          errors={errors}
        />

        <input
          type="submit"
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          value="Iniciar Sesión"
        />
      </form>
    </>
  )
}
