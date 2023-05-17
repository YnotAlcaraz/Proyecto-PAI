import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  Col,
  Row,
  InputNumber,
} from "antd";
import axios from "axios";

export const Pedidos = () => {
  const url = 'http://localhost:3000/pedidos';
  const urlPagos = 'http://localhost:3000/pagos';
  const urlProveedores = 'http://localhost:3000/proveedores';
  const urlProductos = 'http://localhost:3000/productos';
  const [form] = Form.useForm();
  const [pedidos, setPedidos] = useState([]);
  const [pedidoId, setPedidoId] = useState();
  const [pagos, setPagos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [prod, setProd] = useState([]);

  const fetchPedidos = () => {
    axios
      .get(url)
      .then((res) => {
        setPedidos(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPedidos();
    axios.get(urlPagos)
    .then(res => {
      setPagos(res.data);
    }).catch(err => console.error(err));
    axios.get(urlProveedores)
    .then(res => {
      setProveedores(res.data);
    }).catch(err => console.error(err));
    axios.get(urlProductos)
    .then(res => {
      setProd(res.data);
    }).catch(err => console.error(err));
  }, [isLoading]);

  const optionsPagos = pagos.map(x => {
    return {
      value: x.id,
      label: x.descripcion
    }
  });

  const optionProductos = prod.map(x => {
    return {
      value: x.id,
      label: x.nombre
    }
  });

  const optionsProveedores = proveedores.map(x => {
    return {
      value: x.id,
      label: x.nombre_empresa
    }
  });

  const optionsEstatus = [
    {value: "Autorizado", label:"Autorizado"},
    {value: "En Proceso", label:"En Proceso"},
    {value: "Entregado", label:"Entregado"},
  ];

  const onEdit = async (id) => {
    setIsEdit(true);
    setVisible(true);
    form.resetFields();
    setPedidoId(id);
    const _pedido = await axios
      .get(`${url}/${id}`)
      .then((res) => res.data)
      .catch((err) => console.error(err));
      form.setFieldsValue(_pedido);
  }

  const onFinish = () => {
    const errorFields = form.getFieldsError()
    if (true) {
      const _pedido = form.getFieldsValue();
      const _producto = prod.find((e) => e.id === _pedido?.productos)
      if (_pedido?.estatus === "Entregado") {
        _producto.cantidad = _producto.cantidad + _pedido.cantidad
      }
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios.post(url, _pedido).then(() => {
          setIsLoading(false);
          setVisible(false);
          fetchPedidos();
          form.resetFields();
          axios.patch(`${urlProductos}/${_producto?.id}`, _producto);
        }).catch(err => console.error(err));
      } else {
        //PATCH
        axios.patch(`${url}/${pedidoId}`, _pedido).then(() => {
          setIsEdit(false);
          setIsLoading(false);
          setVisible(false);
          fetchPedidos();
          form.resetFields();
          axios.patch(`${urlProductos}/${_producto?.id}`, _producto);
        });
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

  const onCancel = () => {
    setVisible(false);
    setIsEdit(false);
    form.resetFields();
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Proveedor",
      dataIndex: "proveedor",
      key: "proveedor",
      render: (val) => proveedores.find((e) => e.id === val)?.nombre_empresa
    },
    {
      title: "Método De Pago",
      dataIndex: "pago",
      key: "pago",
      render: (val) => pagos.find(e => e.id === val)?.descripcion,
    },
    {
      title: "Producto",
      dataIndex: "productos",
      key: "idProducto",
      render: (val) => prod.find((e) => e.id === val)?.nombre
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Estatus",
      dataIndex: "estatus",
      key: "estatus",
    },
    {
      title: "Acciones",
      dataIndex: "id",
      key: "acciones",
      width: 200,
      render: (key) => {
        const _pedido = pedidos.find((e) => e.id === key);
        if (_pedido?.estatus !== "Entregado") {
          return (
            <>
              <Button
                type="primary"
                style={{ marginRight: 16, width: 100}}
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
                <Button danger type="primary" style={{ marginRight: 16, width: 100}}>
                  Eliminar
                </Button>
              </Popconfirm>
            </>
          )
        } else {
          return 'Pedido Entregado';
        }
      },
    },
  ];;
  return (
    <>
      <h1>Pedidos</h1>
      <hr />
      <Button type="primary" onClick={() => setVisible(true)} style={{marginBottom: 20}}>
        Agregar Pedido
      </Button>
      <Table 
        dataSource={ pedidos }
        columns={ columns }
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <Modal
        title={`${isEdit ? 'Editar' : 'Agregar'} Pedido`}
        open={ visible }
        onCancel={ onCancel }
        width={'60%'}
        footer={[
          <Button key="cancel" onClick={ onCancel }>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={() => onFinish()}>
            Guardar
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          onFinish={ onFinish }
          form={form}
        >
          <Row gutter={10}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="productos"
                label="Producto"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <Select 
                  options={optionProductos}
                />
              </Form.Item>
              <Form.Item
                name="cantidad"
                label="Cantidad"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="proveedor"
                label="Proveedor"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <Select 
                  options={optionsProveedores}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="pago"
                label="Método De Pago"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <Select 
                  options={optionsPagos}
                />
              </Form.Item>
              <Form.Item
                name="estatus"
                label="Estatus"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <Select 
                  options={optionsEstatus}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}
