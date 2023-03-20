import React, { useEffect, useState } from "react";
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
import axios from "axios";

export const Inventario = () => {
  const url = "http://localhost:3000/productos";
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [productos, setProductos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [iden, setIden] = useState();
  const [codBarras, setCodBarras] = useState();
  const [nomb, setNomb] = useState();
  const [desc, setDesc] = useState();
  const [img, setImg] = useState();
  const [precio, setPrecio] = useState();

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setProductos(res.data);
      })
      .catch((err) => console.error(err));
  }, [isLoading]);

  const onFinish = () => {
    if (iden && codBarras && nomb && desc && img && precio) {
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios
          .post(url, {
            id: iden,
            codigo_de_barras: codBarras,
            nombre: nomb,
            descripcion: desc,
            imagen_del_producto: img,
            precio_de_venta: precio,
          })
          .then(() => {
            setIsLoading(false);
            setVisible(false);
          })
          .catch((err) => console.error(err));
      } else {
        //PATCH
        axios.patch(`${url}/${iden}`, {
          codigo_de_barras: codBarras,
          nombre: nomb,
          descripcion: desc,
          imagen_del_producto: img,
          precio_de_venta: precio,
        });
        setIsLoading(false);
        setVisible(false);
      }
    } else {
      alert("Por Favor Llene Los Campos Requeridos");
    }
  };

  const onDelete = (id) => {
    setIsLoading(true);
    axios
      .delete(`${url}/${id}`)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const onEdit = () => {
    setIsEdit(true);
    setVisible(true);

    axios.get(`${url}/${iden}`).then((res) => {
      setCodBarras(res.data.codigo_de_barras);
      setNomb(res.data.nombre);
      setDesc(res.data.descripcion);
      setImg(res.data.imagen_del_producto);
      setPrecio(res.data.precio_de_venta);
    });
  };

  const onCancel = () => {
    setIsEdit(false);
    setVisible(false);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Código De Barras",
      dataIndex: "codigo_de_barras",
      key: "codigo_de_barras",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Imagen Del Producto",
      dataIndex: "imagen_del_producto",
      key: "imagen_del_producto",
      render: (text, record) => (
        <img src={text} alt={record.nombre} style={{ maxHeight: "100px" }} />
      ),
    },
    {
      title: "Precio De Venta",
      dataIndex: "precio_de_venta",
      key: "precio_de_venta",
      render: (val) => `$ ${val}`,
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
            title="¿Deseas Eliminar Este Empleado?"
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
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Agregar Producto
      </Button>
      <Table dataSource={productos} columns={columns} rowKey="key" />
      <Modal
        title={`${isEdit ? "Editar" : "Agregar"} Producto`}
        open={visible}
        onCancel={onCancel}
        width={"70%"}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={() => onFinish()}>
            Guardar
          </Button>,
        ]}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={10}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="id"
                label="Id"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input onChange={(e) => setIden(e.target.value)} value={iden} />
              </Form.Item>
              <Form.Item
                name="codigo_de_barras"
                label="Código De Barras"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setCodBarras(e.target.value)}
                  value={codBarras}
                />
              </Form.Item>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input onChange={(e) => setNomb(e.target.value)} value={nomb} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="descripcion"
                label="Descripción"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requierido",
                  },
                ]}
              >
                <Input onChange={(e) => setDesc(e.target.value)} value={desc} />
              </Form.Item>
              <Form.Item
                name="imagen_del_producto"
                label="Imagen Del Producto"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input onChange={(e) => setImg(e.target.value)} value={img} />
              </Form.Item>
              <Form.Item
                name="precio_de_venta"
                label="Precio De Venta"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Obligatorio",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setPrecio(e.target.value)}
                  value={precio}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
