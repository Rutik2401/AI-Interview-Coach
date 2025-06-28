import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai/ai.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  chat: { role: string; content: string }[] = [];
  input = '';
  userName: string = '';
  userRole: string = '';
  experience: string = '';
  askedQuestions = new Set<string>();
  recognition: any;
  isListening = false;
  liveTranscript = '';
  finalTranscript = '';
  sendTimer: any = null;

  constructor(private aiService: AiService, private ngZone: NgZone) {
  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

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
          this.finalTranscript += transcript + ' ';
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
    this.userName = sessionStorage.getItem('name') || '';
    this.userRole = sessionStorage.getItem('role') || '';
    this.experience = sessionStorage.getItem('experience') || '';
    this.startCamera();
    this.startInterview();
  }

  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (this.videoElement?.nativeElement) {
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
      You are an expert technical interviewer.

      Conduct a mock interview for a ${this.userRole} named ${this.userName}, who has ${this.experience} of experience.

      Guidelines:
      - Start with an introduction: "Please introduce yourself."
      - Ask one question at a time.
      - Do NOT repeat previous questions.
      - Gradually increase the difficulty of questions after a few rounds, based on the candidate's experience.
      - Keep the tone professional yet friendly.
      - Wait for the user's answer before moving to the next question.
      - Tailor questions to the experience level: ${this.experience}.
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
      this.finalTranscript = '';
      this.isListening = true;
      this.recognition.start();
    }
  }

 stopListening() {
  if (this.recognition) {
    this.recognition.stop();
  }
  this.isListening = false;

  if (this.finalTranscript.trim()) {
    this.input = this.finalTranscript.trim();
    this.liveTranscript = '';
    this.sendAnswer();
    this.finalTranscript = '';
  }
}

}
