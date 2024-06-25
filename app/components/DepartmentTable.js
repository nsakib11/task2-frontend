'use client'
// components/SimpleTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SimpleTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch data from the backend using Axios
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/departments');
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (code) => {
    try {
      await axios.delete(`http://localhost:8080/departments/${code}`);
      setData(data.filter((dept) => dept.code !== code));
    } catch (err) {
      setError(err);
      console.error('Error deleting department:', err);
    }
  };

  if (error) {
    return <div className="text-red-500">Error fetching data: {error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Departments</h1>
        <button
          onClick={() => router.push('/add-department')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Department
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-gray-600 uppercase font-bold text-sm">
                Code
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-gray-600 uppercase font-bold text-sm">
                Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-gray-600 uppercase font-bold text-sm">
                Active
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-gray-600 uppercase font-bold text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-200">{row.code}</td>
                <td className="py-2 px-4 border-b border-gray-200">{row.name}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {row.isActive ? (
                    <span className="text-green-500 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-500 font-semibold">No</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    onClick={() => router.push(`department/view/${row.code}`)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => router.push(`department/update/${row.code}`)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(row.code)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimpleTable;
