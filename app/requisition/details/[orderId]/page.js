'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig';

const statusOptions = [
  'Initiated',
  'Order Placed',
  'Waiting for Delivery',
  'Ready for Delivery',
  'Delivered'
];

const RequisitionDetailsPage = () => {
  const { orderId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState('');
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/requisitions/details/${orderId}`);
        setEmployee(response.data);
        setStatus(response.data.status);
        console.log(response) // Set the initial status
      } catch (err) {
        setError(err.response?.data || "Error fetching employee details");
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [orderId]);

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);

    try {
      await axiosInstance.patch(`/requisitions/status/${orderId}`, null, {
        params: { status: newStatus }
      });
      setUpdateError(null);
    } catch (error) {
      setUpdateError(error.response?.data || "Error updating status");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>
      {employee && (
        <>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
          
          {/* Status Dropdown */}
          <div className="mt-4">
            <label className="block text-gray-700">Update Status</label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {statusOptions.map(statusOption => (
                <option key={statusOption} value={statusOption}>{statusOption}</option>
              ))}
            </select>
            {updateError && <div className="text-red-500 mt-2">{updateError}</div>}
          </div>

          <button
            onClick={handleShowDetails}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Show Requisition Details
          </button>
        </>
      )}

      {showDetails && employee && employee.requisitions && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Requisition Details</h2>
          {employee.requisitions.map((req, index) => (
            <div key={index} className="mb-4">
              <p><strong>Product:</strong> {req.product}</p>
              <p><strong>Quantity:</strong> {req.quantity}</p>
              <p><strong>Description:</strong> {req.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequisitionDetailsPage;
