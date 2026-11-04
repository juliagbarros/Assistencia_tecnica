package com.assistencia.backend.messaging.consumer;

import com.assistencia.backend.messaging.event.OrdemSituacaoAlteradaEvent;
import com.assistencia.backend.messaging.notificador.EmailService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrdemSituacaoAlteradaConsumer {
    private final EmailService emailService;

    public OrdemSituacaoAlteradaConsumer(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(topics = "${topico.ordem-situacao-alterada.nome}")
    public void receber(OrdemSituacaoAlteradaEvent evento) {
        emailService.enviarEmail(evento.clienteEmail(), evento.clienteNome(), evento.ordemId(), evento.aparelho(), evento.situacaoAtual(),evento.dataAlteracao());
    }
}