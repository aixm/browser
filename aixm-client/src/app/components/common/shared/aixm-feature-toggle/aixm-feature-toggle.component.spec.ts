import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AixmFeatureToggleComponent } from './aixm-feature-toggle.component';

describe('AixmFeatureToggleComponent', () => {
  let component: AixmFeatureToggleComponent;
  let fixture: ComponentFixture<AixmFeatureToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AixmFeatureToggleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AixmFeatureToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
