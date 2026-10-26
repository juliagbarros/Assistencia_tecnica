ALTER TABLE usuario
    ADD CONSTRAINT chk_usuario_perfil
        CHECK (perfil IN ('Admin', 'Atendente', 'Tecnico'));