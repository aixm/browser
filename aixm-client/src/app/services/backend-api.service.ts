import { HttpClient, HttpEvent } from '@angular/common/http';
import { Inject, Injectable }    from '@angular/core';
import { FormGroup }                            from '@angular/forms';
import { MatSnackBar }                          from '@angular/material/snack-bar';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { camelize, toCamel }                    from '../helpers/utils';
import { ApiResponse }                          from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  //backendUrlValue: string 'http://localhost:3000';
  //backendUrlValue: string = 'http://localhost:5000';
  backendUrlValue: string = environment.apiUrl;
  constructor(
      private httpClient: HttpClient,
      private snackBar: MatSnackBar,
  ) { }

  /**
   * Get backend base path
   */
  getBackendUrlValue(): string {
    // console.log(window.location.host);
    let url: string = this.backendUrlValue;
    if (!window.location.host.includes('localhost')) {
      url = `https://${window.location.host}/api/v1`;
    }
    return url;
  }

  /**
   *
   * @param apiPath
   */
  getData(apiPath: string): Observable<ApiResponse> {
    const url: string = `${this.getBackendUrlValue()}/${apiPath}`;
    // console.log('GET', url);
    return this.httpClient.get<ApiResponse>(url)
        .pipe(
            map((x: ApiResponse) => toCamel(x)),
            // tap(_ => console.log('GET Response', _)),
            catchError(this.handleError<ApiResponse>('getData'))
        );
  }

  /**
   *
   * @param apiPath
   * @param item
   * @param params
   */
  postItem(apiPath: string, item: any, params?: any, formGroup?: FormGroup): Observable<ApiResponse> {
    const url: string = `${this.getBackendUrlValue()}/${apiPath}`;
    // console.log('POST', url);
    return this.httpClient.post<ApiResponse>(url, item, params).pipe(
        map((x: HttpEvent<ApiResponse>) => toCamel(x)),
        // tap(_ => console.log('POST Response', _)),
        catchError(this.handleError<ApiResponse>(`postItem item=${item}`, formGroup))
    );
  }

  /**
   *
   * @param apiPath
   * @param item
   * @param params
   */
  putItem(apiPath: string, item: any, params?: any, formGroup?: FormGroup): Observable<ApiResponse> {
    const url: string = `${this.getBackendUrlValue()}/${apiPath}/${item.id}`;
    // console.log('PUT', url);
    return this.httpClient.put<ApiResponse>(url, item, params).pipe(
        map((x: HttpEvent<ApiResponse>) => toCamel(x)),
        // tap(_ => console.log('PUT Response', _)),
        catchError(this.handleError<ApiResponse>(`putItem item=${item}`, formGroup))
    );
  }

  /**
   *
   * @param apiPath
   * @param id
   */
  deleteItem(apiPath: string, id: any, params?: any): Observable<ApiResponse> {
    const url: string = `${this.getBackendUrlValue()}/${apiPath}/${id}`;
    // console.log('DELETE', url);
    return this.httpClient.delete<ApiResponse>(url, params).pipe(
        map((x: HttpEvent<ApiResponse>) => toCamel(x)),
        // tap(_ => console.log('DELETE Response', _)),
        catchError(this.handleError<ApiResponse>(`deleteItem id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', formGroup?: FormGroup): any {
    return (error: any): Observable<T> => {
      if (error.status === 422) {
        // server data validation error
        if (formGroup) {
          Object.keys(error.error.errors).forEach(prop => {
            const formControl = formGroup.get(camelize(prop));
            if (formControl) {
              // activate the error message
              formControl.setErrors({
                serverError: error.error.errors[prop]
              });
            }
          });
        }
      } else {
        this.snackBar.open(`Backend API Error (${operation} failed): ${error.message}`, 'Ok', {duration: 3000});
      }
      // Let the app keep running and returning an error as a result.
      return of(error as T);
    };
  }

}
