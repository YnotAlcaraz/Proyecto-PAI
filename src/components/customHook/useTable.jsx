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
          title: key,
          dataIndex: key,
          key: key,
        }));
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
