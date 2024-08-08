
export default function Copyright() {
  return (
    <p className="text-center text-sm text-gray-500 my-10">
      &copy; {new Date().getFullYear()}{" - " }
      <a href="#" className="hover:underline" target="_blank">
        Auto Partes - Llanos
      </a>
      . Todos los derechos reservados
    </p>
  )
}
