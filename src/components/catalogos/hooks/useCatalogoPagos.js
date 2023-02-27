export const useCatalogoPagos = () => {
  const columnsPagos = [
    {
        title: 'Método de pago'
    },
    {
        title: "Acciones",
        dataIndex: "key",
        key: "acciones",
        render: (key, record) => (
          <>
            <Button
              type="primary"
              style={{ marginRight: 16 }}
              onClick={() => handleEdit(key)}
            >
              Editar
            </Button>
            <Popconfirm
              title="¿Estás seguro de que quieres eliminar este producto?"
              onConfirm={() => handleDelete(key)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="danger" style={{ marginRight: 16 }}>
                Eliminar
              </Button>
            </Popconfirm>
          </>
        ),
      },
  ];
}
