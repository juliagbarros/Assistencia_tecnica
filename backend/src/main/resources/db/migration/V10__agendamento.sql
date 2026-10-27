CREATE TABLE agendamento (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT not null ,
    tecnico_id BIGINT not null,
    inicio timestamp not null,
    fim timestamp not null,
    motivo TEXT not null,
    situacao VARCHAR(20) not null,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    FOREIGN KEY (tecnico_id) REFERENCES tecnico(id),
    CHECK (situacao in ('Agendado', 'Realizado', 'Cancelado')),
    CONSTRAINT chk_agendamento_horario CHECK (fim > inicio)
);