import type { FastifyInstance } from "fastify";
import {
  clienteController,
  obtenerClienteId,
  crearCliente,
  eliminarCliente,
  actualizarCliente
} from "./controllers/cliente.controller";

export const clienteRouter = (app: FastifyInstance) => {
  app.get("/clientes", async (req, res) => {
    try {
      return await clienteController();
    } catch (error) {
      console.log("Error al obtener todos los clientes:", error);
      return res.code(400).send({ error: "Error en obtener clientes" });
    }
  });

  app.get("/clientes/:id", async (req, res) => {
    try {
      const { id } = req.params as any;
      return await obtenerClienteId(Number(id));
    } catch (error) {
      console.log("Error al obtener cliente:", error);
      return res.code(400).send({ error: "Error en obtener cliente" });
    }
  });

  app.post("/clientes", async (req, res) => {
    try {
      const data = req.body;
      return await crearCliente(data);
    } catch (error) {
      console.log("Error al crear cliente:", error);
      return res.code(400).send({ error: error instanceof Error ? error.message : "Error en crear cliente" });
    }
  });

  app.put("/clientes/:id", async (req, res) => {
    try {
      const { id } = req.params as any;
      const data = req.body;
      return await actualizarCliente(Number(id), data);
    } catch (error) {
      console.log("Error al actualizar cliente:", error);
      return res.code(400).send({ error: error instanceof Error ? error.message : "Error en actualizar cliente" });
    }
  });

  app.delete("/clientes/:id", async (req, res) => {
    try {
      const { id } = req.params as any;
      return await eliminarCliente(Number(id));
    } catch (error) {
      console.log("Error al eliminar cliente:", error);
      return res.code(400).send({ error: "Error en eliminar cliente" });
    }
  });
};