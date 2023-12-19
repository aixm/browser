import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetFeatureComponent } from './dataset-feature.component';

describe('DatasetFeatureComponent', () => {
  let component: DatasetFeatureComponent;
  let fixture: ComponentFixture<DatasetFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetFeatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatasetFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
