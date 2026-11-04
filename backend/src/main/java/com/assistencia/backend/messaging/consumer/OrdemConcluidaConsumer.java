package com.assistencia.backend.messaging.consumer;

import com.assistencia.backend.messaging.event.OrdemConcluidaEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrdemConcluidaConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrdemConcluidaConsumer.class);
    @KafkaListener(topics = "${topico.ordem-concluida.nome}",
            groupId = "${topico.ordem-concluida.group-id}")
    public void receber(OrdemConcluidaEvent evento) {
        log.info("Ordem {} concluída. Cliente: {} ({})",
                evento.ordemId(), evento.clienteNome(), evento.clienteEmail());
    }
}