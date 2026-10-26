CREATE TABLE servico (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) not null,
    descricao TEXT,
    preco_padrao decimal (10,2) not null CHECK (preco_padrao >= 0),
    ativo BOOLEAN not null default true
);