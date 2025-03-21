import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';

const DoctorProfle = () => {
  const { doctorToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);

  const { currency } = useContext(AppContext);

  useEffect(() => {
    if (doctorToken) {
      getProfileData();
    }
  }, [doctorToken]);
  return (
    profileData && (
      <div>
        <div className='flex flex-col gap-4 m-5'>
          <div>
            <img
              className='bg-[#5F6FFF] w-full sm:max-w-64 rounded-lg'
              src={profileData.image}
              alt=''
            />
          </div>

          <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
            {/* Doctor's Info */}
            <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
              {profileData.name}
            </p>

            <div className='flex items-center gap-2 mt-1 text-gray-600'>
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className='py-0.5 px-2 border border-stone-300 text-xs rounded-full cursor-pointer'>
                {profileData.experience}
              </button>
            </div>

            {/* Doctor About section */}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>
                About:
              </p>
              <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                {profileData.about}
              </p>
            </div>

            <p className='text-gray-600 font-medium mt-4'>
              Appointment fees :{' '}
              <span className='text-gray-800'>
                {currency} {profileData.fees}
              </span>
            </p>

            <div className='flex gap-2 py-2 items-center font-medium'>
              <p>Address : </p>
              <p className='text-sm'>{profileData.address}</p>
            </div>

            <div className='flex gap-2 pt-2'>
              <input checked={profileData.available} type='checkbox' />
              <label htmlFor=''>Available</label>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfle;
