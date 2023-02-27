import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";

export const CatalogoEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [previousProductData, setPreviousProductData] = useState({});
  const [visible, setVisible] = useState(false); //Editar
  const [visibleAdd, setVisibleAdd] = useState(false); //Añadir

  useEffect(() => {
    fetch("https://inventario-prueb-default-rtdb.firebaseio.com/empleados.json")
      .then((response) => response.json())
      .then((data) => {
        const productArray = [];
        for (const key in data) {
          productArray.push({
            key: key,
            ...data[key],
          });
        }
        setEmpleados(productArray);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = (key) => {
    fetch(
      `https://inventario-prueb-default-rtdb.firebaseio.com/empleados/${key}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          setEmpleados(empleados.filter((product) => product.key !== key));
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchPreviousProductData = (key) => {
    fetch(
      `https://inventario-prueb-default-rtdb.firebaseio.com/empleados/${key}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        setPreviousProductData(data);
      })
      .catch((error) => console.error(error));
  };

  const handleEdit = (key) => {
    setEditingKey(key);
    setVisible(true);
    fetchPreviousProductData(key);
  };

  const handleCancel = () => {
    setEditingKey("");
    setVisible(false);
  };
  const handleCancelAdd = () => {
    setEditingKey("");
    setVisibleAdd(false);
  };

  const handleSave = (key) => {
    const updatedProduct = formRef.current.getFieldsValue();
    fetch(
      `https://inventario-prueb-default-rtdb.firebaseio.com/empleados/${key}.json`,
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
        `https://inventario-prueb-default-rtdb.firebaseio.com/empleados.json`,
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
        title: 'Nombre(s)',
        dataIndex: 'nombre',
        key: 'nombre',
    },
    {
        title: 'A. Paterno',
        dataIndex: 'apellido_paterno',
        key: 'apellido_paterno',
    },
    {
        title: 'A. Materno',
        dataIndex: 'apellido_materno',
        key: 'apellido_materno',
    },
    {
        title: 'Sexo',
        dataIndex: 'sexo',
        key: 'sexo',
    },
    {
        title: 'Fecha de Nacimiento',
        dataIndex: 'fecha_nac',
        key: 'fecha_nac',
    },
    {
        title: 'No. de Teléfono',
        dataIndex: 'no_tel',
        key: 'no_tel',
    },
    {
        title: 'CURP',
        dataIndex: 'curp',
        key: 'curp',
    },
    {
        title: 'RFC',
        dataIndex: 'rfc',
        key: 'rfc',
    },
    {
        title: 'Fecha de Inicio',
        dataIndex: 'fecha_ini',
        key: 'fecha_ini',
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
      ),
    },
  ];
  return (
    <>
      <h1>Catálogo de Empleados</h1>
      <Button type="primary" onClick={() => setVisibleAdd(true)}>
        Agregar Empleado
      </Button>

      <Table
        dataSource={empleados}
        columns={columns}
        pagination={{ pageSize: 5 }}
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
              { required: true,
                message: "Ingresa la Fecha de Nacimiento del Empleado" },
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
                }
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
                    message: "Ingresa la Fecha de Inicio del Empleado"
                }
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
          initialValues={empleados.find((product) => product.key === editingKey)}
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
              { required: true,
                message: "Ingresa la Fecha de Nacimiento del Empleado" },
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
                }
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
                    message: "Ingresa la Fecha de Inicio del Empleado"
                }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
