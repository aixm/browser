import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocalInputComponent } from './vocal-input.component';

describe('VocalInputComponent', () => {
  let component: VocalInputComponent;
  let fixture: ComponentFixture<VocalInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocalInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
