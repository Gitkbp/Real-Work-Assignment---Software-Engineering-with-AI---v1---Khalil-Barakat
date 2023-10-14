import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RosterService {
  private baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getRosterData(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/roster`).pipe(
      catchError(error => {
        console.error('Error fetching roster data:', error);
        return of([]);
      })
    );
  }
}