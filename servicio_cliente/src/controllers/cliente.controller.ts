import { Cliente } from '../models/cliente.model';

export const clienteController = async () => {
    return Cliente.findAll();
}

export const obtenerClienteId = async (id: number) => {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
        throw Error('Cliente no encontrado');
    }
    return cliente;
}

// ORM Sequelize para no escribir sentencias SQL
// Función flecha
export const crearCliente = async (data: any) => {
    data = validarCliente(data);
    return await Cliente.create(data);
}

export const actualizarCliente = async (id: number, data: any) => {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
        throw Error('Cliente no encontrado');
    }
    data = validarCliente(data);
    await cliente.update(data);
    return cliente;
}

export const eliminarCliente = async (id: number) => {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
        throw Error('Cliente no encontrado');
    }
    await cliente.destroy();
    return { mensaje: 'Cliente eliminado correctamente' };
}

const validarCliente = (data: any) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw Error('Debes enviar los datos del cliente');
    }
    const datos: any = {};
    for (const campo of ['nombre', 'apellido', 'correo', 'telefono']) {
        if (typeof data[campo] !== 'string' || !data[campo].trim()) {
            throw Error(`El campo ${campo} es obligatorio y no puede estar vacío`);
        }
        datos[campo] = data[campo].trim();
    }
    if (!/^\d{10}$/.test(datos.telefono)) {
        throw Error('El teléfono debe tener exactamente 10 dígitos');
    }
    return datos;
};
