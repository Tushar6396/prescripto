import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext.jsx';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setAdminToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem('adminToken', data.token);
          setAdminToken(data.token);
          toast.success(data.message);
        } else {
          console.log(data.message);
          toast.error(data.message);
        }
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col items-start justify-center m-auto gap-4 p-8 min-w-[340px] sm:min-w-96 bg-white shadow-xl text-[#5E5E5E] text-md rounded-xl '>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-[#5F6FFF]'>{state}</span> Login
        </p>
        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-[#b9b6b6] rounded w-full p-2 mt-1'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            required
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            className='border border-[#b9b6b6] rounded w-full p-2 mt-1'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            required
          />
        </div>
        <button className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer'>
          Login
        </button>
        {state === 'Admin' ? (
          <p>
            Doctor Login?{' '}
            <span
              className='text-[#5F6FFF] underline cursor-pointer'
              onClick={() => setState('Doctor')}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{' '}
            <span
              className='text-[#5F6FFF] underline cursor-pointer'
              onClick={() => setState('Admin')}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
