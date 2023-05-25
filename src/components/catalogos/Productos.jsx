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
  InputNumber,
} from "antd";
import axios from "axios";
import { render } from "react-dom";
import ForwardTable from "antd/es/table/Table";

export const Productos = () => {
  const url = "http://localhost:3000/productos";
  const urlCategorias = "http://localhost:3000/categorias"
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState();
  const [visible, setVisible] = useState(false);
  const [iden, setIden] = useState();
  const [codBarras, setCodBarras] = useState();
  const [nomb, setNomb] = useState();
  const [desc, setDesc] = useState();
  const [img, setImg] = useState();
  const [precio, setPrecio] = useState();
  const [cantidad, setCantidad] = useState(0);
  const [categoria, setCategoria] = useState();
  const [categorias, setCategorias] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [dataFiltrada, setDataFiltrada] = useState([]);
  const [dataFiltrada2, setDataFiltrada2] = useState([]);
  const [activeTable, setActiveTable] = useState('');
  const [productosFiltered, setProductosFiltered] = useState([]);

  const fetchProductos = () => {
    axios
      .get(url)
      .then((res) => {
        setProductos(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProductos();
    axios
      .get(urlCategorias)
      .then((res) => {
        setCategorias(res.data);
      })
      .catch((err) => console.error(err));
  }, [isLoading]);


  const optionsCategorias = categorias?.map(x => {
    return {
      value: x.id,
      label: x.descripcion
    }
  });

  


  const onEdit = async (id) => {
    setIsEdit(true);
    setVisible(true);
    form.resetFields();
    setProductoId(id)
    const _producto = await axios
      .get(`${url}/${id}`)
      .then((res) => res.data)
      .catch((err) => console.error(err));
      form.setFieldsValue(_producto);
  };

  const onFinish = () => {
    const _producto = form.getFieldsValue();
    if (_producto.cantidad && _producto.categoria && _producto.codigo_de_barras  && _producto.descripcion && _producto.imagen_del_producto && _producto.nombre && _producto.precio_de_venta) {
      //POST
      if (!isEdit) {
        setIsLoading(true);
        axios
          .post(url, _producto)
          .then(() => {
            setIsLoading(false);
            setVisible(false);
            fetchProductos();
            form.resetFields();
          })
          .catch((err) => console.error(err));
      } else {
        //PATCH
        axios.patch(`${url}/${productoId}`, _producto).then(() => {
          setIsEdit(false);
          setIsLoading(false);
          setVisible(false);
          fetchProductos();
          form.resetFields();
        })
      }
    } else {
      alert("Por Favor Llene Los Campos Requeridos");
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

  const onCancel = () => {
    setIsEdit(false);
    setVisible(false);
  };

  const fetchData = async (value) => {
    try{
      const resp = await axios.get(url)
      const filteredData = resp.data.filter(item => item.nombre.toLowerCase().includes(searchValue.toLowerCase()));
      const filteredData2 = resp.data.filter(item => item.codigo_de_barras == searchValue2);
    
      // setOptions(filteredData3);
      setDataFiltrada(filteredData);
      setDataFiltrada2(filteredData2);
      console.log('Search:', filteredData);
      console.log(filteredData2);
      

    } catch (error){
      console.error('Error al obtener los productos', error);
    }
  }


  const onChangeCategoria = (value) => {
    const _productosFiltered = productos?.filter((e) => e.categoria === value);
    setProductosFiltered(_productosFiltered);
    setActiveTable('table3');
  }


  //EVENTOS BUSQUEDA POR ID
  const handleSearchId = () => {
    fetchData(searchValue2);
    setActiveTable('table2');
  }
  
  const handleKeyPressId = (e) => {
    if (e.key === 'Enter') {
      
      handleSearchId();
    }
  };

  const handleInputChangeId = (e) => {
    const value = e.target.value;
    setSearchValue2(value);
  
    if (value === ''){
      setDataFiltrada2([]);
      setActiveTable('');
    }
  }


  //EVENTOS BUSQUEDA POR NOMBRE
  const handleSearchNombre = () => {
    fetchData(searchValue);
    setActiveTable('table1');
  }
  
  const handleKeyPressNombre = (e) => {
    if (e.key === 'Enter') {
      handleSearchNombre();
    }
  };

  const handleInputChangeNombre = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  
    if (value === ''){
      setDataFiltrada([]);
      setActiveTable('');
    }
  }


  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Código De Barras",
      dataIndex: "codigo_de_barras",
      key: "codigo_de_barras",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Imagen Del Producto",
      dataIndex: "imagen_del_producto",
      key: "imagen_del_producto",
      render: (text, record) => (
        <img src={text} alt={record.nombre} style={{ maxHeight: "100px" }} />
      ),
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      render: (val) => categorias?.find(e => e.id === val)?.descripcion,
    },
    {
      title: "Precio De Venta",
      dataIndex: "precio_de_venta",
      key: "precio_de_venta",
      render: (val) => `$ ${val}`,
    },
    {
      title: "Cantidad En Stock",
      dataIndex: "cantidad",
      key: "cantidad"
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
      <h1>Inventario</h1>
      <hr />
      <Form
        layout="vertical"
      >
        <Row gutter={10}>
          <Col xs={24} sm={4} md={6}>
            <Form.Item
              label="Filtrar por codigo de barras"
            >
              <Input.Search
                placeholder="Codigo de barras"
                enterButton="Buscar"
                value={searchValue2}
                onChange={handleInputChangeId}
                onKeyPress={handleKeyPressId}
                onSearch={handleSearchId}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4} md={6}>
            <Form.Item
              label="Filtrar por nombre del producto"
            >
              <Input.Search
                placeholder="Nombre del producto"
                enterButton="Buscar"
                value={searchValue}
                onChange={handleInputChangeNombre}
                onKeyPress={handleKeyPressNombre}
                onSearch={handleSearchNombre}
              />
             
            </Form.Item>
          </Col>
          <Col xs={24} sm={4} md={6}>
            <Form.Item
              label="Filtrar por Categoría"
            >
              <Select
                placeholder="Categoría"
                options={optionsCategorias}
                onChange={onChangeCategoria}
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
        Agregar Producto
      </Button>
      
      
      {activeTable === '' && (
        <Table dataSource={productos} columns={columns} rowKey="key" />
      )}

      {activeTable === 'table1' && (
        <Table dataSource={dataFiltrada} columns={columns} rowKey="key" />
      )}

      {activeTable === 'table2' && (
        <Table dataSource={dataFiltrada2} columns={columns} rowKey="key" />
      )}

      {activeTable === 'table3' && (
        <Table dataSource={productosFiltered} columns={columns} rowKey="key" />
      )}


      {/* {searchValue2 !== '' && dataFiltrada2.length > 0 ? (
        <Table dataSource={dataFiltrada2} columns={columns} rowKey="key" />
        ) : (
        <Table dataSource={productos} columns={columns} rowKey="key"/>
      )} */}
      
      <Modal
        title={`${isEdit ? "Editar" : "Agregar"} Producto`}
        open={visible}
        onCancel={onCancel}
        width={"70%"}
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
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="codigo_de_barras"
                label="Código De Barras"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setCodBarras(e.target.value)}
                  value={codBarras}
                />
              </Form.Item>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input onChange={(e) => setNomb(e.target.value)} value={nomb} />
              </Form.Item>
              <Form.Item
                name="descripcion"
                label="Descripción"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requierido",
                  },
                ]}
              >
                <Input onChange={(e) => setDesc(e.target.value)} value={desc} />
              </Form.Item>
              <Form.Item
                name="imagen_del_producto"
                label="Imagen Del Producto"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <Input onChange={(e) => setImg(e.target.value)} value={img} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="precio_de_venta"
                label="Precio De Venta"
                rules={[
                  {
                    required: true,
                    message: "Este Campo Es Requerido",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  onChange={(e) => setPrecio(e.target.value)}
                  value={precio}
                />
              </Form.Item>
              <Form.Item
                name="cantidad"
                label="Cantidad En Stock"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  onChange={(e) => setCantidad(e.target.value)}
                  value={cantidad}
                />
              </Form.Item>
              <Form.Item
                name="categoria"
                label="Categoría"
                rules={[{
                  required: true,
                  message: "Este Campo Es Requerido"
                }]}
              >
                <Select 
                  options={optionsCategorias}
                  onChange={e => setCategoria(e)}
                  value={categoria}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
