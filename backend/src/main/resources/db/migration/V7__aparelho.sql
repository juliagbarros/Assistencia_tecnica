CREATE TABLE aparelho (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT not null,
    tipo VARCHAR(50) not null,
    marca VARCHAR(100) not null,
    modelo VARCHAR(100) not null,
    numero_serie VARCHAR(100),
    observacoes TEXT,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);