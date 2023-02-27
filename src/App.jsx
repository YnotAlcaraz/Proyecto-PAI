import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Catalogos } from './components/catalogos/Catalogos'
import ProductsTable from './components/catalogos/ProductsTable'
import { Navbar } from './components/Navbar'
import Sexo from './components/Sexo'

export const App = () => {
  return (
    <>
        <Navbar/>
        <Routes>
            {/* <Route path='productos' element={<ProductsTable/>}/> */}
            <Route path='productos' element={<Catalogos title={'Productos'}/>}/>
            <Route path='catalogos' element={<Catalogos title={'Catalogos'}/>}/>
            <Route path='clientes' element={<Catalogos title={'Clientes'}/>}/>
            <Route path='proveedores' element={<Catalogos title={'Proveedores'}/>}/>
            <Route path='pagos' element={<Catalogos title={'Pagos'}/>}/>
            <Route path='empleados' element={<Catalogos title={'Empleados'}/>}/>

            <Route path='/' element={<Navigate to='productos'/>}/>
        </Routes>
        <Sexo/>
        <ProductsTable/>
    </>
  )
}
