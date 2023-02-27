import { useEffect, useState } from "react";

export const useCatalogoProductos = () => {
    const [products, setProducts] = useState([]);

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
  
    const columnsProductos = [
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
        /* render: (text, record) => (
          <img src={text} alt={record.nombre} style={{maxWidth: '100px'}}/> 
        ) */
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
    ];

    return {
        products,
        columnsProductos
    }
}
