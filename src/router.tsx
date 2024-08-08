import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import LoginView from './views/auth/LoginView';
import AppLayout from './layouts/AppLayout';
import HomeView from './views/app/home/HomeView';
import CustomersView from './views/app/customers/CustomersView';
import ProductsView from './views/app/products/ProductsView';
import ReportsView from './views/app/reports/ReportsView';
import SuppliersView from './views/app/suppliers/SuppliersView';
import ConfigProfileView from './views/app/config/ConfigProfileView';
import CategoriesView from './views/app/categories/CategoriesView';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/auth/login',
        element: <LoginView />
      }
    ]
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: '/home',
        element: <HomeView />
      },
      {
        path: '/customers',
        element: <CustomersView />,
      },
      {
        path: '/products',
        element: <ProductsView />
      },
      {
        path: '/categories',
        element: <CategoriesView />
      },
      {
        path: '/reports',
        element: <ReportsView />
      },
      {
        path: '/suppliers',
        element: <SuppliersView />
      },
      {
        path: '/config',
        element: <ConfigProfileView />
      }
    ]
  }
]);


