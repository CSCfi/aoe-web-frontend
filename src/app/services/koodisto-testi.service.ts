import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KoodistoTestiService {

  constructor(private http: HttpClient) { }

  private apiUri = 'http://localhost:3000/api/v1';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getOpetussuunnitelmat(): Observable<any> {
    return this.http.get(`${this.apiUri}/opetussuunnitelmat`);
  }

  getKielet(): Observable<any> {
    return this.http.get(`${this.apiUri}/kielet/fi`);
  }
}
