import { Navigate, Route, Routes } from 'react-router-dom'
import { CatalogoPagos } from './components/catalogos/CatalogoPagos'
import { CatalogoProductos } from './components/catalogos/CatalogoProductos'
import { Navbar } from './components/Navbar'

export const App = () => {

  return (
    <>
        <Navbar/>
        <Routes>

            <Route path='productos' element={<CatalogoProductos/>}/>
            {/* <Route path='proveedores' element={<CatalogoProveedores/>}/> */}
            <Route path='pagos' element={<CatalogoPagos/>}/>
            {/* <Route path='empleados' element={<CatalogoEmpleados/>}/> */}
            {/* <Route path='unidades' element={<CatalogoUnidades/>}/> */}


            <Route path='/' element={<Navigate to='productos'/>}/>
        </Routes>
    </>
  )
}
