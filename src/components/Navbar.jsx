import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark p-2">
      <Link className="navbar-brand" to="/">
        Instituto Tecnologico de Mexicali - {formatTime(currentTime)}
      </Link>

      <div className="navbar-collapse">
        <div className="navbar-nav ml-auto">
          <NavLink className="nav-item nav-link" to="/productos">
            Productos
          </NavLink>

          <NavLink className="nav-item nav-link" to="/proveedores">
            Proveedores
          </NavLink>

          <NavLink className="nav-item nav-link" to="/pagos">
            Pagos
          </NavLink>

          <NavLink className="nav-item nav-link" to="/empleados">
            Empleados
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
