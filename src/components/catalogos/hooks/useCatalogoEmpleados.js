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
            dataIndex: '',
            key: '',
        },
        {
            title: 'A. Materno',
            dataIndex: '',
            key: '',
        },
        {
            title: 'Sexo',
            dataIndex: '',
            key: '',
        },
        {
            title: 'Fecha de Nacimiento',
            dataIndex: '',
            key: '',
        },
        {
            title: 'No. de Teléfono',
            dataIndex: '',
            key: '',
        },
        {
            title: 'CURP',
            dataIndex: '',
            key: '',
        },
        {
            title: 'RFC',
            dataIndex: '',
            key: '',
        },
        {
            title: 'Nombre Completo',
            dataIndex: '',
            key: '',
        },
    ];

    return {
        empleados,
        columnsEmpleados
    }
}
