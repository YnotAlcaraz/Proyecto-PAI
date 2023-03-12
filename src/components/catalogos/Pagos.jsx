import useTable from "../customHook/useTable";
export const Pagos = () => {
  return (
    <div>
      <h2>Lista de Pagos</h2>
      {useTable("http://localhost:3000/pagos")}
    </div>
  );
};
