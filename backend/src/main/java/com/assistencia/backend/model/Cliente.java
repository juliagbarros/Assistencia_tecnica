package com.assistencia.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Cliente {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    @NotBlank(message = "Preencha o nome do cliente")
    private String nome;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Preencha o telefone do cliente")
    private String telefone;

    @Column(length = 120)
    @Email(message = "E-mail inválido")
    @NotBlank(message = "Preencha o e-mail do cliente")
    private String email;
}
