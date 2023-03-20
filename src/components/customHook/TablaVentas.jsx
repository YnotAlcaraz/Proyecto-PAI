import { useEffect, useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";

function TablaVentas() {
  const [data, setData] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchFecha, setSearchFecha] = useState("");
  const [searchProducto, setSearchProducto] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/ventas/")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Fecha de venta",
      dataIndex: "fechaVenta",
      key: "fechaVenta",
    },
    {
      title: "Total de venta",
      dataIndex: "totalVenta",
      key: "totalVenta",
    },
    {
      title: "Producto",
      dataIndex: "productos",
      key: "productos",
      render: (productos) => (
        <>
          {productos.map((producto) => (
            <p key={producto.idProducto}>{producto.nombre}</p>
          ))}
        </>
      ),
    },
    {
      title: "Cantidad",
      dataIndex: "productos",
      key: "cantidad",
      render: (productos) => (
        <>
          {productos.map((producto) => (
            <p key={producto.idProducto}>{producto.cantidad}</p>
          ))}
        </>
      ),
    },
  ];

  const handleIdSearch = (e) => {
    const searchText = e.target.value;
    setSearchId(searchText);

    const filteredData = data.filter((item) => {
      return item.id.toString().includes(searchText);
    });

    setFilteredData(filteredData);
  };

  const handleFechaSearch = (e) => {
    const searchText = e.target.value;
    setSearchFecha(searchText);

    const filteredData = data.filter((item) => {
      return item.fechaVenta.includes(searchText);
    });

    setFilteredData(filteredData);
  };

  const handleProductoSearch = (e) => {
    const searchText = e.target.value;
    setSearchProducto(searchText);

    const filteredData = data.filter((item) => {
      return item.productos.some((producto) =>
        producto.nombre.includes(searchText)
      );
    });

    setFilteredData(filteredData);
  };

  return (
    <>
      <Input.Search
        placeholder="Buscar Por ID"
        onChange={handleIdSearch}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Input.Search
        placeholder="Buscar Por Fecha"
        onChange={handleFechaSearch}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Input.Search
        placeholder="Buscar Por Producto"
        onChange={handleProductoSearch}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={filteredData} />
    </>
  );
}

export default TablaVentas;
