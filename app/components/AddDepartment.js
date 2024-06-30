"use client";
import { useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useRouter } from "next/navigation";
import { departmentSchema } from "../components/ValidationSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddDepartment = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(departmentSchema),
  });

  const [apiError, setApiError] = useState(null);
  const [apiFieldErrors, setApiFieldErrors] = useState({});
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      setApiFieldErrors({});

      await axiosInstance.post("/departments", data);

      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;

        // Checking if the error is related to a specific field
        if (responseData.includes("already exists")) {
          // Parse the error message for specific field errors
          if (responseData.includes("code")) {
            setApiFieldErrors((prev) => ({
              ...prev,
              code: "Department with this code already exists",
            }));
          }
          if (responseData.includes("name")) {
            setApiFieldErrors((prev) => ({
              ...prev,
              name: "Department with this name already exists",
            }));
          }
        } else {
          setApiError(responseData);
        }
      } else {
        setApiError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-300 rounded">
      <h1 className="text-2xl font-bold mb-4">Add Department</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
        <div className="mb-4">
          <label className="block text-gray-700">Code</label>
          <input
            type="text"
            {...register("code")}
            className={`w-full p-2 border border-gray-300 rounded ${
              errors.code ? "border-red-500" : ""
            } ${apiFieldErrors.code ? "border-red-500" : ""}`}
          />
          {errors.code && (
            <p className="text-red-500 mt-1">{errors.code.message}</p>
          )}
          {apiFieldErrors.code && (
            <p className="text-red-500 mt-1">{apiFieldErrors.code}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            {...register("name")}
            className={`w-full p-2 border border-gray-300 rounded ${
              errors.name ? "border-red-500" : ""
            } ${apiFieldErrors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p className="text-red-500 mt-1">{errors.name.message}</p>
          )}
          {apiFieldErrors.name && (
            <p className="text-red-500 mt-1">{apiFieldErrors.name}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            {...register("isActive")}
            className="mr-2 leading-tight"
          />
          <span className="text-gray-700">Is Active</span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
