import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm } from "antd";

function ApiTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://inventario-prueb-default-rtdb.firebaseio.com/products.json")
      .then((response) => response.json())
      .then((data) => {
        // Convierte los datos del objeto en un array de objetos
        const dataArray = Object.keys(data).map((key) => {
          return { key, ...data[key] };
        });
        setData(dataArray);
      });
  }, []);

  const handleEdit = (key) => {
    // Lógica para editar el registro
  };

  const handleDelete = (key) => {
    // Lógica para eliminar el registro
  };

  const columns =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          title: key,
          dataIndex: key,
          key,
          render: (text) => {
            if (
              typeof text === "string" &&
              text.match(/^(https?:\/\/|data:image\/[a-z]+;base64,)/)
            ) {
              return <img src={text} width="100px" alt="imagen" />;
            } else {
              return text;
            }
          },
        }))
      : [];

  columns.push({
    title: "Acciones",
    dataIndex: "key",
    key: "acciones",
    render: (key, record) => (
      <>
        <Button
          type="primary"
          style={{ marginRight: 16 }}
          onClick={() => handleEdit(key)}
        >
          Editar
        </Button>
        <Popconfirm
          title="¿Estás seguro de que quieres eliminar este producto?"
          onConfirm={() => handleDelete(key)}
          okText="Sí"
          cancelText="No"
        >
          <Button type="danger" style={{ marginRight: 16 }}>
            Eliminar
          </Button>
        </Popconfirm>
      </>
    ),
  });

  return (
    <>
      <Table dataSource={data} columns={columns} />
    </>
  );
}

export default ApiTable;
