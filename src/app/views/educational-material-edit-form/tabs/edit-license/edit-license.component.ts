import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EducationalMaterialForm } from '@models/educational-material-form';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { License } from '@models/koodisto/license';
import { KoodistoService } from '@services/koodisto.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { TitlesMaterialFormTabs } from '@models/translations/titles';
import { MaterialService } from '@services/material.service';

@Component({
  selector: 'app-tabs-edit-license',
  templateUrl: './edit-license.component.html',
  styleUrls: ['./edit-license.component.scss'],
})
export class EditLicenseComponent implements OnInit, OnDestroy {
  @Input() material: EducationalMaterialForm;
  @Input() materialId: number;
  @Input() tabId: number;
  form: FormGroup;
  lang: string = this.translate.currentLang;
  submitted: boolean = false;
  licenseSubscription: Subscription;
  licenses: License[];
  @Output() abortEdit: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private koodistoSvc: KoodistoService,
    private materialService: MaterialService,
    private router: Router,
    private titleSvc: Title,
  ) {}

  ngOnInit(): void {
    this.setTitle();

    this.form = this.fb.group({
      license: this.fb.control(null),
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;

      this.setTitle();

      this.koodistoSvc.updateLicenses();
    });

    if (!this.materialService.getEducationalMaterialID()) {
      this.form.patchValue(this.material);
    } else {
      this.form.patchValue({ id: this.materialService.getEducationalMaterialID() });
    }

    // licenses
    this.licenseSubscription = this.koodistoSvc.licenses$.subscribe((licenses: License[]) => {
      this.licenses = licenses;
    });
    this.koodistoSvc.updateLicenses();
  }

  ngOnDestroy(): void {
    if (this.submitted === false && this.form.dirty && this.form.valid) {
      this.saveData();
    }
    this.licenseSubscription.unsubscribe();
  }

  setTitle(): void {
    this.translate.get('titles.editMaterial').subscribe((translations: TitlesMaterialFormTabs) => {
      this.titleSvc.setTitle(`${translations.main}: ${translations.license} ${environment.title}`);
    });
  }

  get licenseCtrl(): FormControl {
    return this.form.get('license') as FormControl;
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
    const changedMaterial: EducationalMaterialForm = this.materialService.getEducationalMaterialEditForm()
      ? this.materialService.getEducationalMaterialEditForm()
      : this.material;
    changedMaterial.license = this.form.get('license').value;
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
