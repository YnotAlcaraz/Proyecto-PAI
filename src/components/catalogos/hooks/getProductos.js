export const getProductos = async () => {
  fetch('https://inventario-prueb-default-rtdb.firebaseio.com/products.json')
    .then(resp => resp.json())
    .then(resp => console.log(resp))
}
