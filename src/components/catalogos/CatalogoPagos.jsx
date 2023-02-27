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

export const CatalogoPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [previousProductData, setPreviousProductData] = useState({});
  const [visible, setVisible] = useState(false); //Editar
  const [visibleAdd, setVisibleAdd] = useState(false); //Añadir

  useEffect(() => {
    fetch("https://inventario-prueb-default-rtdb.firebaseio.com/pagos.json")
      .then((response) => response.json())
      .then((data) => {
        const productArray = [];
        for (const key in data) {
          productArray.push({
            key: key,
            ...data[key],
          });
        }
        setPagos(productArray);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = (key) => {
    fetch(
      `https://inventario-prueb-default-rtdb.firebaseio.com/pagos/${key}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          setPagos(pagos.filter((product) => product.key !== key));
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchPreviousProductData = (key) => {
    fetch(
      `https://inventario-prueb-default-rtdb.firebaseio.com/pagos/${key}.json`
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
      `https://inventario-prueb-default-rtdb.firebaseio.com/pagos/${key}.json`,
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
          const updatedpagos = pagos.map((product) => {
            if (product.key === key) {
              return {
                ...product,
                ...updatedProduct,
              };
            }
            return product;
          });
          setPagos(updatedpagos);
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
        `https://inventario-prueb-default-rtdb.firebaseio.com/pagos.json`,
        {
          method: "POST",
          body: JSON.stringify(newProduct),
        }
      )
        .then((response) => {
          if (response.ok) {
            setPagos([...pagos, newProduct]);

            setVisibleAdd(false);
          }
        })
        .catch((error) => console.error(error));
    });
  };

  const columns = [
    {
        title: 'Método de pago',
        dataIndex: 'descripcion',
        key: 'descripcion'
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
      <h1>Catálogo de Pagos</h1>
      <Button type="primary" onClick={() => setVisibleAdd(true)}>
        Agregar Método de Pago
      </Button>

      <Table
        dataSource={pagos}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <Modal
        title="Agregar Método de Pago"
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
            name="descripcion"
            label="Descripción"
            rules={[
              {
                required: true,
                message: "Ingresa la Descripción del Método de Pago",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Editar Método de Pago"
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
        <Form layout="vertical" ref={formRef}>
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[
              {
                required: true,
                message: "Ingresa la Descripción del Método de Pago",
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
