// pages/update/[code].js
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const UpdateDepartment = () => {
  const { code } = useParams(); // Extracting the dynamic 'code' from the URL
  const [department, setDepartment] = useState(null);
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (code) {
      // Fetch department details using the code from the URL
      axios
        .get(`http://localhost:8080/departments/${code}`)
        .then((response) => {
          const { code, name, isActive } = response.data;
          setDepartment({ code, name, isActive });
          setName(name);
          setIsActive(isActive);
        })
        .catch((err) => {
          setError(err.message);
          console.error('Error fetching department:', err);
        });
    }
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/departments/${code}`, { name, isActive });
      // Redirect to view page after update
      window.location.href = `/department/view/${code}`;
    } catch (err) {
      setError(err.message);
      console.error('Error updating department:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleActiveChange = (e) => {
    setIsActive(e.target.checked);
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!department) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Update Department</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isActive" className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              className="form-checkbox h-4 w-4 text-blue-500"
              checked={isActive}
              onChange={handleActiveChange}
            />
            <span className="ml-2 text-gray-600 font-semibold">Active</span>
          </label>
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <Link href={`/department/view/${code}`} passHref>
            <button
              className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UpdateDepartment;
