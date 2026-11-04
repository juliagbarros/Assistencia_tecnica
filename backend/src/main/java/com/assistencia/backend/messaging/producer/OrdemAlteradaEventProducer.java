package com.assistencia.backend.messaging.producer;

import com.assistencia.backend.messaging.event.OrdemSituacaoAlteradaEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
public class OrdemAlteradaEventProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${topico.ordem-situacao-alterada.nome}")
    private String topico;

    public OrdemAlteradaEventProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publicarAlteracao(OrdemSituacaoAlteradaEvent evento) {
        try {
            String json = objectMapper.writeValueAsString(evento);
            kafkaTemplate.send(topico, evento.ordemId().toString(), json);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao publicar evento da ordem no Kafka", e);
        }
    }
}

