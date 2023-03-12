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
  Row
} from "antd";
import axios from "axios";

export const Proveedores = () => {
  const url = 'http://localhost:3000/proveedores';
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [visible, setVisible] = useState(false);
  const [iden, setIden] = useState();
  const [nomb, setNomb] = useState();
  const [corr, setCorr] = useState();
  const [tel, setTel] = useState();
  const [dir, setDir] = useState();

  useEffect(() => {
    axios.get(url)
    .then(res => {
      setProveedores(res.data);
    }).catch(err => console.error(err));
  }, [isLoading]);
  
  const onFinish = () => {
    if ( iden && nomb && corr && tel && dir ) {
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios.post(url, {
          id: iden, nombre: nomb, correo: corr, telefono: tel, direccion: dir
        }).then(() => {
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

  const onEdit = () => {
    setIsEdit(true);
    setVisible(true);
  }

  const onCancel = () => {
    setIsEdit(false);
    setVisible(false);
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre"
    },
    {
      title: "Correo Electronico",
      dataIndex: "correo",
      key: "correo"
    },
    {
      title: "No. de Telefono",
      dataIndex: "telefono",
      key: "telefono"
    },
    {
      title: "Direccion",
      dataIndex: "direccion",
      key: "direccion"
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
  ];

  return (
    <>
      <h1>Catálogo De Proveedores</h1>
      <hr />
      <Button type="primary" onClick={() => setVisible(true)} style={{marginBottom: 20}}>
        Agregar Proveedor
      </Button>
      <Table 
        dataSource={ proveedores }
        columns={ columns }
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />
      <Modal
        title={`${isEdit ? 'Editar' : 'Agregar'} Proveedor`}
        open={ visible }
        onCancel={ onCancel }
        width={'70%'}
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
            <Col xs={24} sm={24} md={16}>
              <Form.Item
                name="id"
                label="Id"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <Input onChange={e => setIden(e.target.value)} value={iden} />
              </Form.Item>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <Input onChange={e => setNomb(e.target.value)} value={nomb} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={24} md={16}>
              <Form.Item
                name="correo"
                label="Correo"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requierido"
                }]}
              >
                <Input onChange={e => setCorr(e.target.value)} value={corr} />
              </Form.Item>
              <Form.Item
                name="telefono"
                label="No. de Telefono"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <Input onChange={e => setTel(e.target.value)} value={tel} />
              </Form.Item>
              <Form.Item
                name="direccion"
                label="Direccion"
                rules={[{
                  required: true,
                  message: "Este Campo Es Obligatorio"
                }]}
              >
                <Input onChange={e => setDir(e.target.value)} value={dir}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}
