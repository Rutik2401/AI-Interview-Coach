import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { AiService } from '../../services/ai/ai.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, FormsModule,FooterComponent],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  chat: { role: string; content: string }[] = [];
  input = '';
  userName = '';
  userRole = '';
  askedQuestions = new Set<string>();
  recognition: any;
  isListening = false;
  liveTranscript = '';

  constructor(  private userService: UserService, private aiService: AiService, private ngZone: NgZone ) {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;

      this.recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.ngZone.run(() => {
              this.liveTranscript = transcript;
              this.input = transcript;
              this.sendAnswer();
              this.stopListening();
            });
          } else {
            interim += transcript;
          }
        }
        this.ngZone.run(() => {
          this.liveTranscript = interim;
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.stopListening();
      };


      this.recognition.onend = () => {
        this.stopListening();
      };
    } else {
      alert('Speech recognition not supported in your browser');
    }
  }

  ngOnInit() {
    const user = this.userService.getUser();
    this.userName = user.name;
    this.userRole = user.role;

    this.startCamera(); // 👈 Start camera here
    this.startInterview();
  }

  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (this.videoElement && this.videoElement.nativeElement) {
            this.videoElement.nativeElement.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
        });
    } else {
      alert('Camera not supported in this browser.');
    }
  }


  startInterview() {
    const systemPrompt = `
      You are an expert interviewer. Conduct a mock interview for a ${this.userRole} named ${this.userName}.
      Ask one question at a time. Do not repeat previous questions.
      Wait for user's answer before asking the next.
      Be natural and human-like. Use a friendly but professional tone.
    `;
    this.chat = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Let's begin the mock interview.` }
    ];
    this.askNextQuestion();
  }

  askNextQuestion() {
    this.aiService.askAI(this.chat).subscribe((res: any) => {
      const reply = res;
      if (reply && !this.askedQuestions.has(reply)) {
        this.ngZone.run(() => {
          this.chat.push({ role: 'assistant', content: reply });
          this.askedQuestions.add(reply);
        });
      }
    });
  }

  sendAnswer() {
    const answer = this.input.trim();
    if (!answer) return;

    this.chat.push({ role: 'user', content: answer });
    this.input = '';
    this.liveTranscript = '';
    this.askNextQuestion();
  }

  startListening() {
    if (this.recognition) {
      this.liveTranscript = '';
      this.isListening = true;
      this.recognition.start();
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.isListening = false;
  }
}
