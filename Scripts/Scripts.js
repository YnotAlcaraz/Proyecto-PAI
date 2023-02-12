console.log('Conectado a Scripts.js');

//const sidebar = document.querySelector('.sidebar');
const sidebar = document.getElementById('sidebar');
const administracion = document.getElementById('administracion');
const inventario = document.getElementById('inventario');
const ventas = document.getElementById('ventas');
const reportes = document.getElementById('reportes');


const onClick = () => {
    console.log('click en menu');
    sidebar.classList.toggle('visible');
    
}

const onClickAdministracion = () => {
    administracion.classList.toggle('administracion');
    console.log('click en administracion');
}

const onClickInventario = () => {
    inventario.classList.toggle('inventario');
}

const onClickVentas = () => {
    ventas.classList.toggle('ventas');
}

const onClickReportes = () => {
    reportes.classList.toggle('reportes');
}



