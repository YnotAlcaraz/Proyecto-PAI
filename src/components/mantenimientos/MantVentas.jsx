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

export const MantVentas = () => {
    const [visible, setVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const onEdit = () => {
        setIsEdit(true);
        setVisible(true);
    }

    const onFinish = () => {}

    const onCancel = () => {
        setIsEdit(false);
        setVisible(false);
    }

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
            width: 50,
        },
        {
            title: "Fecha de Venta",
            dataIndex: "fecha_venta",
            key: "fecha_venta"
        },
        {
            title: "Total de Venta",
            dataIndex: "total_venta",
            key: "total_venta"
        },
        {
            title: "Producto",
            dataIndex: "producto",
            key: "producto"
        },
        {
            title: "Cantidad",
            dataIndex: "cantidad",
            key: "cantidad"
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
    ]

    const columns2 = [
        {
            title: "Id",
            dataIndex: "idProducto",
            key: "idProducto"
        },
        {
            title: "Nombre del Producto",
            dataIndex: "nombreProducto",
            key: "nombreProducto"
        },
        {
            title: "Descripción",
            dataIndex: "descripcionProducto",
            key: "descripcionProducto"
        },
        {
            title: "Imagen del Producto",
            dataIndex: "imagenProducto",
            key: "imagenProducto",
            render: (text) => (
                <img src={text} style={{ maxHeight: '100px'}} />
            )
        },
        {
            title: "Categoría",
            dataIndex: "categoriaProducto",
            key: "categoriaProducto"
        },
        {
            title: "Cantidad",
            dataIndex: "cantidadProducto",
            key: "cantidadProducto"
        },
        {
            title: "Monto",
            dataIndex: "montoProducto",
            key: "cantidadProducto",
            render: (val) => {
                return `$ ${val}`
            }
        },
    ];

  return (
     <>
        <h1>Ventas</h1>
        <Button
            type="primary"
            onClick={() => setVisible(true)}
            style={{ marginBottom: 20 }}
        >
            Agregar Venta
        </Button>
        <Table
            columns={columns}
        />
        <Modal
            title={`${isEdit ? "Editar" : "Agregar"} Venta`}
            open={visible}
            onCancel={onCancel}
            width={"75%"}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Calcelar
                </Button>,
                <Button key="save" type="primary" onClick={() => onFinish()}>
                    Registrar Venta
                </Button>,
            ]}
        >
            <Form layout="vertical" onFinish={onFinish}>
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            label="Categoría"
                        >
                            <Select />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            label="Id de producto"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            label="Nombre de producto"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            label="Cantidad"
                            rules={[
                                {
                                    required: true,
                                    message: "Este Campo Es Requerido"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item>
                            <Button key="agregar" style={{marginTop: "30px"}}>
                                Agregar Producto
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={columns2}
            />
        </Modal>
    </>
  )
}
