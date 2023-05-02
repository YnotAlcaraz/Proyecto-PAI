import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import axios from "axios";
import Chart from 'chart.js/auto';
import moment from 'moment';

export const Dashboard = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ventasProductos, setVentasProductos] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({
    // Opciones del gráfico
  });

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



  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventasResponse = await fetch('http://localhost:3000/ventas');
        const ventasData = await ventasResponse.json();
  
        const ventasProductosResponse = await fetch('http://localhost:3000/ventas_productos');
        const ventasProductosData = await ventasProductosResponse.json();
  
        const productosResponse = await fetch('http://localhost:3000/productos');
        const productosData = await productosResponse.json();
  
        const today = moment();
        const lastWeek = today.clone().subtract(6, 'days');
        const dates = [];
        
        // Construimos un array con las fechas de los últimos 7 días en formato DD/MM/YYYY
        for (let i = 0; i < 7; i++) {
          const date = lastWeek.clone().add(i, 'days');
          const formattedDate = date.format('DD/MM/YYYY');
          dates.push(formattedDate);
        }
        
        const data = [];
        
        for (let i = 0; i < dates.length; i++) {
          const date = moment(dates[i], 'DD/MM/YYYY');
          const ventasEnFecha = ventasData.filter(venta => moment(venta.fecha_venta, 'DD/MM/YYYY').isSame(date, 'day'));
          const productosEnVentas = ventasProductosData.filter(vp => ventasEnFecha.find(v => v.id === vp.idVenta));
          const gananciasEnFecha = productosEnVentas.reduce((total, vp) => {
            const producto = productosData.find(p => p.codigo_de_barras === vp.codigo_de_barras);
            return total + vp.cantidad * producto.precio_de_venta;
          }, 0);
          data.push(gananciasEnFecha);
          console.log(`Ganancias en fecha ${date.format('DD/MM/YYYY')}: ${gananciasEnFecha}`);
        }
        

        const colors = [];
for (let i = 0; i < 7; i++) {
  const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
  colors.push(randomColor);
}

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Ganancias',
              data: data,
              fill: true,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: colors,

              tension: 0.1
            }
          ]
        });
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  useEffect(() => {
    if (chartData) {
      const chart = new Chart('myChart', {
        type: 'bar',
        data: chartData,
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Ventas últimos 7 días',
              font: {
                size: 24
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      return () => {
        chart.destroy();
      };
    }
  }, [chartData]);







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
      <div>
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
    </div>
    
  );
};
