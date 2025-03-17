import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const { token, setToken, backendUrl } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          phone,
          address,
          gender,
          dob,
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success(data.message);
          setState('Login');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success(data.message);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p>
          Please {state === 'Sign Up' ? 'sign up' : 'login'} to book an
          appointment
        </p>
        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type='text'
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type='email'
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type='password'
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
        </div>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Phone Number</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type='text'
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              value={phone}
            />
          </div>
        )}

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Address</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type='text'
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              value={address}
            />
          </div>
        )}

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Gender</p>
            <select
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              onChange={(e) => setGender(e.target.value)}
              value={gender}
            >
              <option value=''>Select Gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          </div>
        )}

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Date of Birth</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type='date'
              onChange={(e) => setDob(e.target.value)}
              value={dob}
            />
          </div>
        )}

        <button
          type='submit'
          className='bg-primary text-white w-full py-2 rounded-md text-base'
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className='text-primary underline cursor-pointer'
            >
              Login Here
            </span>
          </p>
        ) : (
          <p>
            Create a new Account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className='text-primary underline cursor-pointer'
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
