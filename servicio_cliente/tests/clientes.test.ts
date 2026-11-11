import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { Cliente } from "../src/models/cliente.model";
import { crearApp } from "../src/app";
import type { HTTPMethods } from "fastify";
async function manejarSolicitud(request: Request) {
  const app = crearApp();
  try {
    const result = await app.inject({
      method: request.method as HTTPMethods,
      url: new URL(request.url).pathname,
      headers: Object.fromEntries(request.headers),
      ...(request.body ? { payload: await request.text() } : {}),
    });
    return new Response(result.statusCode === 204 ? null : result.body, {
      status: result.statusCode,
      headers: { Allow: String(result.headers.allow ?? "") },
    });
  } finally { await app.close(); }
}

const datos = { nombre: "Ana", apellido: "Perez", correo: "ana@example.com", telefono: "0991234567" };
function request(path: string, method = "GET", body?: unknown) {
  return manejarSolicitud(new Request(`http://localhost${path}`, {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
  }));
}
afterEach(() => mock.restore());

describe("API de clientes", () => {
  test("lista clientes", async () => {
    spyOn(Cliente, "findAll").mockResolvedValue([Cliente.build({ codigo: 1, ...datos })]);
    const response = await request("/clientes");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ codigo: 1, ...datos }]);
  });
  test("consulta por código y devuelve 404 si no existe", async () => {
    const lookup = spyOn(Cliente, "findByPk").mockResolvedValue(Cliente.build({ codigo: 1, ...datos }));
    expect((await request("/clientes/1")).status).toBe(200);
    expect(lookup).toHaveBeenCalledWith(1);
    lookup.mockResolvedValue(null);
    expect((await request("/clientes/2")).status).toBe(404);
  });
  test("rechaza códigos inválidos sin consultar la base", async () => {
    const lookup = spyOn(Cliente, "findByPk");
    for (const id of ["abc", "0", "-1", "1.5", "9007199254740992"]) {
      expect((await request(`/clientes/${id}`)).status).toBe(400);
    }
    expect(lookup).not.toHaveBeenCalled();
  });
  test("crea un cliente y no permite asignar el código", async () => {
    const create = spyOn(Cliente, "create").mockResolvedValue(Cliente.build({ codigo: 1, ...datos }));
    expect((await request("/clientes", "POST", { ...datos, nombre: " Ana ", codigo: 99 })).status).toBe(201);
    expect(create).toHaveBeenCalledWith(datos);
  });
  test("rechaza datos incompletos, vacíos o mal formados", async () => {
    const create = spyOn(Cliente, "create");
    for (const body of [{}, [], null, { ...datos, nombre: " " }, { ...datos, telefono: 12 }]) {
      expect((await request("/clientes", "POST", body)).status).toBe(400);
    }
    const malformed = await manejarSolicitud(new Request("http://localhost/clientes", { method: "POST", body: "{", headers: { "Content-Type": "application/json" } }));
    expect(malformed.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });
  test("actualiza únicamente los campos permitidos", async () => {
    const cliente = Cliente.build({ codigo: 1, ...datos });
    spyOn(Cliente, "findByPk").mockResolvedValue(cliente);
    const update = spyOn(cliente, "update").mockResolvedValue(cliente);
    expect((await request("/clientes/1", "PUT", { nombre: "Eva", codigo: 9 })).status).toBe(200);
    expect(update).toHaveBeenCalledWith({ nombre: "Eva" });
    expect((await request("/clientes/1", "PUT", {})).status).toBe(400);
  });
  test("elimina y devuelve una respuesta sin cuerpo", async () => {
    const cliente = Cliente.build({ codigo: 1, ...datos });
    spyOn(Cliente, "findByPk").mockResolvedValue(cliente);
    const destroy = spyOn(cliente, "destroy").mockResolvedValue(undefined);
    const response = await request("/clientes/1", "DELETE");
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(destroy).toHaveBeenCalledTimes(1);
  });
  test("no actualiza ni elimina clientes inexistentes", async () => {
    spyOn(Cliente, "findByPk").mockResolvedValue(null);
    expect((await request("/clientes/1", "PUT", datos)).status).toBe(404);
    expect((await request("/clientes/1", "DELETE")).status).toBe(404);
  });
  test("devuelve 404 para rutas sin handler", async () => {
    expect((await request("/desconocida")).status).toBe(404);
    const response = await request("/clientes", "DELETE");
    expect(response.status).toBe(404);
  });
  test("oculta detalles internos de errores de base de datos", async () => {
    spyOn(console, "error").mockImplementation(() => {});
    spyOn(Cliente, "findAll").mockRejectedValue(new Error("detalle privado"));
    const response = await request("/clientes");
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Error interno del servidor" });
  });
});
