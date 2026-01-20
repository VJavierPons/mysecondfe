import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrl = 'api'; // Removed /weather as it was likely wrong

  addWeatherData(temp: number, summary: string): Observable<any> {
    return this.http.post(`/api/weatherforecast`, { temperatureC: temp, summary: summary });
  }

  deleteWeatherData(id: string): Observable<any> {
    return this.http.delete(`/api/weatherforecast/${id}`);
  }
  
  getWeatherData(): Observable<any> {
    return this.http.get(`/api/weatherforecast`);
  }
}
