import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { HttpHeaders }            from '@angular/common/http';
import { Component, Inject, OnInit }                               from '@angular/core';
import { CommonModule }                                            from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule }                                         from '@angular/material/button';
import { MatCardModule }                                           from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef }                           from '@angular/material/dialog';
import { MatIconModule }                                           from '@angular/material/icon';
import { MatInputModule }                                          from '@angular/material/input';
import { MatProgressBarModule }                                    from '@angular/material/progress-bar';
import { MatTooltipModule }                                        from '@angular/material/tooltip';
import { MtxSelectModule }                                         from '@ng-matero/extensions/select';
import { Dataset }                                                 from '../../../../models/aixm/dataset';
import { ApiResponse }                                             from '../../../../models/api-response';
import { User }                                                    from '../../../../models/auth/user';
import { FilterUsersPipe }                                         from '../../../../pipes/filter-users.pipe';
import { AuthService }                                             from '../../../../services/auth.service';
import { BackendApiService }                                       from '../../../../services/backend-api.service';

@Component({
  selector: 'app-dataset-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatInputModule, MtxSelectModule, CdkDrag, CdkDragHandle,
  ],
  templateUrl: './dataset-edit.component.html',
  styleUrl: './dataset-edit.component.scss'
})
export class DatasetEditComponent implements OnInit  {
  url: string = 'aixm/datasets';
  urlUsers: string = 'users';
  users: User[] = [];
  dataset!: Dataset;
  loading: boolean = false;

  datasetForm!: FormGroup;
  get name() { return this.datasetForm.get('name'); }
  get description() { return this.datasetForm.get('description'); }
  get userId() { return this.datasetForm.get('userId'); }
  get fileName() { return this.datasetForm.get('fileName'); }
  get file() { return this.datasetForm.get('file'); }

  constructor(
      public authService: AuthService,
      public dialogRef: MatDialogRef<DatasetEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private backendApiService: BackendApiService,
  ) { }

  ngOnInit(): void {
    this.dataset = this.data.dataset;
    if (this.authService.User?.role==='admin') {
      this.refreshUsers();
    }
    this.initForm();
  }

  initForm(): void {
    this.datasetForm = new FormGroup({
      name: new FormControl({ value: this.dataset?.name, disabled: this.data.disableForm}, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      description: new FormControl({value: this.dataset?.description, disabled: this.data.disableForm}, [
        Validators.minLength(2),
        Validators.maxLength(255)
      ]),
      userId: new FormControl(this.dataset?.user ? this.dataset?.user.id : 0,
          this.authService.User?.role==='admin' ? [Validators.required] : null
      ),
      fileName: new FormControl({value: this.dataset?.filename,
        disabled: this.data.disableForm || this.dataset.id}, [Validators.required]),
      file: new FormControl({disabled: this.data.disableForm}),
    });
  }

  save(): void {
    this.datasetForm.markAllAsTouched();
    if (!this.datasetForm.valid) {
      return;
    }
    this.loading = true;
    if (this.dataset.id === undefined) {
      // new
      const formData: FormData = new FormData();
      formData.append('name', this.name?.value);
      formData.append('description', this.description?.value);
      if (this.authService.User?.role==='admin') {
        formData.append('userId', this.userId?.value);
      }
      formData.append('file', this.file?.value);
      this.backendApiService.postItem(this.url, formData, {
        headers: new HttpHeaders({ timeout: `${1000000}` }) }, this.datasetForm)
          .subscribe((data: ApiResponse): void => {
            this.loading = false;
            if (!data.error) {
              this.dialogRef.close(true);
            }
          });
    } else {
      // edit
      this.dataset.name = this.name?.value;
      this.dataset.description = this.description?.value;
      if (this.authService.User?.role==='admin') {
        this.dataset.userId = this.userId?.value;
      }
      this.backendApiService.putItem(this.url, this.dataset, undefined, this.datasetForm)
          .subscribe((data: ApiResponse): void => {
            this.loading = false;
            if (!data.error) {
              this.dialogRef.close(true);
            }
          });
    }
  }

  onFileSelected($event: Event): void {
    const file: File | null | undefined = ($event.target as HTMLInputElement).files?.item(0);
    if (file) {
      this.datasetForm.patchValue({ fileName: file.name});
      this.datasetForm.patchValue({ file: file});
    }
  }

  refreshUsers(): void {
    this.loading = true;
    this.backendApiService.getData(this.urlUsers).subscribe((data: ApiResponse): void => {
      if (data.data) {
        this.users = data.data;
        let u: User = new User();
        u.id=0;
        u.firstName='Public';
        u.lastName='(all users)';
        this.users.unshift(u);
      }
      this.loading = false;
    });
  }

  userSearchFn (term: string, item: User): boolean {
    let userPipe: FilterUsersPipe = new FilterUsersPipe();
    return userPipe.transform([item],term).length>0 ? true : false;
  }
}
