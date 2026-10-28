CREATE TABLE ordem_servico (
    id BIGSERIAL PRIMARY KEY,
    aparelho_id BIGINT not null,
    tecnico_id BIGINT not null,
    defeito_relatado TEXT not null,
    diagnostico TEXT,
    situacao VARCHAR(30) not null,
    data_abertura timestamp not null,
    data_conclusao timestamp,
    data_entrega timestamp,
    FOREIGN KEY (aparelho_id) REFERENCES aparelho(id),
    FOREIGN KEY (tecnico_id) REFERENCES tecnico(id),
    CHECK (situacao in ('Aberta', 'Em_analise', 'Aguardando_aprovacao', 'Em_execucao', 'Concluida', 'Entregue', 'Cancelada'))
);