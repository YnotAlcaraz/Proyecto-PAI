export const getProductos = async () => {
  /* const url = 'https://inventario-prueb-default-rtdb.firebaseio.com/products.json';
  const resp = await fetch(url);
  const { data } = await resp.json();
  const productos = data.map((e) => {
    console.log(e);
  });

  return productos; */
  fetch('https://inventario-prueb-default-rtdb.firebaseio.com/products.json')
    .then(resp => resp.json())
    .then(resp => console.log(resp))
}
