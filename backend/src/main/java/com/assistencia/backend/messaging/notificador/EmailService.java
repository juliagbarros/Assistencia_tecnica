package com.assistencia.backend.messaging.notificador;

import com.assistencia.backend.model.SituacaoOrdem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarEmail(String destinatario, String nomeCliente, Long ordemId, String aparelho, SituacaoOrdem situacao, LocalDateTime dataAlteracao){
        if (destinatario == null || destinatario.isBlank()) {
            return;
        }
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Atualização da da sua Ordem de Serviço - TechRepair Assistência Técnica");

        String mensagemAdicional = "";
        if (situacao == SituacaoOrdem.Concluida) {
            mensagemAdicional = "\n\nPor favor, entre em contato com nossa assistência técnica para combinar a retirada do seu aparelho!\n";

        } else if (situacao == SituacaoOrdem.Cancelada) {
            mensagemAdicional = "\n\nEm caso de dúvidas, entre em contato com nossa assistência técnica.\n";

        }

        mensagem.setText("Olá, " + nomeCliente + "!\n" +
                "A sua Ordem de Serviço nº " + ordemId + " foi atualizada em: " + dataAlteracao.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) +
                ", para o aparelho: " + aparelho + "\n" +
                "Nova situação: " + situacao + "\n" +
                mensagemAdicional +
                "Atenciosamente,\n" + "Assistência Técnica TechRepair");
        mailSender.send(mensagem);

    }
}
