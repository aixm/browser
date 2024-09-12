import { Injectable }         from '@angular/core';
import { Subject }            from 'rxjs';

@Injectable() // must be provided in each component
export class SpeechService {
  public transcript: Subject<string> = new Subject<string>();
  public isListening: boolean = false;
  public isReceiving: boolean = false;
  private recognition: any;

  constructor() {
    // @ts-ignore
    const { webkitSpeechRecognition }: IWindow = window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    // Handle recognition events
    this.recognition.onresult = (event: any): void => {
      this.isReceiving = true;
      //console.log(event);
      // @ts-ignore
      const transcript: string = Array.from(event.results).map((result):?[] => result[0].transcript).join('');
      this.transcript.next(transcript);
      console.log('Service', transcript);
      this.isReceiving = false;
    };

    this.recognition.onerror = (event: any): void => {
      console.error(event.error);
      this.isListening = false;
      this.isReceiving = false;
    };
  }

  startListening(): void {
    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  stopListening(): void {
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
