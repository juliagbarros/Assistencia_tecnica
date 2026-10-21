CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) not null ,
    email VARCHAR (120) not null unique ,
    senha VARCHAR (255) not null,
    perfil VARCHAR (50) not null
);
