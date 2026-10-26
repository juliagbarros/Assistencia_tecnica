CREATE TABLE cliente (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) not null,
    telefone VARCHAR(20) not null,
    email VARCHAR(120) not null unique
);