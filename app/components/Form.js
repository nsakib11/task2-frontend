
'use client';


import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from '../utils/axiosConfig';
import { employeeSchema } from '../components/ValidationSchemas';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

const AddEmployee = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(employeeSchema),
  });
  const [apiError, setApiError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch departments
    axiosInstance.get('/departments')
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });

    // Fetch designations
    axiosInstance.get('/designation')
      .then(response => {
        setDesignations(response.data);
      })
      .catch(error => {
        console.error('Error fetching designations:', error);
      });

    // Fetch qualifications
    axiosInstance.get('/qualification')
      .then(response => {
        setQualifications(response.data);
      })
      .catch(error => {
        console.error('Error fetching qualifications:', error);
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      await axiosInstance.post('/employees', data);
      router.push('/');
    } catch (error) {
      setApiError(error.response.data);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Add Employee</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
        {['id', 'name', 'mobile', 'email', 'dob', 'address', 'remark'].map(field => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              {...register(field)}
              className={`w-full p-2 border border-gray-300 rounded ${errors[field] ? 'border-red-500' : ''}`}
            />
            {errors[field] && <p className="text-red-500 mt-1">{errors[field]?.message}</p>}
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-gray-700">Department</label>
          <select
            {...register('department')}
            className={`w-full p-2 border border-gray-300 rounded ${errors['department'] ? 'border-red-500' : ''}`}
          >
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
          {errors['department'] && <p className="text-red-500 mt-1">{errors['department']?.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Designation</label>
          <select
            {...register('designation')}
            className={`w-full p-2 border border-gray-300 rounded ${errors['designation'] ? 'border-red-500' : ''}`}
          >
            <option value="">Select Designation</option>
            {designations.map(designation => (
              <option key={designation.id} value={designation.id}>{designation.name}</option>
            ))}
          </select>
          {errors['designation'] && <p className="text-red-500 mt-1">{errors['designation']?.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Qualification</label>
          <select
            {...register('qualification')}
            className={`w-full p-2 border border-gray-300 rounded ${errors['qualification'] ? 'border-red-500' : ''}`}
          >
            <option value="">Select Qualification</option>
            {qualifications.map(qualification => (
              <option key={qualification.id} value={qualification.id}>{qualification.degree}</option>
            ))}
          </select>
          {errors['qualification'] && <p className="text-red-500 mt-1">{errors['qualification']?.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            {...register('status')}
            className={`w-full p-2 border border-gray-300 rounded ${errors['status'] ? 'border-red-500' : ''}`}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DELETE">Deleted</option>
          </select>
          {errors['status'] && <p className="text-red-500 mt-1">{errors['status']?.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;