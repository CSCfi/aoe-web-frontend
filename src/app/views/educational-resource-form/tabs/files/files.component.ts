import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeyValue } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import slugify from 'slugify';

import { environment } from '../../../../../environments/environment';
import { KoodistoProxyService } from '../../../../services/koodisto-proxy.service';
import { BackendService } from '../../../../services/backend.service';
import { getLocalStorageData } from '../../../../shared/shared.module';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-tabs-files',
  templateUrl: './files.component.html',
})
export class FilesComponent implements OnInit {
  private localStorageKey = environment.newERLSKey;
  private lang: string = this.translate.currentLang;
  private savedData: any;

  public fileUploadForm: FormGroup;
  public modalRef: BsModalRef;
  public uploadResponse: { message: number | string; status: string } = { status: '', message: 0 };
  public uploadError: string;
  private myFiles = [];

  public languages$: KeyValue<string, string>[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private koodistoProxySvc: KoodistoProxyService,
    private translate: TranslateService,
    private backendSvc: BackendService,
    private authSvc: AuthService,
  ) { }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;
    });

    this.savedData = getLocalStorageData(this.localStorageKey);

    this.fileUploadForm = this.fb.group({
      name: this.fb.group({
        fi: this.fb.control(null, [ Validators.required ]),
        sv: this.fb.control(null),
        en: this.fb.control(null),
      }),
      slug: this.fb.group({
        fi: this.fb.control(null),
        sv: this.fb.control(null),
        en: this.fb.control(null),
      }),
      files: this.fb.array([
        this.createFile(),
        this.createFile(),
      ]),
    });

    this.koodistoProxySvc.getData('kielet', this.lang).subscribe(data => {
      this.languages$ = data;
    });

    if (this.savedData) {
      if (this.savedData.files) {
        while (this.files.length) {
          this.files.removeAt(0);
        }

        /*this.savedData.files.forEach(() => this.addFile());

        this.fileUploadForm.get('files').setValue(this.savedData.files);*/
      }

      if (this.savedData.name) {
        this.fileUploadForm.get('name').patchValue(this.savedData.name);
      }

      if (this.savedData.slug) {
        this.fileUploadForm.get('slug').patchValue(this.savedData.slug);
      }
    }

    // this.onChanges();
  }

  get files() {
    return this.fileUploadForm.get('files') as FormArray;
  }

  public createFile(): FormGroup {
    return this.fb.group({
      // file: this.fb.control(null, [ Validators.required ]),
      // link: this.fb.control(null, [ Validators.required ]),
      file: this.fb.control(null),
      link: this.fb.control(null),
      language: this.fb.control({ key: 'FI', value: 'suomi' }),
      displayName: this.fb.group({
        fi: this.fb.control(null),
        sv: this.fb.control(null),
        en: this.fb.control(null),
      }),
    });
  }

  public addFile() {
    this.files.push(this.createFile());
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-dialog-centered' })
    );
  }

  private onChanges(): void {
    this.fileUploadForm.get('files').valueChanges.subscribe(() => {
      // @todo: create function of this so it can be called when data is loaded from local storage too
      this.files.controls.forEach((control) => {
        const fileCtrl = control.get('file');
        const linkCtrl = control.get('link');

        if (linkCtrl.value !== null) {
          fileCtrl.setValidators(null);
          fileCtrl.updateValueAndValidity({ emitEvent: false });
        }

        if (fileCtrl.value !== null) {
          linkCtrl.setValidators(null);
          linkCtrl.updateValueAndValidity({ emitEvent: false });
        }
      });
    });
  }

  public updateSlug(value, lang) {
    this.fileUploadForm.get(`slug.${lang}`).setValue(slugify(value.target.value));
  }

  public onFileChange(event): void {
    if (event.target.files.length > 0) {
      this.myFiles.push(event.target.files[0]);
    }
  }

  public onSubmit() {
    // remove files that doesn't have either file nor link
    this.files.controls.forEach((control, i) => {
      if (control.get('file').value === '' && control.get('link').value === null) {
        this.files.removeAt(i);
      }
    });

    if (this.fileUploadForm.valid) {
      // @todo: use fileUploadForm.slugs instead?
      const slugs = {
        fi: this.fileUploadForm.get('name').value.fi ? slugify(this.fileUploadForm.get('name').value.fi).toLowerCase() : undefined,
        sv: this.fileUploadForm.get('name').value.sv ? slugify(this.fileUploadForm.get('name').value.sv).toLowerCase() : undefined,
        en: this.fileUploadForm.get('name').value.en ? slugify(this.fileUploadForm.get('name').value.en).toLowerCase() : undefined,
      };

      // @todo: is this unnecessary?
      const newData = {
        name: this.fileUploadForm.get('name').value,
        slug: slugs,
      };

      const data = Object.assign({}, getLocalStorageData(this.localStorageKey), newData);

      // save data to local storage
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));

      const formData = new FormData();

      this.myFiles.forEach(file => {
        formData.append('myFiles', file);
      });

      formData.append('username', this.authSvc.getUser().username);

      this.backendSvc.uploadFiles(formData).subscribe(
        (res) => {
          this.uploadResponse = res;

          if (this.uploadResponse.status === 'completed') {
            this.router.navigate(['/lisaa-oppimateriaali', 2]);
          }
        },
        (err) => this.uploadError = err,
      );
    }
  }

  // @todo: some kind of confirmation
  public resetForm() {
    // reset form values
    this.fileUploadForm.reset();

    // clear data from local storage
    localStorage.removeItem(this.localStorageKey);
  }
}
