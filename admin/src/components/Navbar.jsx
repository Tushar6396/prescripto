import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { adminToken, setAdminToken } = useContext(AdminContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    adminToken && setAdminToken('');
    adminToken && localStorage.removeItem('adminToken');
  };

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 bg-white py-3 border-b '>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {adminToken ? 'Admin' : 'Doctor'}
        </p>
      </div>
      <button
        onClick={logout}
        className='bg-[#5F6FFF] text-white text-md px-10 py-2 rounded-full font-semibold cursor-pointer'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
