import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Catalogos } from './components/catalogos/Catalogos'
import { Navbar } from './components/Navbar'

export const App = () => {
  return (
    <>
        <Navbar/>
        <Routes>
            <Route path='productos' element={<Catalogos title={'Productos'}/>}/>
            <Route path='productos' element={<Catalogos title={'Cliente'}/>}/>
            <Route path='productos' element={<Catalogos title={'Proveedor'}/>}/>
            <Route path='productos' element={<Catalogos title={'Pago'}/>}/>
            <Route path='productos' element={<Catalogos title={'Empleado'}/>}/>
        </Routes>
    </>
  )
}
