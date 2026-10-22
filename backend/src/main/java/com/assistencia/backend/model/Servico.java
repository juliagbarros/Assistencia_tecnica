package com.assistencia.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name="servico")
@Getter
@Setter
@NoArgsConstructor
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Preencha o nome do serviço")
    private String nome;

    @Column(columnDefinition = "Text")
    private String descricao;

    @Column( name = "preco_padrao", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Obrigatório preencher o preço")
    @PositiveOrZero(message = "O preço não pode ser negativo")
    private BigDecimal precoPadrao;

    @Column(nullable = false)
    private boolean ativo = true;

}



