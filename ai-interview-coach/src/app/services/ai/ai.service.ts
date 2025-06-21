import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiKey = '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'; 
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(private http: HttpClient) {}

  askAI(messages: { role: string; content: string }[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': 'http://localhost:4200' 
    });

    const body = {
      model: 'openai/gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
