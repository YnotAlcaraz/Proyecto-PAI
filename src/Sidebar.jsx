import { 
    HomeOutlined,
    FundOutlined,
    ProfileOutlined,
    CreditCardOutlined,
    TeamOutlined,
    TableOutlined,
    ScheduleOutlined,
    ContactsOutlined,
} from '@ant-design/icons/lib/icons'
import { Layout, Menu, theme } from 'antd';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Empleados, Pagos, Productos, Proveedores } from "./components/catalogos";
import { Inventario, Pedidos, Ventas } from './components/mantenimientos'
import { Dashboard } from "./components/Dashboard";
import { useState } from 'react';
const { Footer, Sider } = Layout;
const items = [
    {
        label: 'DASHBOARD',
        icon: <HomeOutlined/>,
        key: '/dashboard'
    },
    {
        label: 'MANTENIMIENTOS',
        children: [
            {
                label: 'INVENTARIO',
                icon: <TableOutlined />,
                key: '/inventario'
            },
            {
                label: 'VENTAS',
                icon: <FundOutlined />,
                key: '/ventas'
            },
            {
                label: 'PEDIDOS',
                icon: <ScheduleOutlined />,
                key: '/pedidos'
            }
        ]
    },
    {
        label: 'CATALOGOS',
        children: [
            {
                label: 'EMPLEADOS',
                icon: <TeamOutlined />,
                key: '/empleados'
            },
            {
                label: 'PAGOS',
                icon: <CreditCardOutlined />,
                key: '/pagos'
            },
            {
                label: 'PRODUCTOS',
                icon: <ProfileOutlined />,
                key: 'productos'
            },
            {
                label: 'PROVEEDORES',
                icon: <ContactsOutlined />,
                key: 'proveedores'
            }
        ]
    }
];


export const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const Contenido = () => {
        return (
            <div  className='Content'>
                <Routes>
                    <Route path="/inventario" element={<Inventario />} />
                    <Route path="/pedidos" element={<Pedidos />} />
                    <Route path="/ventas" element={<Ventas />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/proveedores" element={<Proveedores />} />
                    <Route path="/pagos" element={<Pagos />} />
                    <Route path="/empleados" element={<Empleados />} />
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/" element={<Navigate to="dashboard" />} />
                </Routes>
            </div>
        );
    }

    const navigate = useNavigate();

    return (
        <Layout
        style={{
            minHeight: '100vh',
        }}
        >
        <Sider /* collapsible */ collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div
            style={{
                height: 32,
                margin: 16,
                textAlign: 'center',
                // background: 'rgba(255, 255, 255, 0.2)',
            }}
            >
                <img src="./src/components/assets/PAI-Logo.png" alt="PAILogo" style={{
                    width: 100,
                }}/>
            </div>
            <hr style={{color: 'white'}}/>
            <Menu 
                theme="dark" 
                defaultSelectedKeys={['1']} 
                mode="inline" 
                items={items}
                onClick={({ key }) => {
                    navigate(key);
                }} 
            />
            <div style={{textAlign: 'center', color: 'white'}}>
                <hr />
                INSTITUTO TECNOLÓGICO DE MEXICALI
            </div>
        </Sider>
        <Layout className="site-layout">
            <Contenido />
        </Layout>
        </Layout>
    );
};