import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, InputNumber } from 'antd';

function Sexo() {
  const [products, setProducts] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('https://inventario-prueb-default-rtdb.firebaseio.com/products.json')
      .then(response => response.json())
      .then(data => {
        const productArray = [];
        for (const key in data) {
          productArray.push({
            key: key,
            ...data[key]
          });
        }
        setProducts(productArray);
      })
      .catch(error => console.error(error));
  }, []);

  const handleDelete = (key) => {
    fetch(`https://inventario-prueb-default-rtdb.firebaseio.com/products/${key}.json`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          setProducts(products.filter(product => product.key !== key));
        }
      })
      .catch(error => console.error(error));
  }

  const handleEdit = (key) => {
    setEditingKey(key);
    setVisible(true);
  }

  const handleCancel = () => {
    setEditingKey('');
    setVisible(false);
  }

  const handleSave = (key) => {
    const updatedProduct = formRef.current.getFieldsValue();
    fetch(`https://inventario-prueb-default-rtdb.firebaseio.com/products/${key}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    })
      .then(response => {
        if (response.ok) {
          const updatedProducts = products.map(product => {
            if (product.key === key) {
              return {
                ...product,
                ...updatedProduct
              };
            }
            return product;
          });
          setProducts(updatedProducts);
          setEditingKey('');
          setVisible(false);
        }
      })
      .catch(error => console.error(error));
  }

  const formRef = React.createRef();

  const columns = [
    {
      title: 'Código de Barras',
      dataIndex: 'codigo_de_barras',
      key: 'codigo_de_barras'
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion'
    },
    {
      title: 'Existencia en Inventario',
      dataIndex: 'existencia_en_inventario',
      key: 'existencia_en_inventario'
    },
    {
      title: 'Imagen del Producto',
      dataIndex: 'imagen_del_producto',
      key: 'imagen_del_producto',
      render: (text, record) => (
        <img src={text} alt={record.nombre} style={{maxWidth: '100px'}}/>
      )
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre'
    },
    {
      title: 'Precio de Venta',
      dataIndex: 'precio_de_venta',
      key: 'precio_de_venta'
    },
    {
      title: 'Unidad de Medida',
      dataIndex: 'unidad_de_medida',
      key: 'unidad_de_medida'
    },
    {
      title: 'Acciones',
      dataIndex: 'key',
      key: 'acciones',
      render: (key, record) => (
        <>
          <Button type="primary" style={{ marginRight: 16 }} onClick={() => handleEdit(key)}>Editar</Button>
          <Popconfirm
            title="¿Estás seguro de que quieres eliminar este producto?"
            onConfirm={() => handleDelete(key)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="danger" style={{ marginRight: 16 }}>Eliminar</Button>
          </Popconfirm>
        </>
      )
    }
  ];
  return (
    <>
    
    <Table
    dataSource={products}
    columns={columns}
    pagination={{ pageSize: 5 }}
    rowKey="key"
    />
    <Modal
    title="Editar Producto"
    visible={visible}
    onCancel={handleCancel}
    footer={[
    <Button key="cancel" onClick={handleCancel}>
    Cancelar
    </Button>,
    <Button key="save" type="primary" onClick={() => handleSave(editingKey)}>
    Guardar
    </Button>
    ]}
    >
    <Form layout="vertical" ref={formRef}>
    <Form.Item
    name="codigo_de_barras"
    label="Código de Barras"
    rules={[{ required: true, message: 'Ingresa el código de barras del producto' }]}
    >
    <InputNumber min={1} />
    </Form.Item>
    <Form.Item
    name="descripcion"
    label="Descripción"
    rules={[{ required: true, message: 'Ingresa la descripción del producto' }]}
    >
    <Input />
    </Form.Item>
    <Form.Item
    name="existencia_en_inventario"
    label="Existencia en Inventario"
    rules={[{ required: true, message: 'Ingresa la existencia en inventario del producto' }]}
    >
    <InputNumber min={1} />
    </Form.Item>
    <Form.Item
    name="imagen_del_producto"
    label="Imagen del Producto"
    rules={[{ required: true, message: 'Ingresa la URL de la imagen del producto' }]}
    >
    <Input />
    </Form.Item>
    <Form.Item
    name="nombre"
    label="Nombre"
    rules={[{ required: true, message: 'Ingresa el nombre del producto' }]}
    >
    <Input />
    </Form.Item>
    <Form.Item
    name="precio_de_venta"
    label="Precio de Venta"
    rules={[{ required: true, message: 'Ingresa el precio de venta del producto' }]}
    >
    <InputNumber min={1} />
    </Form.Item>
    <Form.Item
    name="unidad_de_medida"
    label="Unidad de Medida"
    rules={[{ required: true, message: 'Ingresa la unidad de medida del producto' }]}
    >
    <Input />
    </Form.Item>
    </Form>
    </Modal>
    </>
    );
    }
    export default Sexo;  