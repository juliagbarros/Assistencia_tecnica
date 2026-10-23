package com.assistencia.backend.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(){
        super ("E-mail ou senha inválidos!");
    }
}
