import React, { useState, useEffect } from "react";
import { Table } from "antd";

const useTable = (url) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const columns = Object.keys(data[0]).map((key) => ({
          title: key === "id" ? "Id" : key,
          dataIndex: key,
          key: key,
          render: (text, record) => {
            if (key === "Imagen del producto") {
              return <img src={text} alt={record.nombre} />;
            }
            return text;
          },
        }));

        // Reorder columns to have 'id' at the beginning
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
