import { useEffect, useState } from "react"

export const useCatalogoEmpleados = () => {
    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {

    }, []);
    

    const columnsEmpleados = [
        {
            title: 'Nombre(s)',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'A. Paterno',
            dataIndex: 'apellido_paterno',
            key: 'apellido_paterno',
        },
        {
            title: 'A. Materno',
            dataIndex: 'apellido_materno',
            key: 'apellido_materno',
        },
        {
            title: 'Sexo',
            dataIndex: 'sexo',
            key: 'sexo',
        },
        {
            title: 'Fecha de Nacimiento',
            dataIndex: 'fecha_nac',
            key: 'fecha_nac',
        },
        {
            title: 'No. de Teléfono',
            dataIndex: 'no_tel',
            key: 'no_tel',
        },
        {
            title: 'CURP',
            dataIndex: 'curp',
            key: 'curp',
        },
        {
            title: 'RFC',
            dataIndex: 'rfc',
            key: 'rfc',
        },
        {
            title: 'Fecha de Inicio',
            dataIndex: 'fecha_ini',
            key: 'fecha_ini',
        },
    ];

    return {
        empleados,
        columnsEmpleados
    }
}
