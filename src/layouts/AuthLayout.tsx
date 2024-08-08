import { Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import { ToastContainer } from 'react-toastify';

export default function AuthLayout() {
  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        <div className="py-10 lg:py-20 mx-auto w-[500px]">
          <Logo />

          <div className="mt-10">
            <Outlet />
          </div>
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
