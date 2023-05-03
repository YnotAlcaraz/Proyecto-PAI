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
} from "antd";
import axios from "axios";

export const Pedidos = () => {
  const url = 'http://localhost:3000/pedidos';
  const urlPagos = 'http://localhost:3000/pagos';
  const urlProveedores = 'http://localhost:3000/proveedores';
  const urlProductos = 'http://localhost:3000/productos';
  const [pedidos, setPedidos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [iden, setIden] = useState();
  const [productos, setProductos] = useState();
  const [cantidad, setCantidad] = useState();
  const [proveedor, setProveedor] = useState();
  const [metodoPago, setMetodoPago] = useState();
  const [estatus, setEstatus] = useState();
  const [prod, setProd] = useState([]);

  useEffect(() => {
    axios.get(url)
    .then(res => {
      setPedidos(res.data);
    }).catch(err => console.error(err));
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

  const data = {
    productos: [
      {
        idProducto: productos,
        cantidad: cantidad,
      }
    ],
    idProveedor: proveedor,
    pago: metodoPago,
    estatus: estatus,
  }

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

  const onFinish = () => {
    if (estatus) {
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios.post(url, data).then(() => {
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

  const onEdit = (id) => {
    setIsEdit(true);
    setVisible(true);
  }

  const onCancel = () => {
    setVisible(false);
    setIsEdit(false);
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Proveedor",
      dataIndex: "idProveedor",
      key: "idProveedor",
      render: (val) => proveedores.find((e) => e.id === val)?.nombre_empresa,
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
      render: (productos) =>
      productos.map((producto) => {
        const _nombreProducto = prod?.find((e) => e.id === producto.idProducto)?.nombre;
        return <div key={producto.idProducto}>{_nombreProducto}</div>
      }),
      },
      {
        title: "Cantidad",
        dataIndex: "productos",
        key: "cantidad",
        render: (productos) =>
        productos.map((producto) => (
          <div key={producto.idProducto}>{producto.cantidad}</div>
          )),
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
      ),
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
        >
          <Row gutter={10}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="productos"
                label="Producto"
              >
                <Select 
                  options={optionProductos}
                  onChange={e => {
                    setProductos(e);
                  }}
                  value={productos}
                />
              </Form.Item>
              <Form.Item
                name="cantidad"
                label="Cantidad"
              >
                <Input onChange={e => setCantidad(e.target.value)} value={cantidad}/>
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
                  options={optionsProveedores} onChange={e => setProveedor(e)}
                  value={proveedor}
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
                  onChange={e => setMetodoPago(e)}
                  value={metodoPago}
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
                  onChange={e => setEstatus(e)}
                  value={estatus}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}
