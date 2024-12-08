import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  QueueListIcon,
  ChevronDoubleRightIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  ArrowLeftStartOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

/**
 * Menu Items.
 */
const menuItems = [
  {
    name: 'Home',
    icon: <HomeIcon className="w-7 h-7" />,
    path: '/dashboard',
    children: []
  },
  {
    name: 'Manage',
    icon: <Cog6ToothIcon className="w-7 h-7" />,
    path: '',
    children: [
      {
        name: 'Users',
        icon: <UserGroupIcon className="w-7 h-7" />,
        path: '/users',
      },
      {
        name: 'Config',
        icon: <WrenchScrewdriverIcon className="w-7 h-7" />,
        path: '/config',
      },
      {
        name: 'Activity',
        icon: <QueueListIcon className='w-7 h-7' />,
        path: '/activity-log',
        children: []
      }
    ]
  }
];

/**
 * Define the sidebar used for navigation.
 * @param {*} user The user that is currently authenticated 
 * @returns object
 */
const Sidebar = ({ user }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [openItem, setOpenItem] = useState(null);

  const toggleSubMenu = (index) => {
    setOpenItem(openItem === index ? null : index);  // Toggle the open/close of sub-items
  };
  
  // Toggle the collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  };

  // Navigate to the profile page when clicked.
  const goToPath = (path) => {
    window.location.href = path;
    setCollapsed(true)
  }

  const logout = () => {
    axios.post(route('logout'), {
      // You can send data here if needed (e.g., for logging purposes)
    })
    .then(function (response) {
      // Handle successful logout response
      window.location.href = '/login';   // Redirect to the homepage or login page
    })
    .catch(function (error) {
      // Handle any errors
      console.error('Logout failed', error);
    });
  }

  /**
   * Handles the user clicking on a menu item. If the item has children toggle the sub item visibility.
   * Otherwise navigate to the specified path.
   * 
   * @param {*} item 
   * @param {*} index 
   */
  const handleItemClick = (item, index) => {
    if (item && item.children && item.children.length > 0) {
      // Toggle the submenu visibility
      toggleSubMenu(index);
    } else {
      // Navigate to the item's path
      goToPath(item.path);
    }
  };

  useEffect(() => {
    // 
  }, []);

  return (
    <div className={`flex-col fixed h-full ${collapsed ? 'w-15' : 'w-[300px] z-20'} bg-gray-800 text-white transition-all duration-300`}>
      <div className="flex items-center justify-center w-full px-1 py-2 pr-2 mt-2 space-x-4 h-15 hover:bg-gray-700">
        { !collapsed && 
          <img
            src={user?.profile_image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp'} // Gravatar default image
            alt={user?.name}
            className="object-cover w-10 h-10 rounded-full"
            onClick={() => {goToPath('/profile')}}
          />
        }
        {!collapsed && <span className="w-full text-lg font-bold text-white">{user?.name}</span>}
        
        <button onClick={toggleSidebar} className="text-white focus:outline-none">{!collapsed && <XMarkIcon className="w-7 h-7"/> || <ChevronDoubleRightIcon className="pl-1 w-7 h-7"/>}</button>
      </div>
      <nav className="mt-6">
        <ul>
          {/* Handle menu items */}
          {menuItems.map((item, index) => (
            <li key={index}>
              <div
                className="flex items-center px-2 py-2 space-x-4 hover:bg-gray-700"
                onClick={() => {handleItemClick(item, index)}}
              >
                <span className="w-7 h-7">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </div>

              {/* Handle sub-menu items (children) */}
              {item.children.length > 0 && openItem === index && (
                <ul className={`ml-6 ${collapsed ? 'hidden' : ''}`}>
                  {item.children.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <div onClick={() => {handleItemClick(subItem, subIndex)}} className="flex items-center px-4 py-2 space-x-4 hover:bg-gray-600">
                        <span className="w-7 h-7">{subItem.icon}</span>
                        {!collapsed && <span>{subItem.name}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
            <li key='logout_link'>
              <div
                className="flex items-center px-2 py-2 mt-4 space-x-4 hover:bg-gray-700"
                onClick={() => {logout()}}
              >
                <span className="w-7 h-7"><ArrowLeftStartOnRectangleIcon className="w-7 h-7" /></span>
                {!collapsed && <span>Logout</span>}
              </div>
            </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
