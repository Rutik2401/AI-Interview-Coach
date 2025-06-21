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
