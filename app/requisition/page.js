'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useRouter } from 'next/navigation';

const RequisitionPage = () => {
  const [id, setId] = useState('');
  const [employee, setEmployee] = useState(null);
  const [requisitions, setRequisitions] = useState([{ product: '', quantity: '', description: '' }]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axiosInstance.get('/products')
      .then(response => setProducts(response.data))
      .catch(err => setApiError(err.message));
  }, []);

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

  const handleAddRequisition = () => {
    setRequisitions([...requisitions, { product: '', quantity: '', description: '' }]);
  };

  const handleRequisitionChange = (index, field, value) => {
    const updatedRequisitions = requisitions.map((req, i) => i === index ? { ...req, [field]: value } : req);
    setRequisitions(updatedRequisitions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!employee) {
      setApiError("Please enter a valid employee ID.");
      return;
    }

    try {
      setApiError(null);
      const response = await axiosInstance.post(`/requisitions/${employee.id}`, requisitions);
      const orderId = response.data[0].orderId; // Assuming all requisitions share the same orderId
      router.push(`/requisition/order`);
    } catch (error) {
      setApiError(error.response?.data || "Error submitting requisitions");
    }
  };

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

      {/* Requisition Form */}
      <form onSubmit={handleSubmit}>
        {requisitions.map((req, index) => (
          <div key={index} className="flex items-center mb-4 space-x-4">
            <input
              list={`products-${index}`}
              value={req.product}
              onChange={(e) => handleRequisitionChange(index, 'product', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="Type or select a product"
            />
            <datalist id={`products-${index}`}>
              {products.map(product => (
                <option key={product.id} value={product.name}>{product.name}</option>
              ))}
            </datalist>
            <input
              type="number"
              value={req.quantity}
              onChange={(e) => handleRequisitionChange(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={req.description}
              onChange={(e) => handleRequisitionChange(index, 'description', e.target.value)}
              placeholder="Description"
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            {index === requisitions.length - 1 && (
              <button
                type="button"
                onClick={handleAddRequisition}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </button>
            )}
          </div>
        ))}
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RequisitionPage;
