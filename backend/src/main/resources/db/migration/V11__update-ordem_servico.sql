UPDATE ordem_servico
SET situacao = 'Aberta'
WHERE situacao IN ('Em_analise', 'Aguardando_aprovacao');

UPDATE ordem_servico
SET situacao = 'Concluida'
WHERE situacao = 'Entregue';

ALTER TABLE ordem_servico DROP CONSTRAINT IF EXISTS ordem_servico_situacao_check;
ALTER TABLE ordem_servico
    ADD CONSTRAINT ordem_servico_situacao_check
        CHECK (situacao IN ('Aberta', 'Em_execucao', 'Concluida', 'Cancelada'));

ALTER TABLE ordem_servico DROP COLUMN data_entrega;

