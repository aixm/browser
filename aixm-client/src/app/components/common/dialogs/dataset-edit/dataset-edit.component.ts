import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule }                                            from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule }                                           from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Dataset }                                  from '../../../../models/aixm/dataset';
import { ApiResponse } from '../../../../models/api-response';
import { BackendApiService } from '../../../../services/backend-api.service';

@Component({
  selector: 'app-dataset-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatInputModule,
  ],
  templateUrl: './dataset-edit.component.html',
  styleUrl: './dataset-edit.component.scss'
})
export class DatasetEditComponent implements OnInit  {
  url = 'aixm/datasets';
  dataset!: Dataset;
  loading: boolean = false;

  datasetForm!: FormGroup;
  get name() { return this.datasetForm.get('name'); }
  get description() { return this.datasetForm.get('description'); }
  get fileName() { return this.datasetForm.get('fileName'); }
  get file() { return this.datasetForm.get('file'); }

  constructor(
      public dialogRef: MatDialogRef<DatasetEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private backendApiService: BackendApiService,
      private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.dataset = this.data.dataset;
    this.initForm();
  }

  initForm(): void {
    this.datasetForm = new FormGroup({
      name: new FormControl(this.dataset?.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      description: new FormControl(this.dataset?.description, [
        Validators.minLength(2),
        Validators.maxLength(255)
      ]),
      fileName: new FormControl(this.dataset?.filename, [Validators.required]),
      file: new FormControl(),
    });
  }

  save(): void {
    this.datasetForm.markAllAsTouched();
    if (!this.datasetForm.valid) {
      return;
    }
    this.loading = true;
    const formData: FormData = new FormData();
    formData.append('name', this.name?.value);
    formData.append('description', this.description?.value);
    if (this.dataset.id === undefined) {
      // new
      formData.append('file', this.file?.value);
      this.backendApiService.postItem(this.url, formData, undefined, this.datasetForm)
          .subscribe((data: ApiResponse): void => {
            this.loading = false;
            if (!data.error) {
              this.dialogRef.close(true);
            }
          });
    } else {
      // edit
      this.backendApiService.putItem(this.url, formData, undefined, this.datasetForm)
          .subscribe((data: ApiResponse): void => {
            this.loading = false;
            if (!data.error) {
              this.dialogRef.close(true);
            }
          });
    }
  }

  onFileSelected($event: Event) {
    const file: File | null | undefined = ($event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.datasetForm.patchValue({ fileName: file.name});
      this.datasetForm.patchValue({ file: file});
    }
  }
}
