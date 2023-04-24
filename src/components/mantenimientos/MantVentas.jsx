import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Col,
  Row,
  Spin,
} from "antd";
import axios from "axios";

export const MantVentas = () => {
    const [form] = Form.useForm();
    const urlVentas = 'http://localhost:3000/ventas';
    const urlVentasProductos = 'http://localhost:3000/ventas_productos';
    const urlProductos = 'http://localhost:3000/productos';
    const urlCategorias = 'http://localhost:3000/categorias';
    const [ventas, setVentas] = useState([]);
    const [venta, setVenta] = useState({});
    const [ventasProductos, setVentasProductos] = useState([]);
    const [ventaProducto, setVentaProducto] = useState();
    const [idVenta, setIdVenta] = useState();
    const [productos, setProductos] = useState([]);
    const [productosFiltered, setProductosFiltered] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleProductos, setVisibleProductos] = useState(false);
    const [visibleReporte, setVisibleReporte] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
      axios.get(urlVentas)
      .then(res => {
        setVentas(res.data);
      }).catch(err => console.error(err));
      axios.get(urlVentasProductos)
      .then(res => {
        setVentasProductos(res.data);
      }).catch(err => console.error(err));
      axios.get(urlProductos)
      .then(res => {
        setProductos(res.data);
      }).catch(err => console.error(err));
      axios.get(urlCategorias)
      .then(res => {
        setCategorias(res.data);
      }).catch(err => console.err(err));
    }, [isLoading]);

    const fetchData = () => {
        axios.get(urlVentasProductos)
        .then(res => {
            const _ventasProductos = res.data;
            setVentaProducto(_ventasProductos?.filter((e) => e.idVenta === idVenta));
            console.log(_ventasProductos?.filter((e) => e.idVenta === idVenta));
      }).catch(err => console.error(err));

    }

    const onChangeCategoria = (value) => {
        const _productosFiltered = productos?.filter((e) => e.categoria === value);
        setProductosFiltered(_productosFiltered);
    }

    const onChangeProducto = (value) => {
        const _producto = productos.find((e) => e.id === value);
        form.setFieldsValue({ id_del_producto: _producto?.id });
        form.setFieldsValue({ codigo_de_barras: _producto?.codigo_de_barras });
    }

    const onAddProducto = () => {
        const _dataProducto = form.getFieldsValue();
        setIsLoading(true);
        axios.post(urlVentasProductos, _dataProducto).then(() => {
            form.resetFields();
            form.setFieldsValue({idVenta: idVenta});
            setIsLoading(false);
        }).catch(err => console.error(err));
        fetchData();
    }


    const onFinish = () => {
        if (!isEdit) {
            setIsLoading(true);
            const fecha = new Date().toLocaleDateString('en-GB');
            axios.post(urlVentas, { fecha_venta: fecha }).then(() => {
                setIsLoading(false);
            }).catch(err => console.error(err));
        }
    }

    const categoriasOptions = categorias.map(x => {
        return {
            value: x.id,
            label: x.descripcion,
        }
    });

    const productosOptions = productosFiltered.map(x => {
        return {
            value: x.id,
            label: x.nombre,
        }
    });

    const onDelete = async (id) => {
        const _ventasProductos = ventasProductos.filter((e) => e.idVenta === id);
        setIsLoading(true);
        axios.delete(`${urlVentas}/${id}`).then(() => {
            setIsLoading(false);
        }).catch(err => console.error(err));
        _ventasProductos.map((x) => {
            axios.delete(`${urlVentasProductos}/${x.id}`);
        });
    }

    const onEdit = (id) => {
        setIsEdit(true);
        setVisible(true);
        setIdVenta(id);
        form.setFieldsValue({ idVenta: id })
        setVentaProducto(ventasProductos?.filter((e) => e.idVenta === id));
    }

    const onCancel = () => {
        setIsEdit(false);
        setVisible(false);
        setVisibleProductos(false);
        setVisibleReporte(false);
        setIdVenta();
    }

    const mostrarProductos = (id) => {
        setIdVenta(id);
        setVisibleProductos(true);
        setVentaProducto(ventasProductos?.filter((e) => e.idVenta === id));
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
            dataIndex: "id",
            key: "total_venta",
            render: (val) => {
                const _productosVenta = ventasProductos.filter((e) => e.idVenta === val);
                let montoTotal = 0;
                _productosVenta.map((x) => {
                    const _precio = productos.find((e) => e.id === x.id_del_producto)?.precio_de_venta;
                    const _cantidad = x.cantidad;
                    const _monto = _precio * _cantidad;
                    montoTotal = montoTotal + _monto;
                });
                return `$${montoTotal}`;
            }
        },
        {
            title: "Productos",
            dataIndex: "id",
            key: "productos",
            render: (key, record) => (
                <>
                  <Button
                    type="primary"
                    style={{ marginRight: 16 }}
                    onClick={() => mostrarProductos(key)}
                  >
                    Ver Productos
                  </Button>
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
                  style={{ marginRight: 16, marginTop: 5, width: '100%' }}
                  onClick={() => onEdit(key)}
                >
                  Agregar Productos
                </Button>
                <Popconfirm
                  title="¿Deseas Eliminar Esta Venta?"
                  onConfirm={() => onDelete(key)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button type="danger" style={{ marginRight: 16,  marginTop: 5, width: '100%'}}>
                    Eliminar Venta
                  </Button>
                </Popconfirm>
              </>
            ),
          },
    ]

    const columns2 = [
        {
            title: "Id",
            dataIndex: "id_del_producto",
            key: "id_del_producto"
        },
        {
            title: "Nombre del Producto",
            dataIndex: "nombre_del_producto",
            key: "nombre_del_producto",
            render: (val) => productos.find((e) => e.id === val)?.nombre,
        },
        {
            title: "Descripción",
            dataIndex: "id_del_producto",
            key: "descripcion_del_producto",
            render: (val) => productos.find((e) => e.id === val)?.descripcion,
        },
        {
            title: "Imagen del Producto",
            dataIndex: "id_del_producto",
            key: "imagen_del_producto",
            render: (val) => {
                const _text = productos.find((e) => e.id === val)?.imagen_del_producto;
                return <img src={_text} style={{ maxHeight: '100px'}} />
            }
        },
        {
            title: "Categoría",
            dataIndex: "categoria",
            key: "categoria",
            render: (val) => categorias.find((e) => e.id === val)?.descripcion,
        },
        {
            title: "Cantidad",
            dataIndex: "cantidad",
            key: "cantidad"
        },
        {
            title: "Monto",
            dataIndex: "id_del_producto",
            key: "monto_del_producto",
            render: (val) => {
                const _costo = productos.find((e) => e.id === val)?.precio_de_venta;
                const _productosVenta = ventasProductos.filter((e) => e.idVenta === idVenta);
                const _productoCantidad = _productosVenta?.find((e) => e.id_del_producto === val)?.cantidad;
                const _monto = _costo * _productoCantidad;
                return `$${_monto}` || '';
            }
        },
    ];

    const columns3 = [
        {
            title: "Producto",
            dataIndex: "id_del_producto",
            key: "producto",
            render: (val) => productos.find((e) => e.id === val)?.nombre,
        },
        {
            title: "Precio Individual",
            dataIndex: "id_del_producto",
            key: "precio_individual",
            render: (val) => {
                const _precio = productos.find((e) => e.id === val)?.precio_de_venta;
                return `$${_precio}` || '';
            },
        },
        {
            title: "Cantidad",
            dataIndex: "cantidad",
            key: "cantidad",
        },
        {
            title: "Monto Total",
            dataIndex: "id_del_producto",
            key: "monto_total",
            render: (val) => {
                const _costo = productos.find((e) => e.id === val)?.precio_de_venta;
                const _productosVenta = ventasProductos.filter((e) => e.idVenta === idVenta);
                const _productoCantidad = _productosVenta?.find((e) => e.id_del_producto === val)?.cantidad;
                const _monto = _costo * _productoCantidad;
                return `$${_monto}` || '';
            }
        },
    ]

    const columns4 = [
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

  return (
     <>
        <h1>Ventas</h1>
        <hr />
        <Button
            type="primary"
            onClick={() => onFinish()}
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
            dataSource={ventas}
            columns={columns}
        />
        <Modal
            title={`${isEdit ? "Editar" : "Agregar"} Venta`}
            open={visible}
            onCancel={onCancel}
            width={"75%"}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cerrar
                </Button>,
            ]}
        >
            <Spin spinning={isLoading}>
                <Form layout="vertical" onFinish={onFinish} form={form}>
                    <Row gutter={10}>
                        <Col xs={24} sm={24} md={4}>
                            <Form.Item
                                name="idVenta"
                                label="Id De La Venta"
                            >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={4}>
                            <Form.Item
                                name="id_del_producto"
                                label="Id del producto"
                            >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="categoria"
                                label="Categoría"
                            >
                                <Select
                                    options={categoriasOptions}
                                    onChange={onChangeCategoria}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="nombre_del_producto"
                                label="Nombre Del producto"
                            >
                                <Select
                                    options={productosOptions}
                                    onChange={onChangeProducto}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="cantidad"
                                label="Cantidad"
                                rules={[
                                    {
                                        required: true,
                                        message: "Este Campo Es Requerido"
                                    }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                name="codigo_de_barras"
                                label="Código de Barras"
                            >
                                <Input
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item>
                                <Button
                                    key="agregar"
                                    onClick={onAddProducto}
                                    style={{
                                        marginTop: '30px',
                                        width: '100%'
                                    }}
                                >
                                    Agregar Producto
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
            <Table
                columns={columns2}
                dataSource={ventaProducto}
            />
        </Modal>
        <Modal
            title="Productos de la Venta"
            open={visibleProductos}
            onCancel={onCancel}
            width={"75%"}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cerrar
                </Button>
            ]}
        >
            <Table
                columns={columns3}
                dataSource={ventaProducto}
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
                columns={columns4}
            />
        </Modal>
    </>
  )
}
