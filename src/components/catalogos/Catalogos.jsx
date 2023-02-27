import { Table } from "antd"
import { useEffect, useState } from "react";
import { getProductos } from "./hooks/getProductos";

export const Catalogos = ({
        title
    }) => {
        const [productos, setProductos] = useState([]);
        useEffect(() => {
            const _productos = getProductos();
            setProductos(_productos);
        }, []);
        
        console.log(productos);




        

        const dataSource = [
            {
              key: '1',
              name: 'Mike',
              age: 32,
              address: '10 Downing Street',
            },
            {
              key: '2',
              name: 'John',
              age: 42,
              address: '10 Downing Street',
            },
          ];

          const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Age',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: 'Address',
              dataIndex: 'address',
              key: 'address',
            },
          ];


    return (
        <>
            <h1>Tipos de {title}</h1>
            <Table dataSource={dataSource} columns={columns} />;
        </>
    )
}
