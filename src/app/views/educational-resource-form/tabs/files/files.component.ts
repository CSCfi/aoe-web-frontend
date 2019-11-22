import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import slugify from 'slugify';

import { environment } from '../../../../../environments/environment';
import { KoodistoProxyService } from '../../../../services/koodisto-proxy.service';
import { BackendService } from '../../../../services/backend.service';
import { getLocalStorageData } from '../../../../shared/shared.module';
import { AuthService } from '../../../../services/auth.service';
import { UploadMessage } from '../../../../models/upload-message';
import { Language } from '../../../../models/koodisto-proxy/language';
import { mimeTypes } from '../../../../constants/mimetypes';
import { UploadedFile } from '../../../../models/uploaded-file';

@Component({
  selector: 'app-tabs-files',
  templateUrl: './files.component.html',
})
export class FilesComponent implements OnInit, OnDestroy {
  private localStorageKey = environment.newERLSKey;
  private fileUploadLSKey = environment.fileUploadLSKey;
  lang: string = this.translate.currentLang;
  otherLangs: string[];
  savedData: any;

  fileUploadForm: FormGroup;
  submitted = false;
  modalRef: BsModalRef;
  uploadResponse: UploadMessage = { status: '', message: 0 };
  uploadError: string;

  languageSubscription: Subscription;
  languages: Language[];
  uploadedFileSubscription: Subscription;
  uploadedFiles: UploadedFile[];

  materialId: number;

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
    this.fileUploadForm = this.fb.group({
      name: this.fb.group({
        fi: this.fb.control(null),
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

    this.updateLanguages();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;

      this.koodistoProxySvc.updateLanguages();

      this.updateLanguages();
    });

    this.languageSubscription = this.koodistoProxySvc.languages$.subscribe((languages: Language[]) => {
      this.languages = languages;
    });
    this.koodistoProxySvc.updateLanguages();

    this.savedData = getLocalStorageData(this.localStorageKey);

    if (this.savedData) {
      if (this.savedData.name) {
        this.fileUploadForm.get('name').patchValue(this.savedData.name);
      }

      if (this.savedData.slug) {
        this.fileUploadForm.get('slug').patchValue(this.savedData.slug);
      }
    }

    if (localStorage.getItem(this.fileUploadLSKey) !== null) {
      const fileUpload = getLocalStorageData(this.fileUploadLSKey);

      this.materialId = fileUpload.id;

      this.uploadedFileSubscription = this.backendSvc.uploadedFiles$.subscribe((uploadedFiles: UploadedFile[]) => {
        this.uploadedFiles = uploadedFiles;
      });

      this.backendSvc.updateUploadedFiles(this.materialId);
    }
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }

  updateLanguages(): void {
    // set other than current language to an array
    this.otherLangs = this.translate.getLangs().filter((lang: string) => lang !== this.lang);

    // set other languages validators null for name
    this.otherLangs.forEach((lang: string) => {
      this.names.get(lang).setValidators(null);
      this.names.get(lang).updateValueAndValidity();
    });

    // set current language validator required for name
    this.names.get(this.lang).setValidators([ Validators.required ]);
    this.names.get(this.lang).updateValueAndValidity();

  }

  get name(): FormControl {
    return this.fileUploadForm.get(`name.${this.lang}`) as FormControl;
  }

  get names(): FormGroup {
    return this.fileUploadForm.get('name') as FormGroup;
  }

  get files(): FormArray {
    return this.fileUploadForm.get('files') as FormArray;
  }

  createFile(): FormGroup {
    return this.fb.group({
      file: [''],
      link: this.fb.control(null),
      language: this.fb.control(this.lang),
      displayName: this.fb.group({
        fi: this.fb.control(null),
        sv: this.fb.control(null),
        en: this.fb.control(null),
      }),
      subtitles: this.fb.array([]),
    });
  }

  addFile(): void {
    this.files.push(this.createFile());
  }

  createSubtitle(): FormGroup {
    return this.fb.group({
      file: [''],
      default: this.fb.control(false),
      kind: this.fb.control('subtitles'),
      label: this.fb.control(null),
      srclang: this.fb.control(null),
    });
  }

  addSubtitle(i): void {
    this.files.at(i).get('subtitles').value.push(this.createSubtitle());
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-dialog-centered' })
    );
  }

  // @todo: move slug creation to backend
  updateSlug(value, lang): void {
    this.fileUploadForm.get(`slug.${lang}`).setValue(slugify(value.target.value).toLowerCase());
  }

  onFileChange(event, i): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (mimeTypes.video.includes(file.type)) {
        console.log('video spotted!');
        // @todo: video spotted, add subtitles
      }

      this.files.at(i).get('file').setValue(file);

      // remove extension from filename
      this.files.at(i).get('displayName').setValue({
        fi: file.name.replace(/\.[^/.]+$/, ''),
        sv: file.name.replace(/\.[^/.]+$/, ''),
        en: file.name.replace(/\.[^/.]+$/, ''),
      });
    }
  }

  validateFiles(): void {
    let fileCount = 0;

    this.files.controls.forEach(ctrl => {
      if (ctrl.get('file').value !== '' || ctrl.get('link').value !== null) {
        fileCount++;

        ctrl.get('language').setValidators([ Validators.required ]);
        ctrl.get('language').updateValueAndValidity();

        ctrl.get(`displayName.${this.lang}`).setValidators([ Validators.required ]);
        ctrl.get(`displayName.${this.lang}`).updateValueAndValidity();
      }
    });

    if (fileCount > 0) {
      this.files.controls.forEach((control, i) => {
        if (control.get('file').value === '' && control.get('link').value === null) {
          this.files.removeAt(i);
        }
      });
    } else {
      this.files.setErrors({ 'required': true });
    }
  }

  uploadFiles() {
    this.myFiles.forEach(file => {
      const formData = new FormData();
      formData.append('myFiles', file);
      formData.append('username', this.authSvc.getUser().username);

      this.backendSvc.uploadFiles(formData).subscribe(
        (res) => {
          this.uploadResponse = res;

          if (this.uploadResponse.status === 'completed') {
            const fileUpload = getLocalStorageData(this.fileUploadLSKey);
            const fileDetails: any[] = [];

            fileUpload.material.forEach(m => {
              const materialFile = this.files.value.find(f => f.file.name === m.createFrom);

              fileDetails.push({
                id: m.id,
                displayName: materialFile.displayName,
                language: materialFile.language,
              });
            });

            const updatedData = Object.assign(
              {},
              getLocalStorageData(this.localStorageKey),
              { fileDetails: fileDetails },
            );

            // save data to local storage
            localStorage.setItem(this.localStorageKey, JSON.stringify(updatedData));
          }
        },
        (err) => this.uploadError = err,
      );
    });
  }

  deleteFile(fileId: number): void {
    this.backendSvc.deleteFile(fileId).subscribe(
      () => this.backendSvc.updateUploadedFiles(this.materialId),
      (err) => console.error(err),
    );
  }

  onSubmit(): void {
    this.submitted = true;

    this.validateFiles();

    if (this.fileUploadForm.valid) {
      const data = Object.assign(
        {},
        getLocalStorageData(this.localStorageKey),
        { name: this.fileUploadForm.get('name').value },
        { slug: this.fileUploadForm.get('slug').value },
      );

      // save data to local storage
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));

      const formData = new FormData();
      formData.append('username', this.authSvc.getUser().username);

      this.backendSvc.uploadFiles(formData).subscribe(
        (res) => this.uploadResponse = res,
        (err) => this.uploadError = err,
        () => this.uploadFiles(),
      );
    }
  }

  resetForm(): void {
    // reset submit status
    this.submitted = false;

    // reset form values
    this.fileUploadForm.reset();

    // clear data from local storage
    localStorage.removeItem(this.localStorageKey);
    localStorage.removeItem(this.fileUploadLSKey);
  }
}
