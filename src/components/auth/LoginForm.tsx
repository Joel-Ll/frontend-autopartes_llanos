import { useState } from "react";
import ErrorMessage from "../ErrorMessage"
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { UserLoginForm } from "../../types/auth";

type LoginFormProps = {
  register: UseFormRegister<UserLoginForm>,
  errors: FieldErrors<UserLoginForm>,

}

export default function LoginForm({register, errors}: LoginFormProps) {

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-white"
        >Nombre Usuario:</label>

        <input
          id="name"
          type="text"
          placeholder="Tu Nombre"
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
          {...register('name', {
            required: 'El nombre el obligatorio',
          })}
        />

        {errors.name &&
          <ErrorMessage>{errors.name.message}</ErrorMessage>
        }
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label
          htmlFor="password"
          className="text-sm font-medium text-white"
        >Contraseña:</label>

        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="********"
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
          {...register('password', {
            required: 'La contraseña es obligatorio',
          })}
        />
        {errors.password &&
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        }
      </div>

      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="text-sm text-white mt-3"
      >
        {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      </button>
    </>

  )
}
