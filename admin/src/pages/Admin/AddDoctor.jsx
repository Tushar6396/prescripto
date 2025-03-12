import React from 'react';
import { assets } from '../../assets/assets';

const AddDoctor = () => {
  return (
    <form className='w-full m-5'>
      <p className='mb-3 font-medium text-lg'>Add Doctor</p>
      <div className='bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor='doc-img'>
            <img
              className='bg-gray-100 w-16 rounded-full cursor-pointer'
              src={assets.upload_area}
              alt=''
            />
          </label>
          <input type='file' id='doc-img' hidden />
          <p>
            Upload doctor <br />
            picture
          </p>
        </div>
        <div className='flex flex-col lg:flex-row gap-8 items-start text-gray-700'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Name</p>
              <input
                className='rounded px-3 py-2 '
                type='text'
                placeholder='Name'
                required
              />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input
                className='rounded px-3 py-2'
                type='email'
                placeholder='Email'
                required
              />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input
                className='rounded px-3 py-2'
                type='password'
                placeholder='Password'
                required
              />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Experience</p>
              <select className='rounded px-3 py-2' name='' id=''>
                <option value='1 Year'>1 Year</option>
                <option value='2 Year'>2 Year</option>
                <option value='3 Year'>3 Year</option>
                <option value='4 Year'>4 Year</option>
                <option value='5 Year'>5 Year</option>
                <option value='6 Year'>6 Year</option>
                <option value='7 Year'>7 Year</option>
                <option value='8 Year'>8 Year</option>
                <option value='9 Year'>9 Year</option>
                <option value='10 Year'>10 Year</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Fees</p>
              <input
                className='rounded px-3 py-2'
                type='number'
                placeholder='Fees'
                required
              />
            </div>
          </div>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select className='rounded px-3 py-2' name='' id=''>
                <option value='General physician'>General physician</option>
                <option value='Gynecologist'>Gynecologist</option>
                <option value='Dermatologist'>Dermatologist</option>
                <option value='Pediatricians'>Pediatricians</option>
                <option value='Neurologist'>Neurologist</option>
                <option value='Gastroenterologist'>Gastroenterologist</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input
                className=' rounded px-3 py-2'
                type='text'
                placeholder='Education'
                required
              />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input
                className=' rounded px-3 py-2'
                type='text'
                placeholder='Address'
                required
              />
            </div>
          </div>
        </div>
        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea
            className='w-full px-4 pt-2 rounded'
            placeholder='write about doctor'
            rows={5}
            required
          />
        </div>
        <button className='bg-[#5F6FFF] text-white text-md px-10 py-2 rounded-full font-semibold cursor-pointer'>
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
