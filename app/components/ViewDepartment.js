
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '../../app/utils/axiosConfig';
import Link from 'next/link';

const ViewDepartment = () => {
  const { code } = useParams(); // Extracting the dynamic 'code' from the URL
  const [department, setDepartment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (code) {
      
      axiosInstance
        .get(`/departments/${code}`)
        .then((response) => setDepartment(response.data))
        .catch((err) => {
          setError(err.message);
          console.error('Error fetching department:', err);
        });
    }
  }, [code]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!department) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Department Details</h1>
      <p className="mb-4">
        <strong>Code:</strong> {department.code}
      </p>
      <p className="mb-4">
        <strong>Name:</strong> {department.name}
      </p>
      <p className="mb-4">
        <strong>Active:</strong> {department.isActive ? 'Yes' : 'No'}
      </p>
      <Link href="/" passHref>
        <button className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back to List
        </button>
      </Link>
    </div>
  );
};

export default ViewDepartment;
