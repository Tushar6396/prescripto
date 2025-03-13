import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext.jsx';

const DoctorsList = () => {
  const { doctors, adminToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);
  useEffect(() => {
    if (adminToken) {
      getAllDoctors();
    }
  }, [adminToken]);
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-xl font-semibold'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 mt-6 gap-y-6'>
        {doctors.map((item, index) => (
          <div
            className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group'
            key={index}
          >
            <img
              className='bg-indigo-50 hover:bg-[#5F6FFF] transition-all duration-500'
              src={item.image}
              alt=''
            />
            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium'>
                {item.name}
              </p>
              <p className='text-zinc-600 text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input
                  onChange={() => changeAvailability(item._id)}
                  type='checkbox'
                  checked={item.available}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
