import React, { useState, useEffect } from 'react';

function ProductsTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://inventario-prueb-default-rtdb.firebaseio.com/products.json')
      .then(response => response.json())
      .then(data => {
        const productArray = [];
        for (const key in data) {
          productArray.push({
            id: key,
            ...data[key]
          });
        }
        setProducts(productArray);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container">
      <h2 className="mt-3 mb-3">Products Table</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Código de Barras</th>
            <th>Descripción</th>
            <th>Existencia en Inventario</th>
            <th>Imagen del Producto</th>
            <th>Nombre</th>
            <th>Precio de Venta</th>
            <th>Unidad de Medida</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.codigo_de_barras}</td>
              <td>{product.descripcion}</td>
              <td>{product.existencia_en_inventario}</td>
              <td>
                <img src={product.imagen_del_producto} alt={product.nombre} width="100px" className="img-thumbnail" />
              </td>
              <td>{product.nombre}</td>
              <td>{product.precio_de_venta}</td>
              <td>{product.unidad_de_medida}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsTable;
