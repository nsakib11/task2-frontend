// pages/view-employee/[id].js
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import Link from 'next/link';

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/employees/${id}`)
        .then(response => setEmployee(response.data))
        .catch(err => setError(err.message));
    }
  }, [id]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>
      {['id', 'name', 'mobile', 'email', 'department', 'designation', 'dob', 'qualification', 'address', 'remark', 'status'].map(field => (
        <p key={field} className="mb-4">
          <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {employee[field]}
        </p>
  ))}
  <Link href="/" passHref>
    <button className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
      Back to List
    </button>
  </Link>
</div>
);
};
export default ViewEmployee