import { useEffect, useState } from "react"

export const useCatalogoUnidadesMedida = () => {
    const [unidadesMedida, setUnidadesMedida] = useState([]);
    useEffect(() => {
    }, []);

    const columnsUnidadesMedida = [
        {
            title: 'Nombre',
            width: 300,
        },
        {
            title: 'Descripción'
        },
    ];
    
    return {
        unidadesMedida,
        columnsUnidadesMedida,
    }
}
