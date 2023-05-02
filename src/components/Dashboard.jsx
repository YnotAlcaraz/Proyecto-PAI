import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import axios from "axios";

export const Dashboard = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ventasProductos, setVentasProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [ventasRes, productosRes, categoriasRes, ventasProductosRes] =
        await Promise.all([
          axios.get("http://localhost:3000/ventas"),
          axios.get("http://localhost:3000/productos"),
          axios.get("http://localhost:3000/categorias"),
          axios.get("http://localhost:3000/ventas_productos"),
        ]);
      setVentas(ventasRes.data);
      setProductos(productosRes.data);
      setCategorias(categoriasRes.data);
      setVentasProductos(ventasProductosRes.data);
    };
    fetchData();
  }, []);

  const getTotalVentas = () => {
    return ventas.length;
  };

  const getTotalIngresos = () => {
    let ingresos = 0;

    ventasProductos.forEach((ventaProducto) => {
      const producto = productos.find(
        (p) => p.id === ventaProducto.id_del_producto
      );
      if (producto) {
        ingresos += producto.precio_de_venta * ventaProducto.cantidad;
      }
    });

    return ingresos;
  };

  const getTotalProductos = () => {
    return productos.length;
  };

  const getTotalCategorias = () => {
    return categorias.length;
  };

  const getVentasPorProducto = () => {
    const ventasPorProducto = [];

    ventasProductos.forEach((ventaProducto) => {
      const index = ventasPorProducto.findIndex(
        (vpp) => vpp.id === ventaProducto.id_del_producto
      );
      if (index !== -1) {
        ventasPorProducto[index].cantidad += ventaProducto.cantidad;
      } else {
        ventasPorProducto.push({
          id: ventaProducto.id_del_producto,
          cantidad: ventaProducto.cantidad,
        });
      }
    });

    return ventasPorProducto;
  };

  const getProductosMasVendidos = () => {
    const ventasPorProducto = getVentasPorProducto();

    const productosMasVendidos = productos.filter((producto) =>
      ventasPorProducto.some(
        (ventaProducto) => ventaProducto.id === producto.id
      )
    );

    productosMasVendidos.forEach((producto) => {
      const ventaProducto = ventasPorProducto.find(
        (vp) => vp.id === producto.id
      );
      if (ventaProducto) {
        producto.cantidad = ventaProducto.cantidad;
      }
    });

    return productosMasVendidos.sort((a, b) => b.cantidad - a.cantidad);
  };

  const productosMasVendidos = getProductosMasVendidos().slice(0, 5);

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={6}>
          <Card title="Ventas Totales" bordered={false}>
            <p>{getTotalVentas()}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Ingresos por Ventas" bordered={false}>
            <p>{getTotalIngresos()}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Productos en Venta" bordered={false}>
            <p>{getTotalProductos()}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Categorías" bordered={false}>
            <p>{getTotalCategorias()}</p>
          </Card>
        </Col>
      </Row>
      <br />
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Productos más vendidos" bordered={false}>
            <ol>
              {getProductosMasVendidos().map((producto) => (
                <li key={producto.id}>
                  {producto.nombre} - Cantidad vendida: {producto.cantidad}
                </li>
              ))}
            </ol>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
