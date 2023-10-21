require('express-async-errors');

const migrationsRun = require ("./database/sqlite/migrations")

const AppError = require("./utils/AppError");

const express = require("express");

const routes = require("./routes");

const database = require("./database/sqlite");

migrationsRun();

database();

//inicializando o express
//express ajuda a gerenciar as requisições
const app = express();
app.use(express.json());

app.use(routes);


app.use((error, request, response, next) => {

  if (error instanceof AppError){
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  })
  
});

//porta que a api vai esperar requisoção e devolver respostas
const PORT = 3333;

//evento de escuta na porta desejada e quando acontecer algo, devolve a mesnagem
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
