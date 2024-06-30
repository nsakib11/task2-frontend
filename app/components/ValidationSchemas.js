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

export { departmentSchema, designationSchema };
