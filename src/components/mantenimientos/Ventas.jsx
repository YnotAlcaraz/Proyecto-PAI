import React, { useState, useEffect } from "react";
import { Input, Button, List, Typography } from "antd";
import axios from "axios";

const { Text } = Typography;

export const Ventas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalVenta, setTotalVenta] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(
        `http://localhost:3000/productos?q=${searchQuery}`
      );
      setSearchResults(response.data);
    };

    if (searchQuery) {
      fetchProducts();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleAddToCart = (product, quantity) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.product.nombre === product.nombre
    );

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { product, quantity }]);
    }

    setTotalVenta(totalVenta + product.precio_de_venta * quantity);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRemoveFromCart = (product) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.product.nombre !== product.nombre
    );
    setCartItems(updatedCartItems);

    const itemToRemove = cartItems.find(
      (item) => item.product.nombre === product.nombre
    );
    if (itemToRemove) {
      setTotalVenta(
        totalVenta -
          itemToRemove.product.precio_de_venta * itemToRemove.quantity
      );
    }
  };

  const handleQuantityChange = (product, quantity) => {
    const updatedCartItems = [...cartItems];
    const existingItemIndex = updatedCartItems.findIndex(
      (item) => item.product.nombre === product.nombre
    );
    if (existingItemIndex !== -1) {
      const itemToUpdate = updatedCartItems[existingItemIndex];
      const prevItemCost =
        itemToUpdate.product.precio_de_venta * itemToUpdate.quantity;
      const newItemCost = itemToUpdate.product.precio_de_venta * quantity;
      setTotalVenta(totalVenta - prevItemCost + newItemCost);
      itemToUpdate.quantity = quantity;
      setCartItems(updatedCartItems);
    }
  };

  const handleRealizarVenta = async () => {
    const fechaVenta = new Date().toLocaleDateString();
    const venta = {
      fechaVenta,
      totalVenta,
      productos: cartItems.map((item) => ({
        idProducto: item.product.id,
        nombre: item.product.nombre,
        cantidad: item.quantity,
      })),
    };

    try {
      const response = await axios.post("http://localhost:3000/ventas", venta);
      setCartItems([]);
      setTotalVenta(0);
      message.success("Venta realizada exitosamente");
    } catch (error) {
      console.error(error);
      message.error("Error al realizar la venta");
    }
  };

  return (
    <div>
      <h1>Registro De Ventas</h1>
      <hr />
      <div style={{ marginBottom: "16px" }}>
        <Input
          placeholder="Buscar producto"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%" }}>
          <List
            dataSource={searchResults}
            renderItem={(item) => (
              <List.Item
                style={{ cursor: "pointer" }}
                onClick={() => handleAddToCart(item, 1)}
              >
                <Text strong>{item.nombre}</Text> -{" "}
                <Text type="secondary">
                  Precio de venta: ${item.precio_de_venta}
                </Text>
              </List.Item>
            )}
          />
        </div>
        <div style={{ width: "50%" }}>
          <div>
            {cartItems.map((item) => (
              <div key={item.product.nombre}>
                <div>
                  <Text strong>{item.product.nombre}</Text> -{" "}
                  <Text type="secondary">
                    Precio de venta: ${item.product.precio_de_venta}
                  </Text>{" "}
                  - <Text type="secondary">Cantidad: {item.quantity}</Text>{" "}
                  <a onClick={() => handleRemoveFromCart(item.product)}>
                    Eliminar
                  </a>
                  <br />
                  <Text type="secondary">
                    Precio total: $
                    {item.product.precio_de_venta * item.quantity}
                  </Text>
                  <br />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.product,
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <hr />
              </div>
            ))}
            {cartItems.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <Text strong>
                  Total: $
                  {cartItems.reduce(
                    (total, item) =>
                      total + item.product.precio_de_venta * item.quantity,
                    0
                  )}
                </Text>
                <br />
                <Button type="primary" onClick={handleRealizarVenta}>
                  Realizar venta
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
