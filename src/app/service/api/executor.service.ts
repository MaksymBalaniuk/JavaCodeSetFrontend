import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "../error.service";
import {JavaCodeExecutionRequest} from "../../dto/java-code-execution-request";
import {catchError, Observable, throwError} from "rxjs";
import {JavaCodeExecutionResponse} from "../../dto/java-code-execution-response";

@Injectable({
  providedIn: 'root'
})
export class ExecutorService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  execute(javaCodeExecutionRequest: JavaCodeExecutionRequest, token: string): Observable<JavaCodeExecutionResponse> {
    return this.http.post<JavaCodeExecutionResponse>(
      'http://localhost:8075/api/executor/execute', javaCodeExecutionRequest, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  private errorHandle(error: HttpErrorResponse): Observable<never> {
    this.errorService.handle(error);
    return throwError(() => error.message);
  }
}
