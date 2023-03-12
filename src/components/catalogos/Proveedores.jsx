import useTable from "../customHook/useTable";
export const Proveedores = () => {
  return (
    <div>
      Proveedores
      {useTable("http://localhost:3000/proveedores")}
    </div>
  );
};
