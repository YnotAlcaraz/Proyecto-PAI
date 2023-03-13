import React, { useState, useEffect } from "react";
import { Table } from "antd";
import axios from "axios";

export const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/pedidos")
      .then((response) => setPedidos(response.data))
      .catch((error) => console.error(error));
  }, []);

  const columns = [
    {
      title: "Estatus",
      dataIndex: "estatus",
      key: "estatus",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "ID Proveedor",
      dataIndex: "idProveedor",
      key: "idProveedor",
    },
    {
      title: "ID Producto",
      dataIndex: "productos",
      key: "idProducto",
      render: (productos) =>
        productos.map((producto) => (
          <div key={producto.idProducto}>{producto.nombre}</div>
        )),
    },
    {
      title: "Cantidad",
      dataIndex: "productos",
      key: "cantidad",
      render: (productos) =>
        productos.map((producto) => (
          <div key={producto.idProducto}>{producto.cantidad}</div>
        )),
    },
  ];

  return <Table dataSource={pedidos} columns={columns} />;
};
