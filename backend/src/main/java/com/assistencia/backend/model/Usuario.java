package com.assistencia.backend.model;


import jakarta.persistence.*;
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
    private String nome;

    @Column(nullable=false, unique = true, length = 120)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @Column(nullable = false,length = 50)
    private String perfil;

}
