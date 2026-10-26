package com.assistencia.backend.exception;

public class ResourceNotFindException extends RuntimeException{
    public ResourceNotFindException(String message){
        super(message);
    }
}
