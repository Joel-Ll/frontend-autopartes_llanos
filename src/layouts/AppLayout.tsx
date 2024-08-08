import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/app/Header";
import Copyright from "../components/app/Copyright";
import Sidebar from "../components/app/Sidebar";
import { ToastContainer } from "react-toastify";


export default function AppLayout() {
  const { data, isError, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) navigate('/auth/login');
  }, [isError]);

  if (isLoading) return <div>Cargando...</div>

  if (data) return (
    <>
      <Header />
      <div className="flex pt-20">
        <Sidebar data={data} />

        <div className="h-full w-full bg-gray-50 relative overflow-y-auto ml-64">
          <main>
            <div className="pt-6 px-10">
              <div className="w-full min-h-[calc(100vh-230px)]">
                <Outlet />
              </div>
            </div>
          </main>

          <Copyright />
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  )
}
