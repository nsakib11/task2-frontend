"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import Link from "next/link";

const UpdateDesignation = () => {
  const { code } = useParams();
  const [designation, setDesignation] = useState(null);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (code) {
      axiosInstance
        .get(`/designation/${code}`)
        .then((response) => {
          const { code, name, isActive } = response.data;
          setDesignation({ code, name, isActive });
          setName(name);
          setIsActive(isActive);
        })
        .catch((err) => {
          setError(err.message);
          console.error("Error fetching designation:", err);
        });
    }
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put(`/designation/${code}`, { name, isActive });
      // Redirect to view page after update
      window.location.href = `/designation/view/${code}`;
    } catch (err) {
      setError(err.message);
      console.error("Error updating designation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleActiveChange = (e) => {
    setIsActive(e.target.checked);
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!designation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Update Designation</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-600 font-semibold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isActive" className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              className="form-checkbox h-4 w-4 text-blue-500"
              checked={isActive}
              onChange={handleActiveChange}
            />
            <span className="ml-2 text-gray-600 font-semibold">Active</span>
          </label>
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <Link href={`/designation/view/${code}`} passHref>
            <button className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UpdateDesignation;
