import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./Sidebar";


export const App = () => {
  return (
    <>
      <Sidebar />
      <Routes>
        {/* <Route path="productos" element={<CatalogoProductos />} />
        <Route path="proveedores" element={<CatalogoProveedores />} />
        <Route path="pagos" element={<CatalogoPagos />} />
        <Route path="empleados" element={<CatalogoEmpleados />} />
        <Route path="/" element={<Navigate to="productos" />} /> */}
      </Routes>
    </>
  );
};
