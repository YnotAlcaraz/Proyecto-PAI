import useTable from "../customHook/useTable";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Col,
  Row,
} from "antd";
export const Proveedores = () => {
  return (
    <>
      <h1>Catálogo De Productos</h1>
      <hr />
      <Button type="primary" style={{ marginBottom: 20 }}>
        Agregar Producto
      </Button>

      {useTable("http://localhost:3000/proveedores")}
    </>
  );
};
