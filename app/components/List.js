'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import Link from 'next/link';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  useEffect(() => {
    fetchEmployees();
  }, [statusFilter]);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get(`/employees/status/${statusFilter.toUpperCase()}`);
      if (Array.isArray(response.data)) {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } else {
        throw new Error('Invalid data format: Expected an array');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (Array.isArray(employees)) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(lowercasedQuery) ||
        employee.mobile.toLowerCase().includes(lowercasedQuery) ||
        employee.email.toLowerCase().includes(lowercasedQuery) ||
        employee.department.toLowerCase().includes(lowercasedQuery) ||
        employee.designation.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredEmployees(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, employees]);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = Array.isArray(filteredEmployees) ? filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee) : [];

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/employees/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
      setFilteredEmployees(filteredEmployees.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value.toUpperCase())}
          className="ml-4 p-2 border border-gray-300 rounded"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {['Name', 'Mobile', 'Email', 'Department', 'Designation', 'Actions'].map(header => (
                <th key={header} className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-gray-600 uppercase font-bold text-sm">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map(employee => (
              <tr key={employee.id} className="hover:bg-gray-100">
                {['name', 'mobile', 'email', 'department', 'designation'].map(field => (
                  <td key={field} className="py-2 px-4 border-b border-gray-200">
                    {employee[field]}
                  </td>
                ))}
                <td className="py-2 px-4 border-b border-gray-200 flex justify-center space-x-2">
                  <Link href={`/employee/view/${employee.id}`} passHref>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded">
                      View
                    </button>
                  </Link>
                  <Link href={`/employee/update/${employee.id}`} passHref>
                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded">
                      Update
                    </button>
                  </Link>
                  <button onClick={() => handleDelete(employee.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
          className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700 font-bold py-2 px-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
          className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <Link href="/add-employee" passHref>
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Employee
        </button>
      </Link>
    </div>
  );
};

export default EmployeeList;
