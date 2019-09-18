import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { KeyValue } from '@angular/common';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../../environments/environment';
import { KoodistoProxyService } from '../../../../services/koodisto-proxy.service';
import { getLocalStorageData, addCustomItem } from '../../../../shared/shared.module';

@Component({
  selector: 'app-tabs-extended-details',
  templateUrl: './extended-details.component.html',
})
export class ExtendedDetailsComponent implements OnInit {
  private localStorageKey = environment.newERLSKey;
  private lang: string = this.translate.currentLang;
  private savedData: any;

  public accessibilityFeatures$: KeyValue<string, string>[];
  public accessibilityHazards$: KeyValue<string, string>[];

  public extendedDetailsForm: FormGroup;

  public addCustomItem = addCustomItem;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private koodistoProxySvc: KoodistoProxyService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;
    });

    this.savedData = getLocalStorageData(this.localStorageKey);

    this.extendedDetailsForm = this.fb.group({
      accessibilityFeatures: this.fb.control(null),
      accessibilityHazards: this.fb.control(null),
      typicalAgeRange: this.fb.group({
        typicalAgeRangeMin: this.fb.control(null),
        typicalAgeRangeMax: this.fb.control(null),
      }),
      timeRequired: this.fb.control(null),
      publisher: this.fb.control(null),
      expires: this.fb.control(null),
      prerequisites: this.fb.control(null),
    });

    this.koodistoProxySvc.getData('saavutettavuudentukitoiminnot', this.lang).subscribe(data => {
      this.accessibilityFeatures$ = data;
    });

    this.koodistoProxySvc.getData('saavutettavuudenesteet', this.lang).subscribe(data => {
      this.accessibilityHazards$ = data;
    });

    if (this.savedData) {
      if (this.savedData.accessibilityFeatures) {
        this.extendedDetailsForm.get('accessibilityFeatures').setValue(this.savedData.accessibilityFeatures);
      }

      if (this.savedData.accessibilityHazards) {
        this.extendedDetailsForm.get('accessibilityHazards').setValue(this.savedData.accessibilityHazards);
      }

      if (this.savedData.typicalAgeRange) {
        this.extendedDetailsForm.get('typicalAgeRange').setValue(this.savedData.typicalAgeRange);
      }

      if (this.savedData.timeRequired) {
        this.extendedDetailsForm.get('timeRequired').setValue(this.savedData.timeRequired);
      }

      if (this.savedData.publisher) {
        this.extendedDetailsForm.get('publisher').setValue(this.savedData.publisher);
      }

      if (this.savedData.expires) {
        this.extendedDetailsForm.get('expires').setValue(new Date(this.savedData.expires));
      }

      if (this.savedData.prerequisites) {
        this.extendedDetailsForm.get('prerequisites').setValue(this.savedData.prerequisites);
      }
    }
  }

  public onSubmit() {
    if (this.extendedDetailsForm.valid) {
      const data = Object.assign({}, getLocalStorageData(this.localStorageKey), this.extendedDetailsForm.value);

      // save data to local storage
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));

      this.router.navigate(['/lisaa-oppimateriaali', 5]);
    }
  }

  // @todo: some kind of confirmation
  public resetForm() {
    // reset form values
    this.extendedDetailsForm.reset();

    // clear data from local storage
    localStorage.removeItem(this.localStorageKey);
  }

  public previousTab() {
    this.router.navigate(['/lisaa-oppimateriaali', 3]);
  }
}
