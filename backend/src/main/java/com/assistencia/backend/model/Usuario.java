package com.assistencia.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Entity
@Table(name="usuario")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    @NotBlank(message = "Obrigatório preencher o nome")
    private String nome;

    @Column(nullable=false, unique = true, length = 120)
    @NotBlank(message = "Obrigatório preencher o e-mail")
    @Email(message = "E-mail inválido")
    private String email;

    @Column(nullable = false, length = 255)
    @NotBlank(message = "Obrigatório preencher a senha")
    private String senha;

    @Column(nullable = false,length = 50)
    private String perfil;

}
