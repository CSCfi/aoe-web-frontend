import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TabsetComponent } from 'ngx-bootstrap';

import { KoodistoProxyService } from '../../../../services/koodisto-proxy.service';

@Component({
  selector: 'app-tabs-educational-details',
  templateUrl: './educational-details.component.html',
})
export class EducationalDetailsComponent implements OnInit {
  @Input() tabs: TabsetComponent;

  // private localStorageKey = 'aoe.new-educational-resource';
  private lang: string = this.translate.currentLang;
  // private savedData = JSON.parse(localStorage.getItem(this.localStorageKey));

  public educationalDetailsForm: FormGroup;
  public hasBasicStudies = false;

  public educationalLevels$: Observable<any>;
  public educationalLevelsRefactored$: Observable<any>;
  public basicStudiesSubjects$: object[];

  constructor(
    private fb: FormBuilder,
    private koodistoProxySvc: KoodistoProxyService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;
    });

    this.educationalDetailsForm = this.fb.group({
      educationalLevels: this.fb.control(null),
      basicStudiesSubjects: this.fb.control(false),
    });

    this.educationalLevels$ = this.koodistoProxySvc.getData('koulutusasteet', this.lang);
    this.educationalLevelsRefactored$ = this.koodistoProxySvc.getData('koulutusasteet/refactored', this.lang);

    this.koodistoProxySvc.getData('peruskoulutuksenoppiaineet', this.lang).subscribe(data => {
      this.basicStudiesSubjects$ = data;
    });
  }

  get educationalLevels() {
    return this.educationalDetailsForm.get('educationalLevels');
  }

  educationalLevelsChange($event) {
    this.hasBasicStudies = $event.filter((e: any) => e.key === '8cb1a02f-54cb-499a-b470-4ee980519707').length > 0;
  }

  onSubmit() {
    console.warn(this.educationalDetailsForm.value);
  }

  public previousTab() {
    this.tabs.tabs[1].active = true;
  }
}
