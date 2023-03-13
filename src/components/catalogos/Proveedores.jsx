import React, { useEffect, useState } from "react";
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
  Row
} from "antd";
import axios from "axios";

export const Proveedores = () => {
  const url = 'http://localhost:3000/proveedores';
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [visible, setVisible] = useState(false);
  const [iden, setIden] = useState();
  const [nomb, setNomb] = useState();
  const [corr, setCorr] = useState();
  const [tel, setTel] = useState();
  const [dir, setDir] = useState();

  useEffect(() => {
    axios.get(url)
    .then(res => {
      setProveedores(res.data);
    }).catch(err => console.error(err));
  }, [isLoading]);
  
  const onFinish = () => {
    if ( iden && nomb && corr && tel && dir ) {
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios.post(url, {
          id: iden, nombre: nomb, correo: corr, telefono: tel, direccion: dir
        }).then(() => {
          setIsLoading(false);
          setVisible(false);
        }).catch(err => console.error(err));
      } else {
        //PATCH
      }
    } else {
      alert('Por Favor Llene Los Campos Requeridos');
    }
  }

  const onDelete = (id) => {
    setIsLoading(true);
    axios.delete(`${url}/${id}`).then(() => {
      setIsLoading(false);
    }).catch(err => console.error(err));
  }

  const onEdit = () => {
    setIsEdit(true);
    setVisible(true);
  }

  const onCancel = () => {
    setIsEdit(false);
    setVisible(false);
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre"
    },
    {
      title: "Correo Electronico",
      dataIndex: "correo",
      key: "correo"
    },
    {
      title: "No. de Telefono",
      dataIndex: "telefono",
      key: "telefono"
    },
    {
      title: "Direccion",
      dataIndex: "direccion",
      key: "direccion"
    },
    {
      title: "Acciones",
      dataIndex: "id",
      key: "acciones",
      width: 200,
      render: (key, record) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 16 }}
            onClick={() => onEdit(key)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Deseas Eliminar Este Proveedor?"
            onConfirm={() => onDelete(key)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="danger" style={{ marginRight: 16 }}>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

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
