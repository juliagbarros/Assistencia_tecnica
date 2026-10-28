package com.assistencia.backend.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ordem_servico")
@Getter
@Setter
@NoArgsConstructor
public class OrdemServico {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aparelho_id", nullable = false)
    private Aparelho aparelho;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tecnico_id", nullable = false)
    private Tecnico tecnico;

    @Column(name = "defeito_relatado", nullable = false, columnDefinition = "TEXT")
    private String defeitoRelatado;

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SituacaoOrdem situacao;

    @Column(name = "data_abertura", nullable = false)
    private LocalDateTime dataAbertura;

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    @Column(name = "data_entrega")
    private LocalDateTime dataEntrega;
}
