package com.assistencia.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest{
    @NotBlank(message = "Obrigatório preencher o e-mail")
    private String email;

    @NotBlank(message = "Obrigatório preencher a senha")
    private String senha;
}
