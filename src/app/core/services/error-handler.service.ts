import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface AppError {
  message: string;
  code?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);

      const appError: AppError = {
        message: this.getErrorMessage(error),
        code: error?.status?.toString(),
        timestamp: new Date(),
      };

      return of(result as T);
    };
  }

  private getErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    switch (error?.status) {
      case 404:
        return 'Recurso não encontrado';
      case 500:
        return 'Erro interno do servidor';
      case 0:
        return 'Erro de conexão. Verifique sua internet.';
      default:
        return 'Ocorreu um erro inesperado';
    }
  }
}
