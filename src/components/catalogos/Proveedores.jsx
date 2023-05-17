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
  Row,
} from "antd";
import axios from "axios";

export const Proveedores = () => {
  const url = "http://localhost:3000/proveedores";
  const url2 = "http://localhost:3000/pagos";
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [proveedorId, setProveedorId] = useState();

  const options = pagos.map((x) => {
    return {
      value: x.id,
      label: x.descripcion,
    };
  });

  const fetchProveedores = () => {
    axios
    .get(url)
    .then((res) => {
      setProveedores(res.data);
    })
    .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProveedores();
    axios
      .get(url2)
      .then((res) => {
        setPagos(res.data);
      })
      .catch((err) => console.error(err));
  }, [isLoading]);

  const onEdit = async (id) => {
    setIsEdit(true);
    setVisible(true);
    form.resetFields();
    setProveedorId(id);
    const _proveedor = await axios
      .get(`${url}/${id}`)
      .then((res) => {
        return res.data
      })
      .catch((err) => console.error(err));
      console.log(_proveedor);
      form.setFieldsValue(_proveedor);
  };

  const onFinish = () => {
    if (true) {
      const _proveedor = form.getFieldsValue();
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios
          .post(url, _proveedor)
          .then(() => {
            setIsLoading(false);
            setVisible(false);
            fetchProveedores();
            form.resetFields();
          })
          .catch((err) => console.error(err));
      } else {
        //PATCH
        axios.patch(`${url}/${proveedorId}`, _proveedor).then(() => {
          setIsEdit(false);
          setIsLoading(false);
          setVisible(false);
          fetchProveedores();
          form.resetFields();
        });
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

  const onCancel = () => {
    setIsEdit(false);
    setVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Nombre De La Empresa",
      dataIndex: "nombre_empresa",
      key: "nombre_empresa",
    },
    {
      title: "Correo Electronico",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "No. De Telefono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Dirección De Facturación",
      dataIndex: "direccion_facturacion",
      key: "direccion_facturacion",
    },
    {
      title: "Método De Pago",
      dataIndex: "forma_pago",
      key: "forma_pago",
      render: (val) => pagos.find((e) => e.id === val)?.descripcion,
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
            style={{ marginRight: 16, width: 100}}
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
            <Button danger type="primary" style={{ marginRight: 16, width: 100}}>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <h1>Catálogo De Proveedores</h1>
      <hr />
      <Form
        layout="vertical"
      >
        <Row gutter={10}>
          <Col xs={24} sm={4} md={6}>
            <Form.Item
              label="Filtrar por Nombre"
            >
              <Input.Search
                placeholder="Nombre"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4} md={6}>
            <Form.Item
              label="Filtrar por Nombre de la Empresa"
            >
              <Input.Search
                placeholder="Nombre de la Empresa"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Agregar Proovedor
      </Button>
      <Table
        dataSource={proveedores}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />
      <Modal
        title={`${isEdit ? "Editar" : "Agregar"} Proveedor`}
        open={visible}
        onCancel={onCancel}
        width={"50%"}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={() => onFinish()}>
            Guardar
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <Row gutter={10}>
            <Col xs={24} sm={24} md={12}>
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
                <Input />
              </Form.Item>
              <Form.Item
                name="nombre_empresa"
                label="Nombre De La Empresa"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Correo Electrónico"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="telefono"
                label="Número De Teléfono"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="direccion"
                label="Dirección"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="direccion_facturacion"
                label="Dirección De Facturación"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="forma_pago"
                label="Método De Pago"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Select options={options}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
