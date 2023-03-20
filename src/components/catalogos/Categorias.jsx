import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Modal, Form, Input, Col, Row } from "antd";
import axios from "axios";

export const Categorias = () => {
  const url = "http://localhost:3000/categorias";
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [iden, setIden] = useState();
  const [desc, setDesc] = useState();

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setPagos(res.data);
      })
      .catch((err) => console.error(err));
  }, [isLoading]);

  const onFinish = () => {
    if (desc) {
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios
          .post(url, { descripcion: desc })
          .then(() => {
            setIsLoading(false);
            setVisible(false);
          })
          .catch((err) => console.error(err));
      } else {
        //PATCH
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

  const onEdit = (id) => {
    setIsEdit(true);
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
    setIsEdit(false);
    setIden();
    setDesc();
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Método de Pago",
      dataIndex: "descripcion",
      key: "descripcion",
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
            title="¿Deseas Eliminar Este Método De Pago?"
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
      <h1>Catálogo De Categorías</h1>
      <hr />
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Agregar Método De Pago
      </Button>
      <Table
        dataSource={pagos}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <Modal
        title={`${isEdit ? "Editar" : "Agregar"} Método De Pago`}
        open={visible}
        onCancel={onCancel}
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
            <Col xs={24} sm={24} md={24}>
              <Form.Item
                name="descripcion"
                label="Descripción"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input onChange={(e) => setDesc(e.target.value)} value={desc} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
