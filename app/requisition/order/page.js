'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { useRouter } from 'next/navigation';

const RequisitionTablePage = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Define backend status values and their human-readable equivalents
  const statusMap = {
    'INITIATED': 'Initiated',
    'ORDER_PLACED': 'Order Placed',
    'WAITING_FOR_DELIVERY': 'Waiting for Delivery',
    'READY_FOR_DELIVERY': 'Ready for Delivery',
    'DELIVERED': 'Delivered'
  };

  const statusOptions = Object.values(statusMap);

  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const response = await axiosInstance.get('/requisitions');
        const requisitionData = await Promise.all(
          response.data.map(async (req) => {
            const employeeDetails = await axiosInstance.get(`/requisitions/details/${req.orderId}`);
            return {
              ...req,
              name: employeeDetails.data.name,
              designation: employeeDetails.data.designation,
              department: employeeDetails.data.department,
              // Map the backend status to the display status
              status: statusMap[req.status] || 'Initiated'
            };
          })
        );
        setRequisitions(requisitionData);
      } catch (err) {
        setError(err.response?.data || 'Error fetching requisitions');
      } finally {
        setLoading(false);
      }
    };

    fetchRequisitions();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Convert display status back to backend status
      const backendStatus = Object.keys(statusMap).find(key => statusMap[key] === newStatus);
      await axiosInstance.patch(`/requisitions/status/${orderId}`, null, {
        params: { status: backendStatus }
      });
      setRequisitions(prevState =>
        prevState.map(req =>
          req.orderId === orderId ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Requisitions</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Order ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Designation</th>
            <th className="border border-gray-300 p-2">Department</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {requisitions.map((requisition, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{requisition.orderId}</td>
              <td className="border border-gray-300 p-2">{requisition.name}</td>
              <td className="border border-gray-300 p-2">{requisition.designation}</td>
              <td className="border border-gray-300 p-2">{requisition.department}</td>
              <td className="border border-gray-300 p-2">
                <select
                  value={requisition.status}
                  onChange={(e) => handleStatusChange(requisition.orderId, e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                >
                  {statusOptions.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => router.push(`/requisition/order/${requisition.orderId}`)}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Details
                </button>
                
                
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequisitionTablePage;
