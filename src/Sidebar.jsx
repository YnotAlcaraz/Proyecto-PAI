import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Navigate, Route, Routes } from "react-router-dom";
import { Empleados, Pagos, Productos,Proveedores } from "./components/catalogos";
import { Dashboard } from "./components/Dashboard";
import { useState } from 'react';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('DASHBOARD', '1', <PieChartOutlined />),
  getItem('MANTENIMIENTOS', 'sub1', <UserOutlined />, [
    getItem('INVENTARIOS', '3'),
    getItem('VENTAS', '4'),
    getItem('PEDIDOS', '5'),
  ]),
  getItem('CATALOGOS', 'sub2', <UserOutlined />, [
    getItem('EMPLEADOS', '6'),
    getItem('PAGOS', '7'),
    getItem('PRODUCTOS', '8'),
    getItem('PROVEEDORES', '9'),
  ]),
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            height: 32,
            margin: 16,
            textAlign: 'center',
            // background: 'rgba(255, 255, 255, 0.2)',
          }}
        >
            <img src="./src/components/assets/PAI-Logo.png" alt="PAILogo" style={{
                height: 50,
            }}/>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            textAlign: 'center',
            background: colorBgContainer,
          }}
        >
            Proyecto de Administración de Inventarios
        </Header>
        {<Content
          style={{
            margin: '0 16px',
          }}
        >
            <Routes>
                <Route path="productos" element={<Productos />} />
                <Route path="proveedores" element={<Proveedores />} />
                <Route path="pagos" element={<Pagos />} />
                <Route path="empleados" element={<Empleados />} />
                <Route path="dashboard" element={<Dashboard />}/>
                <Route path="/" element={<Navigate to="dashboard" />} />
            </Routes>
        </Content>}
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Instituto Tecnológico de Mexicali
        </Footer>
      </Layout>
    </Layout>
  );
};