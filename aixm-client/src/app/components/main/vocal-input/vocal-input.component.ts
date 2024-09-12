import { AsyncPipe, NgForOf, NgIf }     from '@angular/common';
import { Component, OnDestroy, OnInit }           from '@angular/core';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatChip }                           from '@angular/material/chips';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon }                           from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip }                                                                 from '@angular/material/tooltip';
import { Subscription }                                                        from 'rxjs';
import { SpeechService }                                                              from '../../../services/speech.service';
import { VoiceInputFieldComponent } from '../../common/shared/voice-input-field/voice-input-field.component';

@Component({
  selector: 'app-vocal-input',
  standalone: true,
  imports: [
    MatButton,
    MatFabButton,
    MatIcon,
    MatTooltip,
    NgForOf,
    AsyncPipe,
    NgIf,
    MatChip,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatSuffix,
    VoiceInputFieldComponent,
  ],
  templateUrl: './vocal-input.component.html',
  styleUrl: './vocal-input.component.scss',
  providers: [SpeechService]
})
export class VocalInputComponent implements OnInit, OnDestroy {
  public transcript: string = '';
  private subscription: Subscription | undefined;
  value: string = 'test';

  constructor(public speechService: SpeechService) { }

  ngOnInit(): void {
    this.subscription = this.speechService.transcript.subscribe((text: string): void => {
      //console.log(text);
      this.transcript = text;
      //console.log('Component', this.transcript);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.speechService.stopListening(); // Clean up when component is destroyed
  }

  toggle(): void {
    if (this.speechService.isListening) {
      this.speechService.stopListening();
    } else {
      this.speechService.startListening();
    }
  }

}
