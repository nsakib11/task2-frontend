// pages/index.js

import SimpleTable from './components/DepartmentTable';
import SimpleTable2 from './components/DesignationTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8" >
      

      <h1 className="text-2xl font-bold mb-4 text-gray-800">Department Table Example</h1>
      <SimpleTable />
      <div className="mt-3">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Designation Table Example</h1>
      <SimpleTable2 />
      </div>
    </div>
  );
}
