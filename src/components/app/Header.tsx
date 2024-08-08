import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('AUTH_TOKEN');
    navigate('/auth/login');
  }

  return (
    <header className="fixed bg-gray-800 z-30 w-full border-b shadow-md">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <Link to={'/home'} className="text-center py-1 px-1 font-black text-white text-xl cursor-pointer">Auto Partes Llanos</Link>

          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
          >Cerrar Sesión</button>
        </div>
      </div>
    </header>
  )
}
