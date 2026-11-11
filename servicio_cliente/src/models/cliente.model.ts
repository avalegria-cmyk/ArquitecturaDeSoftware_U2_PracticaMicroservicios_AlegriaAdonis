import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const Cliente = sequelize.define(
    "cliente",
    {
        codigo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "cliente",
        timestamps: false,
    }
);

export default Cliente;