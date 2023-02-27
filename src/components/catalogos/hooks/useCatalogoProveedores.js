import { useEffect, useState } from "react";

export const useCatalogoProveedores = () => {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {}, []);

  const columnsProveedores = [
    {
      title: "Nombre",
    },
    {
      title: "Correo Electrónico",
    },
    {
      title: "Número de Teléfono",
    },
    {
      title: "Dirección",
    },
    {
      title: "Compañía",
    },
  ];

  return {
    proveedores,
    columnsProveedores,
  };
};
