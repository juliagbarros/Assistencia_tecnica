package com.assistencia.backend.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name="tecnico")
@Getter
@Setter
@NoArgsConstructor
public class Tecnico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    @NotBlank(message = "Obrigatório preencher o nome")
    private String nome;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Obrigatório preencher o telefone")
    private String telefone;

    @Column(length = 80)
    private String especialidade;

    @Column(nullable = false)
    private boolean ativo = true;
}
