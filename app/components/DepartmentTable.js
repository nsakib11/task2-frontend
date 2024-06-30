"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../app/utils/axiosConfig";
import { useRouter } from "next/navigation";

const DepartmentTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/departments");
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (code) => {
    try {
      await axiosInstance.delete(`/departments/${code}`);
      setData(data.filter((dept) => dept.code !== code));
    } catch (err) {
      setError(err);
      console.error("Error deleting department:", err);
    }
  };

  if (error) {
    return (
      <div className="text-red-500">Error fetching data: {error.message}</div>
    );
  }

  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Departments</h1>
        <button
          onClick={() => router.push("/add-department")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Department
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-gray-600 uppercase font-bold text-sm">
                Code
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-gray-600 uppercase font-bold text-sm">
                Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-gray-600 uppercase font-bold text-sm">
                Active
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-gray-600 uppercase font-bold text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-200">
                  {row.code}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {row.name}
                </td>
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

        <div className="mt-4 flex justify-end">
          {Array.from({ length: Math.ceil(data.length / perPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentTable;
