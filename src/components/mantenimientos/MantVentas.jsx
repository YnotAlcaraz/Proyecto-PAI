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
    const [visibleReporte, setVisibleReporte] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const onEdit = () => {
        setIsEdit(true);
        setVisible(true);
    }

    const onFinish = () => {}

    const onCancel = () => {
        setIsEdit(false);
        setVisible(false);
        setVisibleReporte(false);
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
            title: "Monto total de la venta",
            dataIndex: "total_venta",
            key: "total_venta",
            render: (val) => {
                return `$ ${val}`
            }
        },
        {
            title: "Productos",
            dataIndex: "productos",
            key: "productos",
            render: (productos) => (
                <>
                  {productos.map((producto) => (
                    <p key={producto.nombre}>{producto.nombre} - Cantidad: 1</p>
                  ))}
                </>
              ),
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

    const columns3 = [
        {
            title: 'No.',
            dataIndex: "noRow",
            key: "noRow",
            width: 50,
        },
        {
            title: "Nombre del Producto",
            dataIndex: "productoNombre",
            key: "productoNombre",
        },
        {
            title: "Cantidad Vendida",
            dataIndex: "cantidadVendida",
            key: "cantidadVendida",
        },
        {
            title: "Monto Total",
            dataIndex: "montoTotal",
            key: "montoTotal",
            render: (val) => {
                return `$ ${val}`
            }
        },
    ]

    const dataVentas = [
        {
            id: 1,
            fecha_venta: '18/04/2023',
            total_venta: 3778,
            productos: [
                {
                    nombre: 'Logitech G305'
                },
                {
                    nombre: 'Sceptre E205W-16003R'
                },
                {
                    nombre: 'Logitech G213'
                }
            ]
        },
    ]

    const dataProducto = [
        {
            idProducto: 84,
            nombreProducto: 'Logitech G305',
            descripcionProducto: 'Mouse inalámbrico para computadora',
            imagenProducto: 'https://m.media-amazon.com/images/I/51eXBGX+MYL._AC_SL1500_.jpg',
            categoriaProducto: 'Ratones',
            cantidadProducto: 2,
            montoProducto: 1000,
        },
        {
            idProducto: 85,
            nombreProducto: 'Sceptre E205W-16003R',
            descripcionProducto: 'Monitor para computadora',
            imagenProducto: 'https://m.media-amazon.com/images/I/51v6h2TfPCL._AC_SL1195_.jpg',
            categoriaProducto: 'Monitores',
            cantidadProducto: 1,
            montoProducto: 2397,
        },
    ]

    const dataReporte = [
        {
            noRow: 1,
            productoNombre: "Logitech G305",
            cantidadVendida: 3,
            montoTotal: 1500,
        },
        {
            noRow: 2,
            productoNombre: "Sceptre E205W-16003R",
            cantidadVendida: 2,
            montoTotal: 4794,
        },
        {
            noRow: 3,
            productoNombre: "Logitech G213",
            cantidadVendida: 1,
            montoTotal: 881,
        }
    ]

  return (
     <>
        <h1>Ventas</h1>
        <hr />
        <Button
            type="primary"
            onClick={() => setVisible(true)}
            style={{ marginBottom: 20, marginRight: 10 }}
        >
            Agregar Venta
        </Button>
        <Button
            type="primary"
            onClick={() => setVisibleReporte(true)}
            style={{ marginBottom: 20 }}
        >
            Generar Reporte
        </Button>
        <Table
            columns={columns}
            dataSource={dataVentas}
        />
        <Modal
            title={`${isEdit ? "Editar" : "Agregar"} Venta`}
            open={visible}
            onCancel={onCancel}
            width={"75%"}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancelar
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
                        <Form.Item
                            label="Código de Barras"
                        >
                            <Input
                                disabled
                            />
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
                dataSource={dataProducto}
            />
        </Modal>
        <Modal
            title="Generar Reporte de Ventas"
            open={visibleReporte}
            onCancel={onCancel}
            width={"90% "}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cerrar
                </Button>,
                <Button key="save" type="primary" onClick={() => onFinish()}>
                    Exportar
                </Button>,
            ]}
        >
            <Form
                layout="vertical"
                onFinish={onFinish}
            >   
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            label="Mes"
                        >
                            <Input
                                defaultValue="Marzo"
                                disabled
                                style={{ fontWeight: 600 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            label="Forma de ordenamiento"
                        >
                            <Input
                                defaultValue="Más Vendidos"
                                disabled
                                style={{ fontWeight: 600 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item>
                            <Button key="agregar" style={{marginTop: "30px"}}>
                                Generar Reporte
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                <hr />
                <h4 style={{ textAlign: "center" }}>INSTITUTO TECNOLÓGICO DE MEXICALI</h4>
                <p style={{ textAlign: "center" }}>Proyecto de Administración de Inventario</p>
                <br />
                <h5>Reporte de Ventas En El Mes de Marzo</h5>
                <br />
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            label="Fecha"
                        >
                            <Input
                                defaultValue="19/04/2023"
                                style={{ fontWeight: 600 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            label="Hora"
                        >
                            <Input
                                defaultValue="14:02:02"
                                style={{ fontWeight: 600 }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            label="Monto Total Del Mes"
                        >
                            <Input

                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={columns3}
                dataSource={dataReporte}
            />
        </Modal>
    </>
  )
}
