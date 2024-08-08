import { FaHome, FaUsers, FaBoxOpen, FaChartLine, FaTruck, FaCog, FaThLarge, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import UserProfile from './UserProfile';
import Collapse from '@mui/material/Collapse';
import React, { useState } from 'react';

type AsideProps = {
  data: string;
};

const links = [
  { id: 1, value: 'inicio', href: '/home', icon: FaHome },
  { id: 2, value: 'clientes', href: '/customers', icon: FaUsers },
  {
    id: 3, value: 'gestion de productos', icon: FaBoxOpen,
    children: [
      { id: 3.1, value: 'categorias', href: '/categories', icon: FaThLarge },
      { id: 3.2, value: 'productos', href: '/products', icon: FaBoxOpen },
      { id: 3.3, value: 'proveedores', href: '/suppliers', icon: FaTruck },
    ]
  },
  { id: 4, value: 'reportes', href: '/reports', icon: FaChartLine },
  { id: 6, value: 'configuración', href: '/config', icon: FaCog },
];


export default function Sidebar({ data }: AsideProps) {
  const [selectedLink, setSelectedLink] = useState<string | null>(null);

  const toggleSubmenu = (linkValue: string) => {
    setSelectedLink(prevSelectedLink => (prevSelectedLink === linkValue ? null : linkValue));
  };

  return (
    <aside id="sidebar" className="fixed z-20 h-full top-0 left-0 pt-0 flex w-64" aria-label="Sidebar">
      <div className="relative flex flex-1 flex-col min-h-0 bg-gray-800 pt-10 gap-5">
        <UserProfile name={data} />
        <div className="flex-1 px-3 bg-gray-800 divide-y space-y-1">
          <ul className="space-y-0.5">
            {links.map(link => (
              <React.Fragment key={link.id}>
                {link.children ? (
                  <div
                    className={`text-white text-base capitalize font-normal p-2 block transition-colors cursor-pointer 
                  ${selectedLink === link.value ? 'bg-gray-700 rounded-md' : 'hover:bg-gray-700 hover:rounded-md'}`}
                    onClick={() => toggleSubmenu(link.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className='flex items-center'>
                        <link.icon className="mr-2" />
                        {link.value}
                      </div>
                      { selectedLink ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    className={({ isActive }) =>
                      `text-white text-base capitalize font-normal p-2 block transition-colors 
                    ${isActive ? 'bg-gray-700 rounded-md' : 'hover:bg-gray-700 hover:rounded-md'}`
                    }
                    to={link.href ?? '#'}
                  >
                    <div className="flex items-center">
                      <link.icon className="mr-2" />
                      {link.value}
                    </div>
                  </NavLink>
                )}
                {link.children && (
                  <Collapse in={selectedLink === link.value} timeout="auto" unmountOnExit>
                    <div className="ml-4">
                      {link.children.map(child => (
                        <NavLink
                          key={child.id}
                          className={({ isActive }) =>
                            `text-white text-base capitalize font-normal p-2 block transition-colors mt-0.5
                          ${isActive ? 'bg-gray-700 rounded-md' : 'hover:bg-gray-700 hover:rounded-md'}`
                          }
                          to={child.href ?? '#'}
                        >
                          <div className="flex items-center">
                            <child.icon className="mr-2" />
                            {child.value}
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

