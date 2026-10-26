package com.assistencia.backend.dto;

import com.assistencia.backend.model.Perfil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioUpdateRequest {
    @NotBlank(message = "Obrigatório preencher o nome")
    private String nome;

    @NotBlank(message = "Obrigatório preencher o e-mail")
    @Email(message = "E-mail inválido")
    private String email;

    private String senha;

    @NotNull(message = "Obrigatório informar o perfil")
    private Perfil perfil;

}
