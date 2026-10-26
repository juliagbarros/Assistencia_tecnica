CREATE TABLE tecnico (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) not null ,
    telefone VARCHAR(20) not null,
    especialidade VARCHAR(80) ,
    ativo BOOLEAN not null default true
);
--especialidade como not null dps?