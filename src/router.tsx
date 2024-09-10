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
import InventoryManagementView from './views/app/management/InventoryManagementView';
import SalesView from './views/app/sales/SalesView';
import PurchaseHistoryView from './views/app/purchaseHistory/PurchaseHistoryView';
import SalesHistoryView from './views/app/salesHistory/SalesHistoryView';

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
        path: '/suppliers',
        element: <SuppliersView />
      },
      {
        path: '/inventory',
        element: <InventoryManagementView />
      },
      {
        path: '/purchase-history',
        element: <PurchaseHistoryView />
      },
      {
        path: '/sales',
        element: <SalesView />
      },
      {
        path: '/sales-history',
        element: <SalesHistoryView /> 
      },
      {
        path: '/reports',
        element: <ReportsView />
      },
      {
        path: '/config',
        element: <ConfigProfileView />
      }
    ]
  }
]);


