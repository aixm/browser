import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AixmIconComponent } from './aixm-icon.component';

describe('AixmIconComponent', () => {
  let component: AixmIconComponent;
  let fixture: ComponentFixture<AixmIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AixmIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AixmIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
