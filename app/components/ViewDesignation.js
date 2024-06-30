
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import Link from 'next/link';

const ViewDesignation = () => {
  const { code } = useParams(); // Extracting the dynamic 'code' from the URL
  const [designation, setDesignation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (code) {
      
      axiosInstance
      .get(`/designation/${code}`)
      .then((response) => setDesignation(response.data))
      .catch((err) => {
        setError(err.message);
        console.error('Error fetching designation:', err);
        });
    }
  }, [code]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!designation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Designation Details</h1>
      <p className="mb-4">
        <strong>Code:</strong> {designation.code}
      </p>
      <p className="mb-4">
        <strong>Name:</strong> {designation.name}
      </p>
      <p className="mb-4">
        <strong>Active:</strong> {designation.isActive ? 'Yes' : 'No'}
      </p>
      <Link href="/" passHref>
        <button className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back to List
        </button>
      </Link>
    </div>
  );
};

export default ViewDesignation;
