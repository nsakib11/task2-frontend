import DepartmentTable from "./components/DepartmentTable";
import DesignationTable from "./components/DesignationTable";

export default function Home() {
  return (
    <div className=" bg-gray-100 p-8  text-center">
      <h1 className="text-2xl  font-bold mb-4 text-gray-800">
        Department Table Example
      </h1>
      <DepartmentTable />
      <div className="mt-3">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Designation Table Example
        </h1>
        <DesignationTable />
      </div>
    </div>
  );
}
