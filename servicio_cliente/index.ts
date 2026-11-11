import fastify from "fastify";
import { sequelize } from "./src/config/database";
import { clienteRouter } from "./src/app";

const app = fastify({
  logger: true
});

app.register(clienteRouter, { prefix: "/api" });

const iniciar = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Sincroniza los modelos con la base de datos
    await app.listen({
      port: Number(process.env.PORT) || 3001,
      host: "0.0.0.0" }
    );
    app.log.info(`Servidor escuchando en http://localhost:${process.env.PORT || 3001}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

iniciar();
