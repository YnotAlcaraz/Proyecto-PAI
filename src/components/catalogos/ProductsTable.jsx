import React, { useState, useEffect } from 'react';

function ProductsTable() {
  
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    codigo_de_barras: '',
    descripcion: '',
    existencia_en_inventario: '',
    imagen_del_producto: '',
    nombre: '',
    precio_de_venta: '',
    unidad_de_medida: ''
  });

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

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('https://inventario-prueb-default-rtdb.firebaseio.com/products.json', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setProducts([
          ...products,
          {
            id: data.name,
            ...formData
          }
        ]);
        setFormData({
          codigo_de_barras: '',
          descripcion: '',
          existencia_en_inventario: '',
          imagen_del_producto: '',
          nombre: '',
          precio_de_venta: '',
          unidad_de_medida: ''
        });
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
       <h1>Tipos de Producto</h1>
      <div className="container">
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

      <div className='container mt-4'>
        
      
      <h2>Add Product</h2>
<form onSubmit={handleSubmit}>

<div className="mb-3 ">
  <label htmlFor="codigo_de_barras">Código de Barras:</label>
  <input type="text" id="codigo_de_barras" name="codigo_de_barras" value={formData.codigo_de_barras} onChange={handleChange} />
</div>

<div className="mb-3">
  <label htmlFor="descripcion">Descripción:</label>
  <input type="text" id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} />
  </div>

  <div className="mb-3">
  <label htmlFor="existencia_en_inventario">Existencia en Inventario:</label>
  <input type="number" id="existencia_en_inventario" name="existencia_en_inventario" value={formData.existencia_en_inventario} onChange={handleChange} />
  </div>

  <div className="mb-3">
  <label htmlFor="imagen_del_producto">Imagen del Producto:</label>
  <input type="text" id="imagen_del_producto" name="imagen_del_producto" value={formData.imagen_del_producto} onChange={handleChange} />
  </div>

  <div className="mb-3">
  <label htmlFor="nombre">Nombre:</label>
  <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
  </div>

  <div className="mb-3">
  <label htmlFor="precio_de_venta">Precio de Venta:</label>
  <input type="number" id="precio_de_venta" name="precio_de_venta" value={formData.precio_de_venta} onChange={handleChange} />
  </div>

  <div className="mb-3">
  <label htmlFor="unidad_de_medida">Unidad de Medida:</label>
  <input type="text" id="unidad_de_medida" name="unidad_de_medida" value={formData.unidad_de_medida} onChange={handleChange} />
  </div>
  <button type="submit">Agregar</button>


</form>
</div>
</div>
);
}
export default ProductsTable;