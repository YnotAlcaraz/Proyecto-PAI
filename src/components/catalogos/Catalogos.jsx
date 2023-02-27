import { Table } from "antd"
import { useEffect, useState } from "react";
import { getProductos } from "./hooks/getProductos";

export const Catalogos = ({
        title,
        dataSource,
        columns
    }) => {

        
    return (
        <>
            <h1>Tipos de {title}</h1>
            <Table dataSource={dataSource} columns={columns} />;
        </>
    )
}
