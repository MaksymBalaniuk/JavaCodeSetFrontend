import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorType} from "../type/error-type";
import { ErrorResponse } from '../dto/error-response';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  error$ = new Subject<string>();

  handle(error: HttpErrorResponse): void {
    if (this.determineErrorType(error.error)) {
      this.error$.next(error.error.message);
    } else {
      this.error$.next('Unknown error');
    }
  }

  clear(): void {
    this.error$.next('');
  }

  determineErrorType(type: ErrorType): type is ErrorResponse {
    return !!(type as ErrorResponse).message;
  }
}
