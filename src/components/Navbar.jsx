import { Link, NavLink, useNavigate } from 'react-router-dom'

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark p-2">
            
            <Link 
                className="navbar-brand" 
                to="/"
            >
                Catálogos
            </Link>

            <div className="navbar-collapse">
                <div className="navbar-nav">

                    <NavLink 
                        className="nav-item nav-link" 
                        to="/productos"
                    >
                        Productos
                    </NavLink>

                    <NavLink 
                        className="nav-item nav-link" 
                        to="/clientes"
                    >
                        Clientes
                    </NavLink>

                    <NavLink 
                        className="nav-item nav-link" 
                        to="/proveedores"
                    >
                        Proveedores
                    </NavLink>
                    <NavLink 
                        className="nav-item nav-link" 
                        to="/pagos"
                    >
                        Pagos
                    </NavLink>
                    <NavLink 
                        className="nav-item nav-link" 
                        to="/empleados"
                    >
                        Empleados
                    </NavLink>
                </div>
            </div>
        </nav>
  )
}
