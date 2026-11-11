# Servicio de clientes

API con Bun, Sequelize y PostgreSQL. Ejecuta los comandos desde `servicio_cliente`.

```bash
bun install
bun run dev
```

Configura `.env` con `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST` y, opcionalmente, `DB_PORT` (5432) y `PORT` (3000). PostgreSQL debe estar disponible y la tabla `cliente` debe existir con las columnas `codigo` (entero autoincremental y clave primaria), `nombre`, `apellido`, `correo` y `telefono` (texto de hasta 255 caracteres). El servicio comprueba la conexión al iniciar; no crea ni modifica el esquema automáticamente.

| Método | Ruta | Operación |
| --- | --- | --- |
| GET | /clientes | Listar clientes |
| GET | /clientes/:codigo | Consultar un cliente |
| POST | /clientes | Crear un cliente |
| PUT | /clientes/:codigo | Actualizar los campos enviados |
| DELETE | /clientes/:codigo | Eliminar un cliente |

Para crear un cliente, envía los cuatro campos como textos no vacíos. El código lo genera la base de datos. Las actualizaciones aceptan uno o más de esos campos.

```bash
curl http://localhost:3000/clientes
curl -X POST http://localhost:3000/clientes \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Ana","apellido":"Perez","correo":"ana@example.com","telefono":"0991234567"}'
```

Las respuestas usan 201 al crear, 204 al eliminar, 400 para entradas inválidas, 404 para clientes o rutas inexistentes.

```bash
bun run typecheck
bun test
```

Las pruebas usan modelos simulados para verificar las rutas y el controlador sin modificar datos reales. No sustituyen una prueba de integración con PostgreSQL.
