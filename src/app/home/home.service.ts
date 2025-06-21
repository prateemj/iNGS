import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../golbal';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  extractSubtitlesFromURL(url): Observable<object> {
    const payload = { "url": url };
    return this.http.post(Global.GET_SUBTITLE_FROM_URL, payload);
  }

  extractSubtitlesFromFile(text): Observable<object> {
    const payload = { "subtitle": text };
    return this.http.post(Global.GET_SUBTITLE_FROM_FILE, payload);
  }
}
