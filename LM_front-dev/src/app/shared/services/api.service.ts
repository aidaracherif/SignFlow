import {HttpParams, HttpErrorResponse, HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError } from 'rxjs';

import { ResponseApi } from '../models/ResponseApi';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private readonly _httpClient : HttpClient){}

  _apiUrl = environment.API_URL

  get = (endpoint: string, params ?: HttpParams): Observable<ResponseApi> => this._httpClient.get(`${this._apiUrl}${endpoint}`, {params}).pipe(
    retry(3),
    catchError(this.handleError)
  );

  post = (endpoint: string, data: any, options?: { headers?: HttpHeaders }): Observable<ResponseApi> => this._httpClient.post(`${this._apiUrl}${endpoint}`, data, options).pipe(
    catchError(this.handleError)
  );

  // post = (endpoint: string, data: any): Observable<ResponseApi> => this._httpClient.post(`${this._apiUrl}${endpoint}`, data).pipe(
  //   catchError(this.handleError)
  // );

  put = (endpoint: string, data: any): Observable<ResponseApi> => this._httpClient.put(`${this._apiUrl}${endpoint}`, data).pipe(
    catchError(this.handleError)
  );

  patch = (endpoint: string, data: any): Observable<ResponseApi> => this._httpClient.patch(`${this._apiUrl}${endpoint}`, data).pipe(
    catchError(this.handleError)
  );

  delete = (endpoint: string): Observable<ResponseApi> => this._httpClient.delete(`${this._apiUrl}${endpoint}`).pipe(
    catchError(this.handleError)
  );

  private handleError(error: HttpErrorResponse) {
    // console.log(error)
    if (error.status === 0) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }

    return throwError(() => new Error(`${error.message}`));
  }

}
