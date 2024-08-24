'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosConfig';


const AllRequisitionPage = () => {
  const [id, setId] = useState('');
  const [employee, setEmployee] = useState(null);
  const [requisitions, setRequisitions] = useState([]);

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);


  useEffect(() => {
    axiosInstance.get('/products')
      .then(response => setProducts(response.data))
      .catch(err => setApiError(err.message));
  }, []);

  useEffect(() => {
    if (id.trim() === '') {
      setEmployee(null);
      setError(null);
      setRequisitions([]);
      return;
    }

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/employees/${id}`);
        setEmployee(response.data);
        // Fetch existing requisitions for the employee
        const requisitionsResponse = await axiosInstance.get(`/requisitions/employee/${id}`);
        setRequisitions(requisitionsResponse.data);
      } catch (err) {
        setError(err.response?.data || "Error fetching employee details");
        setEmployee(null);
        setRequisitions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  
  

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Requisition</h1>
      
      {/* Employee ID Input */}
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

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <div className="text-red-500">{error}</div>}
      {apiError && <div className="text-red-500">{apiError}</div>}

      {/* Display Employee Details */}
      {employee && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Employee Details</h2>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
        </div>
      )}



      {/* Requisition List */}
      {requisitions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Requisition List</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.map(req => (
                <tr key={req.id}>
                  <td className="border p-2">{req.orderId}</td>
                  <td className="border p-2">{req.product}</td>
                  <td className="border p-2">{req.quantity}</td>
                  <td className="border p-2">{req.description}</td>
                  <td className="border p-2">{req.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllRequisitionPage;
