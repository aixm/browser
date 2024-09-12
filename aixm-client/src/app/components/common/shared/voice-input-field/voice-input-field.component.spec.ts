import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceInputFieldComponent } from './voice-input-field.component';

describe('VoiceInputFieldComponent', () => {
  let component: VoiceInputFieldComponent;
  let fixture: ComponentFixture<VoiceInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceInputFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
