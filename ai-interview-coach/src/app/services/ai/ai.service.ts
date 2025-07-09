import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiKey = 'AIzaSyBfoGJt3qg0OKf5xc4DaozLSJx8N-Cljgw'; 
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(this.apiKey);
  }

  askAI(messages: { role: string; content: string }[]): Observable<any> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const formattedMessages = messages.map(msg => msg.content).join('\n');
    return from(
      model.generateContent(formattedMessages).then((res: { response: { text: () => any; }; }) => res.response.text())
    );
  }
}

