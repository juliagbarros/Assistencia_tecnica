CREATE TABLE item_ordem (
    id BIGSERIAL PRIMARY KEY,
    ordem_id BIGINT not null,
    servico_id BIGINT not null,
    quantidade INTEGER not null,
    preco_unitario NUMERIC(10,2) not null,
    FOREIGN KEY (ordem_id) REFERENCES ordem_servico(id),
    FOREIGN KEY (servico_id) REFERENCES servico(id),
    CHECK (quantidade > 0), CHECK (preco_unitario >= 0)
);
