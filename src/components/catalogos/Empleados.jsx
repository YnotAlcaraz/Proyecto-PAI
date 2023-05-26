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
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
dayjs.extend(customParseFormat);
dayjs.extend(weekday)
dayjs.extend(localeData)

export const Empleados = () => {
  const [form] = Form.useForm();
  const url = "http://localhost:3000/empleados";
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [empleado, setEmpleado] = useState({});
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
  const dateFormat = 'DD/MM/YYYY';

  const fetchEmpleados = () => {
    axios
      .get(url)
      .then((res) => {
        setEmpleados(res.data);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    fetchEmpleados();
  }, [isLoading]);

  const onFinish = () => {
    if (nombres && apellidoPaterno && apellidoMaterno && sexo && curp && fecha_nac && fecha_ini) {
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios
          .post(url, {
            apellido_materno: apellidoMaterno,
            apellido_paterno: apellidoPaterno,
            curp: curp,
            fecha_ini: fechaIni,
            fecha_nac: fechaNac,
            no_tel: noTel,
            nombre: nombres,
            rfc: rfc,
            sexo: sexo,
          })
          .then(() => {
            setIsLoading(false);
            setVisible(false);
            fetchEmpleados();
            form.resetFields();
          })
          .catch((err) => console.error(err));
      } else {
        //PATCH
        axios
          .patch(`${url}/${empleado.id}`, {
            apellido_materno: apellidoMaterno,
            apellido_paterno: apellidoPaterno,
            curp: curp,
            fecha_ini: fechaIni,
            fecha_nac: fechaNac,
            id: iden,
            no_tel: noTel,
            nombre: nombres,
            rfc: rfc,
            sexo: sexo,
          })
          .then(() => {
            setIsLoading(false);
            setVisible(false);
            fetchEmpleados();
            form.resetFields();
          });
      }
    } else {
      alert('Por Favor Llene Los Campos Requeridos');
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
    axios
      .get(`${url}/${id}`)
      .then((res) => {
        setEmpleado(res.data);

        form.setFieldsValue({
          nombre: res.data.nombre,
          apellido_paterno: res.data.apellido_paterno,
          apellido_materno: res.data.apellido_materno,
          sexo: res.data.sexo,
          curp: res.data.curp,
          fecha_nac: dayjs(res.data.fecha_nac, dateFormat),
          rfc: res.data.rfc,
          no_tel: res.data.no_tel,
          fecha_ini: dayjs(res.data.fecha_ini, dateFormat),
        });
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
      width: 100,
    },
    {
      title: "Nombre(s)",
      dataIndex: "nombre",
      key: "nombre",
      width: 200,
    },
    {
      title: "Apellido Paterno",
      dataIndex: "apellido_paterno",
      key: "apellido_paterno",
      width: 200,
    },
    {
      title: "Apellido Materno",
      dataIndex: "apellido_materno",
      key: "apellido_materno",
      width: 200,
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      key: "sexo",
      width: 200,
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "fecha_nac",
      key: "fecha_nac",
      width: 200,
    },
    {
      title: "No. de Teléfono",
      dataIndex: "no_tel",
      key: "no_tel",
      width: 200,
    },
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "rfc",
      width: 200,
    },
    {
      title: "Fecha de Inicio",
      dataIndex: "fecha_ini",
      key: "fecha_ini",
      width: 200,
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
  ];

  return (
    <>
      <h1>Catálogo De Empleados</h1>
      <hr />

      <Form
        layout="vertical"
      >
        <Row gutter={10}>
          <Col xs={24} sm={4} md={6}>
            <Form.Item
              label="Filtrar por Nombre"
            >
              <Input.Search
                placeholder="Nombre"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4} md={6}>
            <Form.Item
              label="Filtrar por Apellido"
            >
              <Input.Search
                placeholder="Apellido Paterno"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4} md={6}>
            <Form.Item
              label="Filtrar por Sexo"
            >
              <Select
                placeholder="Sexo"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Button
        type="primary"
        onClick={() => setVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Agregar Empleado
      </Button>
      <Table
        dataSource={empleados}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <Modal
        title={`${isEdit ? "Editar" : "Agregar"} Empleado`}
        open={visible}
        onCancel={onCancel}
        width={"80%"}
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
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="nombre"
                label="Nombre(s)"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setNombres(e.target.value)}
                  value={nombres}
                />
              </Form.Item>
              <Form.Item
                name="apellido_paterno"
                label="Apellido Paterno"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setApellidoPaterno(e.target.value)}
                  value={apellidoPaterno}
                />
              </Form.Item>
              <Form.Item
                name="apellido_materno"
                label="Apellido Materno"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setApellidoMaterno(e.target.value)}
                  value={apellidoMaterno}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="sexo"
                label="Sexo"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Select
                  options={[
                    { value: "Femenino", label: "Femenino" },
                    { value: "Masculino", label: "Masculino" },
                  ]}
                  onChange={(e) => {
                    setSexo(e);
                  }}
                  value={sexo}
                />
              </Form.Item>
              <Form.Item
                name="curp"
                label="CURP"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input onChange={(e) => setCurp(e.target.value)} value={curp} />
              </Form.Item>
              <Form.Item
                name="fecha_nac"
                label="Fecha de Nacimiento"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <DatePicker
                  onChange={(e) => setFechaNac(e.format("DD/MM/YYYY"))}
                  style={{ width: '100%' }}
                  value={fechaNac}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="rfc"
                label="RFC"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input onChange={(e) => setRfc(e.target.value)} value={rfc} />
              </Form.Item>
              <Form.Item
                name="no_tel"
                label="Número de Teléfono"
              >
                <Input
                  onChange={(e) => setNoTel(e.target.value)}
                  value={noTel}
                />
              </Form.Item>
              <Form.Item
                name="fecha_ini"
                label="Fecha de Inicio"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <DatePicker
                  onChange={(e) => setFechaIni(e.format("DD/MM/YYYY"))}
                  style={{ width: '100%' }}
                  value={fechaIni}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
