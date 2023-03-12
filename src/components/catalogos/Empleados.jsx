import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber
} from "antd";

export const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [previousProductData, setPreviousProductData] = useState({});
  const [visible, setVisible] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/empleados')
    .then(response => response.json())
    .then(data => {
      setEmpleados(data);
    })
    .catch(error => console.error(error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/empleados?id=${id}`,
        {
          method: "DELETE",
        }
    ).then((response  => {
      if (response.ok) {
        setEmpleados(empleados.filter((e) => e.id != id));
      }
    }))
    .catch(error => console.error(error));
  }

  const fetchPreviousProductData = (id) => {
    fetch(`http://localhost:3000/empleados?id=${id}`)
    .then(response => response.json())
    .then(data => { setPreviousProductData(data) })
    .catch(error => console.error(error));
  }

  const handleEdit = (id) => {
    setEditingKey(id);
    setVisible(true);
    fetchPreviousProductData(id);
  }

  const handleCancel = () => {
    setEditingKey("");
    setVisible(false);
  }

  const handleCancelAdd = () => {
    setEditingKey("");
    setVisibleAdd(false);
  }

  const handleSave = (key) => {
    const updatedProduct = formRef.current.getFieldsValue();
    fetch(`http://localhost:3000/empleados?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      }
    )
      .then((response) => {
        if (response.ok) {
          const updatedempleados = empleados.map((product) => {
            if (product.key === key) {
              return {
                ...product,
                ...updatedProduct,
              };
            }
            return product;
          });
          setEmpleados(updatedempleados);
          setEditingKey("");
          setVisible(false);
        }
      })
      .catch((error) => console.error(error));
  };

  const formRef = React.createRef();
  const handleAddSave = () => {
    formRef.current.validateFields().then((values) => {
      const newProduct = { ...values };
      fetch(
        `http://localhost:3000/empleados`,
        {
          method: "POST",
          body: JSON.stringify(newProduct),
        }
      )
        .then((response) => {
          if (response.ok) {
            setEmpleados([...empleados, newProduct]);

            setVisibleAdd(false);
          }
        })
        .catch((error) => console.error(error));
    });
  };

  const columns = [
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
      width: 200,
      render: (key, record) => {
        <>
          <Button
            type="primary"
            style={{ marginRight: 16 }}
            onClick={() => handleEdit(key)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de que quieres eliminar este Empleado?"
            onConfirm={() => handleDelete(key)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="danger" style={{ marginRight: 16 }}>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      }
    }
  ];

  return (
    <>
      <h1>Catálogo de Empleados</h1>
      <Button type="primary" onClick={() => setVisibleAdd(true)}>
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
        visible={visibleAdd}
        onCancel={handleCancelAdd}
        footer={[
          <Button key="cancel" onClick={handleCancelAdd}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={handleAddSave}>
            Guardar
          </Button>,
        ]}
      >
        <Form layout="vertical" ref={formRef}>
          <Form.Item
            name="nombre"
            label="Nombre(s)"
            rules={[
              {
                required: true,
                message: "Ingresa el Nombre del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apellido_paterno"
            label="Apellido Paterno"
            rules={[
              {
                required: true,
                message: "Ingresa el Apellido Paterno del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apellido_materno"
            label="Apellido Materno"
            rules={[
              {
                required: true,
                message: "Ingresa el Apellido Materno del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sexo"
            label="Sexo"
            rules={[
              {
                required: true,
                message: "Sexo del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fecha_nac"
            label="Fecha de Nacimiento"
            rules={[
              {
                required: true,
                message: "Ingresa la Fecha de Nacimiento del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="no_tel"
            label="Número de Teléfono"
            rules={[
              {
                required: true,
                message: "Ingresa el Número de Teléfono del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="curp"
            label="CURP"
            rules={[
              {
                required: true,
                message: "Ingresa el CURP del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="rfc"
            label="RFC"
            rules={[
              {
                required: true,
                message: "Ingresa el RFC del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fecha_ini"
            label="Fecha de Inicio"
            rules={[
              {
                required: true,
                message: "Ingresa la Fecha de Inicio del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Editar Empleado"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => handleSave(editingKey)}
          >
            Guardar
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          ref={formRef}
          initialValues={empleados.find(
            (product) => product.key === editingKey
          )}
        >
          <Form.Item
            name="nombre"
            label="Nombre(s)"
            rules={[
              {
                required: true,
                message: "Ingresa el Nombre del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apellido_paterno"
            label="Apellido Paterno"
            rules={[
              {
                required: true,
                message: "Ingresa el Apellido Paterno del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apellido_materno"
            label="Apellido Materno"
            rules={[
              {
                required: true,
                message: "Ingresa el Apellido Materno del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sexo"
            label="Sexo"
            rules={[
              {
                required: true,
                message: "Sexo del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fecha_nac"
            label="Fecha de Nacimiento"
            rules={[
              {
                required: true,
                message: "Ingresa la Fecha de Nacimiento del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="no_tel"
            label="Número de Teléfono"
            rules={[
              {
                required: true,
                message: "Ingresa el Número de Teléfono del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="curp"
            label="CURP"
            rules={[
              {
                required: true,
                message: "Ingresa el CURP del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="rfc"
            label="RFC"
            rules={[
              {
                required: true,
                message: "Ingresa el RFC del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fecha_ini"
            label="Fecha de Inicio"
            rules={[
              {
                required: true,
                message: "Ingresa la Fecha de Inicio del Empleado",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
