import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { KeyValue } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { addCustomItem, descriptionValidator, textInputValidator } from '../../../../shared/shared.module';
import { EducationalMaterialForm } from '@models/educational-material-form';
import { LearningResourceType } from '@models/koodisto/learning-resource-type';
import { EducationalRole } from '@models/koodisto/educational-role';
import { EducationalUse } from '@models/koodisto/educational-use';
import { UploadMessage } from '@models/upload-message';
import { Author } from '@models/material/author';
import { KoodistoService } from '@services/koodisto.service';
import { MaterialService } from '@services/material.service';
import { validatorParams } from '@constants/validator-params';

@Component({
  selector: 'app-tabs-edit-basic-details',
  templateUrl: './edit-basic-details.component.html',
  styleUrls: ['./edit-basic-details.component.scss'],
})
export class EditBasicDetailsComponent implements OnInit, OnDestroy {
  @Input() material: EducationalMaterialForm;
  @Input() materialId: number;
  @Input() tabId: number;
  form: FormGroup;
  lang: string = this.translate.currentLang;
  otherLangs: string[];
  translationsModalRef: BsModalRef;
  thumbnailModalRef: BsModalRef;
  exampleDescriptionModalRef: BsModalRef;
  submitted = false;
  addCustomItem = addCustomItem;
  organizationSubscription: Subscription;
  organizations: KeyValue<string, string>[];
  keywordSubscription: Subscription;
  keywords: KeyValue<string, string>[];
  learningResourceTypeSubscription: Subscription;
  learningResourceTypes: LearningResourceType[];
  educationalRoleSubscription: Subscription;
  educationalRoles: EducationalRole[];
  educationalUseSubscription: Subscription;
  educationalUses: EducationalUse[];
  uploadResponse: UploadMessage = { status: '', message: 0 };
  imageChangedEvent: any = '';
  croppedImage: ImageCroppedEvent;
  thumbnailSrc: string;
  @Output() abortEdit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private materialService: MaterialService,
    private modalService: BsModalService,
    private koodistoSvc: KoodistoService,
    private router: Router,
    private materialSvc: MaterialService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.setTitle();

    this.form = this.fb.group({
      keywords: this.fb.control(null),
      authors: this.fb.array([]),
      learningResourceTypes: this.fb.control(null),
      educationalRoles: this.fb.control(null),
      educationalUses: this.fb.control(null),
      description: this.fb.group({
        fi: this.fb.control(null, [
          Validators.maxLength(validatorParams.description.maxLength),
          descriptionValidator(),
        ]),
        sv: this.fb.control(null, [
          Validators.maxLength(validatorParams.description.maxLength),
          descriptionValidator(),
        ]),
        en: this.fb.control(null, [
          Validators.maxLength(validatorParams.description.maxLength),
          descriptionValidator(),
        ]),
      }),
    });

    this.updateLanguages();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;

      this.koodistoSvc.updateOrganizations();
      this.koodistoSvc.updateKeywords();
      this.koodistoSvc.updateLearningResourceTypes();
      this.koodistoSvc.updateEducationalRoles();
      this.koodistoSvc.updateEducationalUses();

      this.setTitle();
      this.updateLanguages();
    });

    if (!this.materialService.getEducationalMaterialEditForm()) {
      this.form.patchValue(this.material);
      this.patchAuthors(this.material.authors);
    } else {
      const editMaterial: EducationalMaterialForm = this.materialService.getEducationalMaterialEditForm();
      this.form.patchValue(editMaterial);
      this.patchAuthors(editMaterial.authors);
    }

    this.thumbnailSrc = this.material.thumbnail;

    // organizations
    this.organizationSubscription = this.koodistoSvc.organizations$.subscribe(
      (organizations: KeyValue<string, string>[]) => {
        this.organizations = organizations;
      },
    );
    this.koodistoSvc.updateOrganizations();

    // keywords
    this.keywordSubscription = this.koodistoSvc.keywords$.subscribe((keywords: KeyValue<string, string>[]) => {
      this.keywords = keywords;
    });
    this.koodistoSvc.updateKeywords();

    // learning resource types
    this.learningResourceTypeSubscription = this.koodistoSvc.learningResourceTypes$.subscribe(
      (types: LearningResourceType[]) => {
        this.learningResourceTypes = types;
      },
    );
    this.koodistoSvc.updateLearningResourceTypes();

    // educational roles
    this.educationalRoleSubscription = this.koodistoSvc.educationalRoles$.subscribe((roles: EducationalRole[]) => {
      this.educationalRoles = roles;
    });
    this.koodistoSvc.updateEducationalRoles();

    // educational uses
    this.educationalUseSubscription = this.koodistoSvc.educationalUses$.subscribe((uses: EducationalUse[]) => {
      this.educationalUses = uses;
    });
    this.koodistoSvc.updateEducationalUses();
  }

  ngOnDestroy(): void {
    if (this.submitted === false && this.form.dirty && this.form.valid) {
      this.saveData();
    }

    this.organizationSubscription.unsubscribe();
    this.keywordSubscription.unsubscribe();
    this.learningResourceTypeSubscription.unsubscribe();
    this.educationalRoleSubscription.unsubscribe();
    this.educationalUseSubscription.unsubscribe();
  }

  setTitle(): void {
    this.translate
      .get(['common.serviceName', 'titles.editMaterial.main', 'titles.editMaterial.basic'])
      .subscribe((translations: { [key: string]: string }) => {
        this.titleService.setTitle(
          `${translations['titles.editMaterial.main']}: ${translations['titles.editMaterial.basic']} - ${translations['common.serviceName']}`,
        );
      });
  }

  /**
   * Filters otherLangs array to exclude current language.
   */
  updateLanguages(): void {
    // set other than current language to an array
    this.otherLangs = this.translate.getLangs().filter((lang: string) => lang !== this.lang);
  }

  get authorsArray(): FormArray {
    return this.form.get('authors') as FormArray;
  }

  get keywordsCtrl(): FormControl {
    return this.form.get('keywords') as FormControl;
  }

  get learningResourceTypesCtrl(): FormControl {
    return this.form.get('learningResourceTypes') as FormControl;
  }

  get descriptionCtrl(): FormGroup {
    return this.form.get('description') as FormGroup;
  }

  /**
   * Shows modal for uploading thumbnail.
   * @param {TemplateRef<any>} template
   */
  openThumbnailModal(template: TemplateRef<any>): void {
    this.thumbnailModalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-dialog-centered' }));
  }

  imageChange(event: Event): void {
    this.imageChangedEvent = event;
  }

  /**
   * Updates croppedImage.
   * @param {ImageCroppedEvent} event
   */
  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event;
  }

  /**
   * Uploads image to backend. Sets thumbnailSrc and updates thumbnail in session
   * storage. Closes thumbnail modal.
   */
  uploadImage(): void {
    if (this.croppedImage.base64) {
      this.materialSvc.uploadImage(this.croppedImage.base64, this.materialId).subscribe(
        (res: UploadMessage) => {
          this.uploadResponse = res;
          this.thumbnailSrc = this.croppedImage.base64;
          const changedMaterial: EducationalMaterialForm = this.materialService.getEducationalMaterialEditForm()
            ? this.materialService.getEducationalMaterialEditForm()
            : this.material;
          changedMaterial.thumbnail = this.croppedImage.base64;
          this.materialService.setEducationalMaterialEditForm(changedMaterial);
          // close modal
          this.thumbnailModalRef.hide();
        },
        (err) => console.error(err),
      );
    }
  }

  /**
   * Patches authors array.
   * @param authors
   */
  patchAuthors(authors: Author[]): void {
    authors.forEach((author: Author) => {
      if (author.author) {
        this.authorsArray.push(this.createAuthor(author));
      } else {
        this.authorsArray.push(this.createOrganization(author));
      }
    });
  }

  /**
   * Shows modal for entering translation values.
   * @param {TemplateRef<any>} template
   */
  openTranslationsModal(template: TemplateRef<any>): void {
    this.translationsModalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-dialog-centered' }));
  }

  /**
   * Creates author FormGroup.
   * @param {Author} author
   * @returns {FormGroup}
   */
  createAuthor(author?: Author): FormGroup {
    return this.fb.group({
      author: this.fb.control(author?.author ?? null, [
        Validators.maxLength(validatorParams.author.author.maxLength),
        textInputValidator(),
      ]),
      organization: this.fb.control(author?.organization ?? null),
    });
  }

  /**
   * Creates organization FormGroup.
   * @param {Author} organization
   * @returns {FormGroup}
   */
  createOrganization(organization?: Author): FormGroup {
    return this.fb.group({
      organization: this.fb.control(organization?.organization ?? null),
    });
  }

  /**
   * Adds author to authors array.
   */
  addAuthor(): void {
    this.authorsArray.push(this.createAuthor());
  }

  /**
   * Adds organization author to authors array.
   */
  addOrganization(): void {
    this.authorsArray.push(this.createOrganization());
  }

  /**
   * Removes author at specific index from authors array.
   * @param {number} i
   */
  removeAuthor(i: number): void {
    this.authorsArray.removeAt(i);
    this.form.markAsDirty();
  }

  /**
   * Shows modal for example description.
   * @param {TemplateRef<any>} template
   */
  openExampleDescriptionModal(template: TemplateRef<any>): void {
    this.exampleDescriptionModalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-dialog-centered modal-lg' }),
    );
  }

  /**
   * Runs on submit. If form is valid and dirty, changed material is saved on sessionStorage.
   * If form is valid, redirects user to the next tab.
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {
      if (this.form.dirty) {
        this.saveData();
      }
      void this.router.navigate(['/muokkaa-oppimateriaalia', this.materialId, this.tabId + 1]);
    }
  }

  saveData(): void {
    const changedMaterial: EducationalMaterialForm =
      this.materialService.getEducationalMaterialEditForm() || this.material;
    changedMaterial.authors = this.authorsArray.value;
    changedMaterial.keywords = this.keywordsCtrl.value;
    changedMaterial.learningResourceTypes = this.learningResourceTypesCtrl.value;
    changedMaterial.educationalRoles = this.form.get('educationalRoles').value;
    changedMaterial.educationalUses = this.form.get('educationalUses').value;
    changedMaterial.description = this.form.get('description').value;
    this.materialService.setEducationalMaterialEditForm(changedMaterial);
  }

  /**
   * Emits EventEmitter indicating user wants to abort.
   */
  abort(): void {
    this.abortEdit.emit();
  }

  /**
   * Redirects user to previous tab.
   */
  previous(): void {
    void this.router.navigate(['/muokkaa-oppimateriaalia', this.materialId, this.tabId - 1]);
  }
}
