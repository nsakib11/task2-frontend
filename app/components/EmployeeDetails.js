// pages/requisition.js
'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

const RequisitionPage = () => {
  const [id, setId] = useState('');
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id.trim() === '') {
      setEmployee(null);
      setError(null);
      return;
    }

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/employees/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError(err.response?.data || "Error fetching employee details");
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Requisition</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Employee ID</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter Employee ID"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <div className="text-red-500">{error}</div>}
      
      {employee && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Employee Details</h2>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
        </div>
      )}
    </div>
  );
};

export default RequisitionPage;
