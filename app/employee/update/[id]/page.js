
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import Link from 'next/link';

const UpdateEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [dob, setDob] = useState('');
  const [qualification, setQualification] = useState('');
  const [address, setAddress] = useState('');
  const [remark, setRemark] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/employees/${id}`)
        .then(response => {
          const { name, mobile, email, department, designation, dob, qualification, address, remark, status } = response.data;
          setEmployee({ name, mobile, email, department, designation, dob, qualification, address, remark, status });
          setName(name);
          setMobile(mobile);
          setEmail(email);
          setDepartment(department);
          setDesignation(designation);
          setDob(dob);
          setQualification(qualification);
          setAddress(address);
          setRemark(remark);
          setStatus(status);
        })
        .catch(err => setError(err.message));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put(`/employees/${id}`, { name, mobile, email, department, designation, dob, qualification, address, remark, status });
      window.location.href = `/employee/view/${id}`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Update Employee</h1>
      <form onSubmit={handleSubmit}>
        {['name', 'mobile', 'email', 'department', 'designation', 'dob', 'qualification', 'address', 'remark', 'status'].map(field => (
          <div className="mb-4" key={field}>
            <label htmlFor={field} className="block text-gray-600 font-semibold mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              id={field}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={eval(field)}
              onChange={e => eval(`set${field.charAt(0).toUpperCase() + field.slice(1)}`)(e.target.value)}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
        <Link href={`/employee/view/${id}`} passHref>
          <button className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
        </Link>
      </form>
    </div>
  );
};

export default UpdateEmployee;
