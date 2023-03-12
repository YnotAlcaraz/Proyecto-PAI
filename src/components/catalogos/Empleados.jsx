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
  Col
} from "antd";
import axios, { Axios } from "axios";

export const Empleados = () => {
  const url = 'http://localhost:3000/empleados';
  const [empleados, setEmpleados] = useState([]);
  const [visible, setVisible] = useState(false);
  const [apellidoMaterno, setApellidoMaterno] = useState();
  const [apellidoPaterno, setApellidoPaterno] = useState();
  const [curp, setCurp] = useState();
  const [fechaIni, setFechaIni] = useState();
  const [fechaNac, setFechaNac] = useState();
  const [iden, setIden] = useState();
  const [noTel, setNoTel] = useState();
  const [nombres, setNombres] = useState();
  const [rfc, setRfc] = useState();
  const [sexo, setSexo] = useState();


  useEffect(() => {
    axios.get(url)
    .then(res => {
      setEmpleados(res.data);
    }).catch(err => console.log(err));
  }, [visible]);

  const onFinish = () => {
    axios.post(url, { apellido_materno: apellidoMaterno, apellido_paterno: apellidoPaterno, curp: curp, 
      fecha_ini: fechaIni, fecha_nac: fechaNac, id: iden, no_tel: noTel, nombre: nombres, rfc: rfc, sexo:sexo
    }).then(res => console.log(`Posting ${res}`)).catch(err => console.error(err));
    setVisible(false);
  }

  const onCancel = () => {
    setVisible(false);
  }


  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "id"
    },
    {
      title: "Nombre(s)",
      dataIndex: "nombre",
      key: "nombre",
      width: 200
    },
    {
      title: "Apellido Paterno",
      dataIndex: "apellido_paterno",
      key: "apellido_paterno",
      width: 200
    },
    {
      title: "Apellido Materno",
      dataIndex: "apellido_materno",
      key: "apellido_materno",
      width: 200
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      key: "sexo",
      width: 200
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "fecha_nac",
      key: "fecha_nac",
      width: 200
    },
    {
      title: "No. de Teléfono",
      dataIndex: "no_tel",
      key: "no_tel",
      width: 200
    },
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "rfc",
      width: 200
    },
    {
      title: "Fecha de Inicio",
      dataIndex: "fecha_ini",
      key: "fecha_ini",
      width: 200
    },
    {
      title: "Acciones",
      dataIndex: "key",
      key: "acciones",
      render: (key, record) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 16 }}
            onClick={() => handleEdit(key)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Deseas Eliminar Este Empleado?"
            onConfirm={() => handleDelete(key)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="danger" style={{ marginRight: 16 }}>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      )
    }
  ];

  const rules = [
    {
      required: [
        {
          required: true,
          message: "Este Campo es Requerido"
        }
      ]
    }
  ]

  return (
    <>
      <h1>Catálogo de Empleados</h1>
      <Button type="primary" onClick={() => setVisible(true)}>
        Agregar Empleado
      </Button>
      <Table 
        dataSource={ empleados }
        columns={ columns }
        pagination={{ pageSize:5 }}
        rowKey="key"
      />

    <Modal
        title="Agregar Empleado"
        open={visible}
        onCancel={onCancel}
        width={'75%'}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancelar
          </Button>,
          <Button key="save" type="submit" onClick={() => onFinish()}>
            Guardar
          </Button>,
        ]}
      >
        <Form layout="vertical"
          onFinish={onFinish}
        >
          <Col>
            <Form.Item
              name="id"
              label="id"
              rules={rules.required}
            >
              <Input onChange={e => setIden(e.target.value)} value={iden} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              name="nombre"
              label="Nombre(s)"
            >
              <Input onChange={e => setNombres(e.target.value)} value={nombres}/>
            </Form.Item>
            <Form.Item
              name="apellido_paterno"
              label="Apellido Paterno"
            >
              <Input onChange={e => setApellidoPaterno(e.target.value)} value={apellidoPaterno} />
            </Form.Item>
            <Form.Item
              name="apellido_materno"
              label="Apellido Materno"
            >
              <Input onChange={e => setApellidoMaterno(e.target.value)} value={apellidoMaterno} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
          <Form.Item
            name="sexo"
            label="Sexo"
          >
              <Select 
                options={[
                  {value: 'Femenino', label: 'Femenino'},
                  {value: 'Masculino', label: 'Masculino'}
                ]}
                onChange={e => {
                  setSexo(e)
                }} value={sexo} 
              />
            </Form.Item>
            <Form.Item
              name="curp"
              label="CURP"
            >
              <Input onChange={e => setCurp(e.target.value)} value={curp} />
            </Form.Item>
            <Form.Item
              name="fecha_nac"
              label="Fecha de Nacimiento"
            >
              <DatePicker onChange={e => setFechaNac(e.format('DD/MM/YYYY'))} value={fechaNac} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              name="rfc"
              label="RFC"
            >
              <Input onChange={e => setRfc(e.target.value)} value={rfc} />
            </Form.Item>
            <Form.Item
              name="no_tel"
              label="Número de Teléfono"
            >
              <Input onChange={e => setNoTel(e.target.value)} value={noTel} />
            </Form.Item>
            <Form.Item
              name="fecha_ini"
              label="Fecha de Inicio"
            >
              <DatePicker onChange={e => setFechaIni(e.format('DD/MM/YYYY'))} value={fechaIni} />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </>
  )
}
