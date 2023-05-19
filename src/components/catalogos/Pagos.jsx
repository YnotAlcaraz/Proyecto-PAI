import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Modal, Form, Input, Col, Row } from "antd";
import axios from "axios";

export const Pagos = () => {
  const url = "http://localhost:3000/pagos";
  const [form] = Form.useForm(); 
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [pagoId, setPagoId] = useState();
  const [visible, setVisible] = useState(false);

  const fetchPagos = () => {
    axios
      .get(url)
      .then((res) => {
        setPagos(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPagos();
  }, [isLoading]);

  const onEdit = async (id) => {
    setIsEdit(true);
    setVisible(true);
    form.resetFields();
    setPagoId(id);
    const _pago = await axios
      .get(`${url}/${id}`)
      .then((res) => res.data)
      .catch((err) => console.error(err));
      form.setFieldsValue(_pago);
  };

  const onFinish = () => {
    const errorFields = form.getFieldsError()
    if (!errorFields) {
      const _pago = form.getFieldsValue();
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios
          .post(url, _pago)
          .then(() => {
            setIsLoading(false);
            setVisible(false);
            fetchPagos();
            form.resetFields();
          })
          .catch((err) => console.error(err));
      } else {
        //PATCH
        axios.patch(`${url}/${pagoId}`, _pago).then(() => {
          setIsEdit(false);
          setIsLoading(false);
          setVisible(false);
          fetchPagos();
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
    setVisible(false);
    setIsEdit(false);
    form.resetFields();
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
            style={{ marginRight: 16, width: 100}}
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
      <h1>Catálogo De Métodos De Pago</h1>
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
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
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
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
