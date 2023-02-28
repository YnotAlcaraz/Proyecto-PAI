import { Table } from "antd";

export const Catalogos = ({ title, dataSource, columns }) => {
  return (
    <>
      <h1>Catálogo de {title}</h1>
      <Table dataSource={dataSource} columns={columns} />;
    </>
  );
};
