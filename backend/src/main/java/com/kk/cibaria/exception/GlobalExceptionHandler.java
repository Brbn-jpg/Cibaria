package com.kk.cibaria.exception;

import java.util.Date;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(RecipeNotFoundException.class)
  public ResponseEntity<ErrorObject> handleRecipeNotFoundException(RecipeNotFoundException ex) {
    ErrorObject errorObject = new ErrorObject();

    errorObject.setStatusCode(HttpStatus.NOT_FOUND.value());
    errorObject.setMessage(ex.getMessage());

    return new ResponseEntity<ErrorObject>(errorObject, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorObject> handleUserNotFoundException(UserNotFoundException ex) {
    ErrorObject errorObject = new ErrorObject();

    errorObject.setStatusCode(HttpStatus.NOT_FOUND.value());
    errorObject.setMessage(ex.getMessage());

    return new ResponseEntity<ErrorObject>(errorObject, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(PageDoesNotExistException.class)
  public ResponseEntity<ErrorObject> handlePageDoesNotExists(PageDoesNotExistException ex)
  {
    ErrorObject errorObject = new ErrorObject();
    errorObject.setMessage(ex.getMessage());
    errorObject.setStatusCode(HttpStatus.BAD_GATEWAY.value());

    return new ResponseEntity<ErrorObject>(errorObject,HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UserEmailAlreadyExistException.class)
  public ResponseEntity<ErrorObject> handleUserEmailAlreadyExist(UserEmailAlreadyExistException ex)
  {
    ErrorObject errorObject = new ErrorObject();
    errorObject.setStatusCode(HttpStatus.CONFLICT.value());
    errorObject.setMessage(ex.getMessage());
    return new ResponseEntity<ErrorObject>(errorObject, HttpStatus.CONFLICT);
  }
}
