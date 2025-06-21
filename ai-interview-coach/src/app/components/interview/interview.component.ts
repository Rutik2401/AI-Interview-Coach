import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { AiService } from '../../services/ai/ai.service';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {
  chat: { role: string; content: string }[] = [];
  input = '';
  loading = false;
  userName = '';
  userRole = '';
  askedQuestions = new Set<string>();

  constructor(private userService: UserService, private aiService: AiService) {}

  ngOnInit() {
    const user = this.userService.getUser();
    this.userName = user.name;
    this.userRole = user.role;

    this.startInterview();
  }

  startInterview() {
    const systemPrompt = `
      You are an expert interviewer. Conduct a mock interview for a ${this.userRole} named ${this.userName}.
      Ask one question at a time. Do not repeat previous questions.
      Wait for user's answer before asking the next.
      Be natural and human-like. Use friendly but professional tone.
    `;
    this.chat = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Let's begin the mock interview.` }
    ];
    this.askNextQuestion();
  }

  askNextQuestion() {
    this.loading = true;
    this.aiService.askAI(this.chat).subscribe((res: any) => {
      const reply = res.choices[0].message.content.trim();

      // Optional: skip repeated questions
      if (!this.askedQuestions.has(reply)) {
        this.chat.push({ role: 'assistant', content: reply });
        this.askedQuestions.add(reply);
      }

      this.loading = false;
    });
  }

  sendAnswer() {
    const answer = this.input.trim();
    if (!answer) return;

    this.chat.push({ role: 'user', content: answer });
    this.input = '';
    this.askNextQuestion(); // Get next question after user answers
  }
}
