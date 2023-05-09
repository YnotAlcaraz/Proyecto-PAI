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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { muchoTexto } from "./imagen";

export const MantVentas = () => {
    const [form] = Form.useForm();
    const [formGenerador] = Form.useForm();
    const [formReporte] = Form.useForm();
    const urlVentas = 'http://localhost:3000/ventas';
    const urlVentasProductos = 'http://localhost:3000/ventas_productos';
    const urlProductos = 'http://localhost:3000/productos';
    const urlCategorias = 'http://localhost:3000/categorias';
    const urlEmpleados = 'http://localhost:3000/empleados'
    const [ventas, setVentas] = useState([]);
    const [ventasProductos, setVentasProductos] = useState([]);
    const [ventaProducto, setVentaProducto] = useState();
    const [ventaProductoSort, setVentaProductoSort] = useState([]);
    const [ventaProductoMes, setVentaProductoMes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [empleadoId, setEmpleadoId] = useState();
    const [idVenta, setIdVenta] = useState();
    const [productos, setProductos] = useState([]);
    const [productosFiltered, setProductosFiltered] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleEmpleado, setVisibleEmpleado] = useState(false);
    const [visibleProductos, setVisibleProductos] = useState(false);
    const [visibleReporte, setVisibleReporte] = useState(false);
    const [visibleReporteGenerado, setVisibleReporteGenerado] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mes, setMes] = useState(1);
    const [ventaProductoMesDatos, setVentaProductoMesDatos] = useState([]);
    let conter = 0;

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
      axios.get(urlEmpleados)
      .then(res => {
        setEmpleados(res.data);
      }).catch(err => console.err(err));
      conter = 0;
    }, [isLoading]);

    const fetchData = () => {
        axios.get(urlVentasProductos)
        .then(res => {
            const _ventasProductos = res.data;
            setVentaProducto(_ventasProductos?.filter((e) => e.idVenta === idVenta));
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

    const onAgregarVenta = () => {
        setVisibleEmpleado(true);
    };

    const onFinish = () => {
        if (!isEdit) {
            setIsLoading(true);
            const fecha = new Date().toLocaleDateString('en-GB');
            const fechaMes = new Date();
            const month = fechaMes.getMonth()+1;
            axios.post(urlVentas, { fecha_venta: fecha, mes: month, empleado: empleadoId }).then(() => {
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

    const mesOptions = [
        { value: 1, label: 'Enero'},
        { value: 2, label: 'Febrero'},
        { value: 3, label: 'Marzo'},
        { value: 4, label: 'Abril'},
        { value: 5, label: 'Mayo'},
        { value: 6, label: 'Junio'},
        { value: 7, label: 'Julio'},
        { value: 8, label: 'Agosto'},
        { value: 9, label: 'Septiembre'},
        { value: 10, label: 'Octubre'},
        { value: 11, label: 'Noviembre'},
        { value: 12, label: 'Diciembre'},
    ];

    const empleadosOptions = empleados.map(x => {
        return {
            value: x.id,
            label: `${x.nombre} ${x.apellido_paterno} ${x.apellido_materno || ''}`,
        }
    })

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
        setVisibleReporteGenerado(false);
        setVisibleEmpleado(false);
        setIdVenta();
        conter = 0;
    }

    const mostrarProductos = (id) => {
        setIdVenta(id);
        setVisibleProductos(true);
        setVentaProducto(ventasProductos?.filter((e) => e.idVenta === id));
    }

    const onGenerarReporte = () => {
        setVisibleReporte(false);
        setVisibleReporteGenerado(true);
        formGenerador.resetFields();
        const fecha = new Date().toLocaleDateString('en-GB');
        const current = new Date();
        const hora = `${current.getHours()}:${current.getMinutes()}`
        ventasProductos.sort((a,b) => b.cantidad - a.cantidad);
        formReporte.setFieldsValue({ fecha: fecha});
        formReporte.setFieldsValue({ hora: hora });
        const _ventasMes = ventas.filter((e) => e.mes === mes);
        let _ventasProductosDelMes = []
        let montoMensual = 0;
        _ventasMes?.map((x) => {
            const _ventasProductos = ventasProductos.filter((e) => e.idVenta === x.id);
            _ventasProductosDelMes=[..._ventasProductosDelMes, ..._ventasProductos]
            _ventasProductos.map((y) => {
                const _cantidad = y.cantidad;
                const _precio = productos.find((e) => e.id === y.id_del_producto)?.precio_de_venta;
                const _monto = _cantidad * _precio;
                montoMensual = montoMensual + _monto;
            })
        })
        setVentaProductoMes(_ventasProductosDelMes)
        let _ventaProductoMesDatos = [];
        _ventasProductosDelMes.map((venta) => {
            const _datoNombre = productos.find((e) => e.id === venta.id_del_producto)?.nombre;
            const _datoPrecio = productos.find((e) => e.id === venta.id_del_producto)?.precio_de_venta;
            const _datoMontoTotal = _datoPrecio * venta.cantidad;
            const objectDato = {
                _datoNombre,
                _datoCantidad: venta.cantidad,
                _datoMontoTotal,
            }
            _ventaProductoMesDatos = [..._ventaProductoMesDatos, objectDato]

        });
        setVentaProductoMesDatos(_ventaProductoMesDatos);
        formReporte.setFieldsValue({ monto_total_del_mes: `$${montoMensual}` });
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
            title: "Empleado",
            dataIndex: "empleado",
            key: "empleado",
            render: (val) => {
                const _empleado = empleados.find((e) => e.id === val);
                return `${_empleado?.nombre} ${_empleado?.apellido_paterno} ${_empleado?.apellido_materno || ''}`
            }
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
        /* {
            title: "Productos",
            dataIndex: "id",
            key: "productos",
            render: (key, record) => (
                <>
                  <Button
                    ghost
                    type="primary"
                    style={{ marginRight: 16 }}
                    onClick={() => mostrarProductos(key)}
                  >
                    Ver Productos
                  </Button>
                </>
              ),
        }, */
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
                  {/* Agregar Productos */}
                  Lista de Productos
                </Button>
                <Popconfirm
                  title="¿Deseas Eliminar Esta Venta?"
                  onConfirm={() => onDelete(key)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button danger type="primary" style={{ marginRight: 16,  marginTop: 5, width: '100%'}}>
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
        /* {
            title: 'No.',
            dataIndex: "noRow",
            key: "noRow",
            width: 50,
            render: (val) => {
                conter = conter + 1;
                return `${conter}`
            }
        }, */
        {
            title: "Nombre del Producto",
            dataIndex: "_datoNombre",
            key: "productoNombre",
        },
        {
            title: "Cantidad Vendida",
            dataIndex: "_datoCantidad",
            key: "cantidadVendida",
        },
        {
            title: "Monto Total",
            dataIndex: "_datoMontoTotal",
            key: "montoTotal",
            render: (val) => `$${val}`,
        },
    ]

    const onGenerarPDF = ( ) => {
        const nombreDelReporte = `Reporte De Ventas Del Mes De ${mesOptions.find((e) => e.value === mes)?.label}`;
        const fechaDelReporte = formReporte.getFieldValue('fecha');
        const horaDelReporte = formReporte.getFieldValue('hora');
        let img = muchoTexto;

        // Crear el objeto PDF
        const doc = new jsPDF();
        doc.addImage(img, 'jpg', 20,15,20,30);
        doc.text('INSTITUTO TECNOLÓGICO DE MEXICALI', 50, 25);
        doc.text('Proyecto de Administración de Inventarios', 52, 32)
        doc.text(nombreDelReporte, 57, 40);
        doc.text(`Fecha: ${fechaDelReporte}`, 50,50);
        doc.text(`Hora: ${horaDelReporte}`, 132, 50);
        doc.autoTable({
          head: [columns4.map(column => column.title)],
          body: ventaProductoMesDatos.map((record) =>
            columns4.map((column) => record[column.dataIndex])
          ),
          startY: 60,
        });

        // Devolver el objeto PDF
        doc.save('ReporteVentas.pdf');
      }

      const onTerminarVenta = () => {};

  return (
     <>
        <h1>Ventas</h1>
        <hr />
        <Button
            type="primary"
            onClick={() => onAgregarVenta()}
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
            title="Seleccionar Empleado"
            open={visibleEmpleado}
            onCancel={onCancel}
            width={"50%"}
            footer={[
                <Button key="guardar_empleado"
                    onClick={onFinish}
                >
                    Continuar
                </Button>
            ]}
        >
            <Form
                layout="vertical"
            >
                <Form.Item
                    name="empleado"
                    label="Empleado"
                >
                    <Select
                        options={empleadosOptions}
                        onChange={(val) => setEmpleadoId(val)}
                    />
                </Form.Item>
            </Form>
        </Modal>
        <Modal
            title={`${isEdit ? "Editar" : "Agregar"} Venta`}
            open={visible}
            onCancel={onCancel}
            width={"75%"}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cerrar
                </Button>,
                <Button danger type="primary" onClick={onTerminarVenta}>
                    Terminar Venta
                </Button>
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
            ]}
        >
            <Form
                layout="vertical"
                onFinish={onGenerarReporte}
                form={formGenerador}
                initialValues={{mes: 1}}
            >   
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            name="mes"
                            label="Mes"
                        >
                            <Select
                                options={mesOptions}
                                onChange={(value) => setMes(value)}
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
                            <Button
                                key="agregar"
                                style={{marginTop: "30px"}}
                                onClick={onGenerarReporte}
                            >
                                Generar Reporte
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
        <Modal
            title="Generar Reporte de Ventas"
            open={visibleReporteGenerado}
            onCancel={onCancel}
            width={"90% "}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cerrar
                </Button>,
                <Button key="savePDF" type="primary" onClick={onGenerarPDF}>
                    Exportar como PDF
                </Button>
            ]}
        >
            <h4 style={{ textAlign: "center" }}>INSTITUTO TECNOLÓGICO DE MEXICALI</h4>
            <p style={{ textAlign: "center" }}>Proyecto de Administración de Inventario</p>
            <br />
            <h5>Reporte De Ventas En El Mes De {
                mesOptions.map((x) => {
                    if (x.value === mes) {
                        if (x.value) {
                            return x.label;
                        } else {
                            return 'Enero'
                        }
                    }
                })
            }</h5>
            <br />
            <Form form={formReporte}>
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            name="fecha"
                            label="Fecha"
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            name="hora"
                            label="Hora"
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={8}>
                        <Form.Item
                            name="monto_total_del_mes"
                            label="Monto Total Del Mes"
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table
                columns={columns4}
                dataSource={ventaProductoMesDatos}
            />
        </Modal>
    </>
  )
}
