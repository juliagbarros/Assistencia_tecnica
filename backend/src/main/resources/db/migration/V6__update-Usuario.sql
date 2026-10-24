UPDATE usuario SET perfil = 'Tecnico' WHERE perfil NOT IN ('Admin', 'Tecnico');
ALTER TABLE usuario DROP CONSTRAINT chk_usuario_perfil;
ALTER TABLE usuario
    ADD CONSTRAINT chk_usuario_perfil
        CHECK (perfil IN ('Admin', 'Tecnico'));