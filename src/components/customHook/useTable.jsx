import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import axios from "axios";

const useTable = (url) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        const columns = Object.keys(data[0]).map((key) => ({
          title: key === "id" ? "Id" : key,
          dataIndex: key,
          key: key,
        }));

        // Añadir 'Acciones' columna con 'Editar' y 'Borrar'
        columns.push({
          title: "Acciones",
          key: "acciones",
          render: () => (
            <div>
              <Button type="primary">Editar</Button>
              <Button type="danger">Borrar</Button>
            </div>
          ),
        });

        // Reordenar columnas para que 'id' sea la primera columna
        const idColumnIndex = columns.findIndex(
          (column) => column.dataIndex === "id"
        );
        if (idColumnIndex !== -1) {
          const idColumn = columns.splice(idColumnIndex, 1)[0];
          columns.unshift(idColumn);
        }

        setData(data);
        setColumns(columns);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [url]);

  return <Table dataSource={data} columns={columns} loading={loading} />;
};

export default useTable;
