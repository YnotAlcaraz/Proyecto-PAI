import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Catalogos } from './components/catalogos/Catalogos'
import { Navbar } from './components/Navbar'
import { useCatalogoProductos } from './components/catalogos/hooks/useCatalogoProductos'

export const App = () => {

  const { products, columnsProductos } = useCatalogoProductos({});

  const columnsEmpleados = [
    {
      title: 'Nombre(s)',
      dataIndex: ''
    },
    {
      title: 'A. Paterno',
    },
    {
      title: 'A. Materno',
    },
    {
      title: 'Sexo',
    },
    {
      title: 'Fecha de Nacimiento',
    },
    {
      title: 'No. de Teléfono',
    },
    {
      title: 'CURP',
    },
    {
      title: 'RFC',
    },
    {
      title: 'Nombre Completo',
    },
    
  ];

  return (
    <>
        <Navbar/>
        <Routes>
            {/* <Route path='productos' element={<ProductsTable/>}/> */}
            <Route path='productos' element={<Catalogos 
              title={'Productos'}
              dataSource={products}
              columns={columnsProductos}
            />}/>
            <Route path='catalogos' element={<Catalogos title={'Catalogos'}/>}/>
            <Route path='proveedores' element={<Catalogos title={'Proveedores'}/>}/>
            <Route path='pagos' element={<Catalogos title={'Pagos'}/>}/>
            <Route path='empleados' element={<Catalogos 
              title={'Empleados'}
              columns={columnsEmpleados}
            />}/>

            <Route path='/' element={<Navigate to='productos'/>}/>
        </Routes>
    </>
  )
}
