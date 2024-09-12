import { NgIf }                                        from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconButton }                                             from '@angular/material/button';
import { MatDialog }                  from '@angular/material/dialog';
import { MatFormField, MatFormFieldAppearance, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon }                                                   from '@angular/material/icon';
import { MatInput }                            from '@angular/material/input';
import { MatTooltip }                          from '@angular/material/tooltip';
import { Subscription }                        from 'rxjs';
import { SpeechService }                       from '../../../../services/speech.service';

@Component({
  selector: 'app-voice-input-field',
  standalone: true,
  imports: [
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    MatTooltip,
    NgIf,
  ],
  templateUrl: './voice-input-field.component.html',
  styleUrl: './voice-input-field.component.scss',
  providers: [SpeechService]
})
export class VoiceInputFieldComponent implements OnInit, OnDestroy {
  @Input() appearance: MatFormFieldAppearance = 'fill';
  @Input() label: string = '';
  @Input() style: string = '';
  get value() {
    return this.transcript;
  }
  @Input()
  set value(val: string) {
    this.transcript = val;
    this.onChange(this.transcript);
  }
  public disabled: boolean = false;
  public transcript: string = '';
  private subscription: Subscription | undefined;
  readonly dialog: MatDialog = inject(MatDialog);

  constructor(public speechService: SpeechService) {}

  ngOnInit(): void {
    this.subscription = this.speechService.transcript.subscribe((text: string): void => {
      this.transcript = text;
      //console.log('VoiceInputComponent', this.transcript);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.speechService.stopListening();
  }

  toggle(): void {
    if (this.speechService.isListening) {
      this.speechService.stopListening();
      this.dialog.closeAll();
    } else {
      this.speechService.startListening();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: any): void => {};

  onTouched = (): void => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  writeValue(obj: any): void {
    this.transcript = obj;
  }
}
