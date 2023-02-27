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

export const CatalogoProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [previousProductData, setPreviousProductData] = useState({});
  const [visible, setVisible] = useState(false); //Editar
  const [visibleAdd, setVisibleAdd] = useState(false); //Añadir


  useEffect(() => {
    fetch("https://inventario-prueb-default-rtdb.firebaseio.com/proovedores.json")
      .then((response) => response.json())
      .then((data) => {
        const provedoresArray = [];
        for (const key in data) {
          provedoresArray.push({
            key: key,
            ...data[key],
          });
        }
        setProveedores(provedoresArray);
      })
      .catch((error) => console.error(error));
  }, []);


  const handleDelete = (key) => {
    fetch(
      `https://inventario-prueb-default-rtdb.firebaseio.com/proovedores/${key}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          setProveedores(proveedores.filter((proveedores) => proveedores.key !== key));
        }
      })
      .catch((error) => console.error(error));
  };


  const fetchPreviousProductData = (key) => {
    fetch(
      `https://inventario-prueb-default-rtdb.firebaseio.com/proovedores/${key}.json`
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
      `https://inventario-prueb-default-rtdb.firebaseio.com/proovedores/${key}.json`,
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
          const updatedProducts = proveedores.map((proveedores) => {
            if (proveedores.key === key) {
              return {
                ...proveedores,
                ...updatedProduct,
              };
            }
            return proveedores;
          });
          setProveedores(updatedProducts);
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
        `https://inventario-prueb-default-rtdb.firebaseio.com/proovedores.json`,
        {
          method: "POST",
          body: JSON.stringify(newProduct),
        }
      )
        .then((response) => {
          if (response.ok) {
            setProveedores([...proveedores, newProduct]);

            setVisibleAdd(false);
          }
        })
        .catch((error) => console.error(error));
    });
  };

  const columns = [
   
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Direccion",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Direccion facturacion",
      dataIndex: "direccion_facturacion",
      key: "direccion_facturacion",
    },
    {
      title: "Forma pago",
      dataIndex: "forma_pago",
      key: "forma_pago",
    },
    {
      title: "Nombre Dueño",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
        title: "Nombre Empresa",
        dataIndex: "nombre_empresa",
        key: "nombre_empresa",
      },
      {
        title: "Telefono",
        dataIndex: "telefono",
        key: "telefono",
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
            title="¿Estás seguro de que quieres eliminar este producto?"
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
      <h1>Catálogo de Proveedores</h1>
      <Button type="primary" onClick={() => setVisibleAdd(true)}>
        Agregar Producto
      </Button>

      <Table
        dataSource={proveedores}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <Modal
        title="Agregar Producto"
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
<Form
          layout="vertical"
          ref={formRef}
          initialValues={proveedores.find((proveedores) => proveedores.key === editingKey)}
        >


          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Ingresa el Email",
              },
            ]}
          >
            <Input/>
          </Form.Item>

          
          
          
          <Form.Item
            name="direccion"
            label="Direccion"
            rules={[
              {
                required: true,
                message: "Ingresa la Direccion",
              },
            ]}
          >
            <Input />
          </Form.Item>


          
          
          
          <Form.Item
            name="direccion_facturacion"
            label="Direccion de facturacion"
            rules={[
              {
                required: true,
                message: "Ingresa la Direccion facturacion",
              },
            ]}
          >
            <Input/>
          </Form.Item>
          
          
          
          <Form.Item
            name="forma_pago"
            label="Forma pago"
            rules={[
              {
                required: true,
                message: "Ingresa la Forma pago",
              },
            ]}
          >
            <Input />
          </Form.Item>
          
          
          
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              { required: true, message: "Ingresa el nombre del Dueño" },
            ]}
          >
            <Input />
          </Form.Item>
          
          
          
          <Form.Item
            name="nombre_empresa"
            label="Nombre Empresa"
            rules={[
              {
                required: true,
                message: "Ingresa el precio de venta del producto",
              },
            ]}
          >
            <Input/>
          </Form.Item>
          
          
          
          <Form.Item
            name="telefono"
            label="Telefono"
            rules={[
              {
                required: true,
                message: "Ingresa el Numero de telefono",
              },
            ]}
          >
            <Input />
          </Form.Item>


        </Form>
      </Modal>




      <Modal
        title="Editar Producto"
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
          initialValues={proveedores.find((proveedores) => proveedores.key === editingKey)}
        >


          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Ingresa el Email",
              },
            ]}
          >
            <Input/>
          </Form.Item>

          
          
          
          <Form.Item
            name="direccion"
            label="Direccion"
            rules={[
              {
                required: true,
                message: "Ingresa la Direccion",
              },
            ]}
          >
            <Input />
          </Form.Item>


          
          
          
          <Form.Item
            name="direccion_facturacion"
            label="Direccion de facturacion"
            rules={[
              {
                required: true,
                message: "Ingresa la Direccion facturacion",
              },
            ]}
          >
            <Input/>
          </Form.Item>
          
          
          
          <Form.Item
            name="forma_pago"
            label="Forma pago"
            rules={[
              {
                required: true,
                message: "Ingresa la Forma pago",
              },
            ]}
          >
            <Input />
          </Form.Item>
          
          
          
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              { required: true, message: "Ingresa el nombre del Dueño" },
            ]}
          >
            <Input />
          </Form.Item>
          
          
          
          <Form.Item
            name="nombre_empresa"
            label="Nombre Empresa"
            rules={[
              {
                required: true,
                message: "Ingresa el precio de venta del producto",
              },
            ]}
          >
            <Input/>
          </Form.Item>
          
          
          
          <Form.Item
            name="telefono"
            label="Telefono"
            rules={[
              {
                required: true,
                message: "Ingresa el Numero de telefono",
              },
            ]}
          >
            <Input />
          </Form.Item>


        </Form>
      </Modal>
    </>
  );
};
