import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { IApiClient } from '../interfaces/api-client.interface';
import { ApiResponse } from '../../shared/models/api-response.model';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService implements IApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key].toString());
        }
      });
    }

    const response$ = this.http.get<ApiResponse<T>>(
      `${this.baseUrl}${endpoint}`,
      { params: httpParams }
    );
    return firstValueFrom(response$);
  }
}
