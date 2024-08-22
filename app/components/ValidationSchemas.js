import * as yup from 'yup';

const departmentSchema = yup.object().shape({
  code: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
  isActive: yup.boolean()
});

const designationSchema = yup.object().shape({
  code: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
  isActive: yup.boolean()
});

const employeeSchema = yup.object().shape({
  id: yup.string().required('ID is required'),
  name: yup.string().required('Name is required'),
  mobile: yup.string().required('Mobile is required'),
  email: yup.string().required('Email is required').email('Invalid email'),
  department: yup.string().required('Department is required'),
  designation: yup.string().required('Designation is required'),
  dob: yup.string().required('Date of birth is required'),
  qualification: yup.string().required('Qualification is required'),
  address: yup.string().required('Address is required'),
  remark: yup.string().required('Remark is required'),
  status: yup.string().required('Status is required'),
});

export { departmentSchema, designationSchema,  employeeSchema };
