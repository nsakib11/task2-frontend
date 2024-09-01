"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";

const RequisitionDetailsPageOrder = () => {
  const { orderId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [requisitions, setRequisitions] = useState([]); // Changed to an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch both employee details and requisitions
        const [employeeResponse, requisitionsResponse] = await Promise.all([
          axiosInstance.get(`/requisitions/details/${orderId}`),
          axiosInstance.get(`/requisitions/order/${orderId}`),
        ]);

        setEmployee(employeeResponse.data);
        setRequisitions(requisitionsResponse.data); // Set array of requisitions
      } catch (err) {
        console.error("Error fetching data:", err); // Improved error logging
        setError(err.response?.data || "Error fetching details");
        setEmployee(null);
        setRequisitions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">
        Employee and Requisition Details
      </h1>
      {employee && (
        <>
          <p>
            <strong>Order ID:</strong>{" "}
            <span className="text-blue-500">{orderId}</span>
          </p>
          <p>
            <strong>Name:</strong> {employee.name || "N/A"}
          </p>
          <p>
            <strong>Department:</strong> {employee.department || "N/A"}
          </p>
          <p>
            <strong>Designation:</strong> {employee.designation || "N/A"}
          </p>
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Requisition Details</h2>
            {requisitions.length > 0 ? (
              requisitions.map((req, index) => (
                <div key={index} className="mb-4">
                  <p>
                    <strong>Product:</strong> {req.product || "N/A"}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {req.quantity || "N/A"}
                  </p>
                  <p>
                    <strong>Description:</strong> {req.description || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> {req.status || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p>No requisitions found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RequisitionDetailsPageOrder;
