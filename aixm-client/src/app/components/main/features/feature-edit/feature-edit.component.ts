import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

import { Component, Inject, OnInit }                                            from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators }              from '@angular/forms';
import { MatButton, MatIconButton }                                             from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef }                                        from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel }                            from '@angular/material/form-field';
import { MatIcon }                                                              from '@angular/material/icon';
import { MatInput }                                                             from '@angular/material/input';
import { MatProgressBar }                                                       from '@angular/material/progress-bar';
import { MatTooltip }                                                           from '@angular/material/tooltip';
import { MtxSelect }                                                            from '@ng-matero/extensions/select';
import { Feature }                                                              from '../../../../models/aixm/feature';
import { ApiResponse }                                                          from '../../../../models/api-response';
import { AuthService }                                                          from '../../../../services/auth.service';
import { BackendApiService }                                                    from '../../../../services/backend-api.service';
import { FeatureService }                                                       from '../../../../services/feature.service';

@Component({
  selector: 'app-feature-edit',
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatProgressBar,
    MatTooltip,
    MtxSelect,
    ReactiveFormsModule,
    CdkDrag,
    CdkDragHandle
],
  templateUrl: './feature-edit.component.html',
  styleUrl: './feature-edit.component.scss',
  standalone: true
})
export class FeatureEditComponent implements OnInit {
  url: string = 'aixm/features';
  feature!: Feature;
  loading: boolean = false;
  featureForm!: FormGroup;

  get name() { return this.featureForm.get('name'); }
  get type() { return this.featureForm.get('type'); }
  get abbreviation() { return this.featureForm.get('abbreviation'); }
  get prefix() { return this.featureForm.get('prefix'); }
  get order() { return this.featureForm.get('order'); }
  get namespace() { return this.featureForm.get('namespace'); }
  get description() { return this.featureForm.get('description'); }

  constructor(
      public authService: AuthService,
      public featureService: FeatureService,
      public dialogRef: MatDialogRef<FeatureEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private backendApiService: BackendApiService,
  ) { }

  ngOnInit(): void {
    this.feature = this.data.feature;
    this.initForm();
  }

  initForm(): void {
    this.featureForm = new FormGroup({
      name: new FormControl({ value: this.feature?.name, disabled: this.data.disableForm}, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      type: new FormControl({value: this.feature?.type, disabled: this.data.disableForm}, [
        Validators.required
      ]),
      abbreviation: new FormControl({value: this.feature?.abbreviation, disabled: this.data.disableForm}, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ]),
      order: new FormControl({value: this.feature?.order, disabled: this.data.disableForm}, [
        Validators.pattern("^[0-9]*$")
      ]),
      prefix: new FormControl({value: this.feature?.prefix, disabled: this.data.disableForm}, [
        Validators.minLength(2),
        Validators.maxLength(255)
      ]),
      namespace: new FormControl({value: this.feature?.namespace, disabled: this.data.disableForm}, [
        Validators.minLength(2),
        Validators.maxLength(255)
      ]),
      description: new FormControl({value: this.feature?.description, disabled: this.data.disableForm}, [
        Validators.minLength(2),
        Validators.maxLength(255)
      ]),
    });
  }

  save(): void {
    this.featureForm.markAllAsTouched();
    if (!this.featureForm.valid) {
      return;
    }
    this.loading = true;
    this.feature.name = this.name?.value;
    this.feature.type = this.type?.value;
    this.feature.abbreviation = this.abbreviation?.value;
    this.feature.order = this.order?.value;
    this.feature.prefix = this.prefix?.value;
    this.feature.namespace = this.namespace?.value;
    this.feature.description = this.description?.value;
    if (this.feature.id === undefined) {
      // new
      this.backendApiService.postItem(this.url, this.feature, undefined, this.featureForm).subscribe((data: ApiResponse): void => {
        this.loading = false;
        if (!data.error) {
          this.dialogRef.close(true);
        }
      });
    } else {
      // edit
      this.backendApiService.putItem(this.url, this.feature, undefined, this.featureForm).subscribe((data: ApiResponse): void => {
        this.loading = false;
        if (!data.error) {
          this.dialogRef.close(true);
        }
      });
    }
  }

}
