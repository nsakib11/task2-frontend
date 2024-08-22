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

const RequisitionDetailsPageOrder = () => {
  const { orderId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState('');
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [employeeResponse, requisitionResponse] = await Promise.all([
          axiosInstance.get(`requisitions/details/${orderId}`),
          axiosInstance.get(`/requisitions/order/${orderId}`)
        ]);

        setEmployee(employeeResponse.data);
        setRequisition(requisitionResponse.data);
        setStatus(requisitionResponse.data.status); // Set the initial status
      } catch (err) {
        setError(err.response?.data || "Error fetching details");
        setEmployee(null);
        setRequisition(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <h1 className="text-2xl font-bold mb-4">Employee and Requisition Details</h1>
      {employee && requisition && (
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

      {showDetails && requisition && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Requisition Details</h2>
          <div className="mb-4">
            <p><strong>Product:</strong> {requisition.product}</p>
            <p><strong>Quantity:</strong> {requisition.quantity}</p>
            <p><strong>Description:</strong> {requisition.description}</p>
            <p><strong>Status:</strong> {requisition.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequisitionDetailsPageOrder;
