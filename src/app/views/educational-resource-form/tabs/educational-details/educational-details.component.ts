import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TabsetComponent } from 'ngx-bootstrap';

import { KoodistoProxyService } from '../../../../services/koodisto-proxy.service';
import { getLocalStorageData } from '../../../../shared/shared.module';
import {
  BasicStudyContent,
  BasicStudySubject,
  GradeEntity,
  GradeEntityContents
} from '../../../../models/basic-study-subject';

@Component({
  selector: 'app-tabs-educational-details',
  templateUrl: './educational-details.component.html',
})
export class EducationalDetailsComponent implements OnInit {
  @Input() tabs: TabsetComponent;

  private localStorageKey = 'aoe.new-educational-resource';
  private lang: string = this.translate.currentLang;
  private savedData: any;

  public educationalDetailsForm: FormGroup;
  public hasEarlyChildhoodEducation = false;
  public hasPrePrimaryEducation = false;
  public hasBasicStudies = false;
  public hasBasicStudySubjects = false;
  public hasUpperSecondarySchool = false;
  public hasVocationalDegree = false;
  public hasSelfMotivatedEducation = false;
  public hasHigherEducation = false;
  private earlyChildhoodEducationKeys: string[];
  private prePrimaryEducationKeys: string[];
  private basicStudyKeys: string[];
  private upperSecondarySchoolKeys: string[];
  private vocationalDegreeKeys: string[];
  private selfMotivatedEducationKeys: string[];
  private higherEducationKeys: string[];

  public educationalLevels$: any[];
  public basicStudySubjects$: BasicStudySubject[];
  public basicStudyObjectives: BasicStudyContent[];
  public basicStudyContents: BasicStudyContent[];
  public upperSecondarySchoolSubjects$: any[];
  public vocationalDegrees$: any[];
  public branchesOfScience$: any[];

  constructor(
    private fb: FormBuilder,
    private koodistoProxySvc: KoodistoProxyService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;
    });

    this.savedData = getLocalStorageData(this.localStorageKey);

    this.educationalDetailsForm = this.fb.group({
      educationalLevels: this.fb.control(null),
      earlyChildhoodEducationSubjects: this.fb.control(null),
      prePrimaryEducationSubjects: this.fb.control(null),
      basicStudySubjects: this.fb.control(null),
      basicStudyObjectives: this.fb.control(null),
      basicStudyContents: this.fb.control(null),
      upperSecondarySchoolSubjects: this.fb.control(null),
      vocationalDegrees: this.fb.control(null),
      selfMotivatedEducationSubjects: this.fb.control(null),
      branchesOfScience: this.fb.control(null),
      scienceBranchObjectives: this.fb.control(null),
    });

    this.koodistoProxySvc.getData('koulutusasteet', this.lang).subscribe(data => {
      this.educationalLevels$ = data;
    });

    this.koodistoProxySvc.getData('oppiaineet', this.lang).subscribe(data => {
      this.basicStudySubjects$ = data;
    });

    this.koodistoProxySvc.getData('lukionkurssit', this.lang).subscribe(data => {
      this.upperSecondarySchoolSubjects$ = data;
    });

    this.koodistoProxySvc.getData('ammatillisentutkinnot', this.lang).subscribe(data => {
      this.vocationalDegrees$ = data;
    });

    this.koodistoProxySvc.getData('tieteenalat', this.lang).subscribe(data => {
      this.branchesOfScience$ = data;
    });

    this.earlyChildhoodEducationKeys = [
      '8e7b8440-286d-4cc9-ad99-9fe288107535',
    ];

    this.prePrimaryEducationKeys = [
      '3ff553ba-a4d7-407c-ad00-80e54ecebd16',
    ];

    this.basicStudyKeys = [
      '8cb1a02f-54cb-499a-b470-4ee980519707',
      '5410475a-a2fb-46d7-9eb4-c572b5d92dbb',
      '7eb3d5be-0575-44db-ab8a-883cf0ae2f26',
      '75e8bed1-b965-483d-8ba4-48a5614c69ba',
      'a2a70a14-b150-4f37-9e20-2bbb71731807',
      '14fe3b08-8516-4999-946b-96eb90c2d563',
    ];

    this.upperSecondarySchoolKeys = [
      '94f79e1e-10e6-483d-b651-27521f94f7bf',
      'fd362a80-9662-48b8-acd1-d8cef520530c',
    ];

    this.vocationalDegreeKeys = [
      '010c6689-5021-4d8e-8c02-68a27cc5a87b',
      '55c5d6a2-8415-47bc-9d15-7b976b0e999c',
      'da5b8f43-5fc9-4681-812b-40846926f3fd',
    ];

    this.selfMotivatedEducationKeys = [
      'bc25d0e7-3c68-49a1-9329-239dae01fab7',
    ];

    this.higherEducationKeys = [
      'e5a48ada-3de0-4246-9b8f-32d4ff68e22f',
      'ff3334db-2a71-4459-8f0d-c42ce2b12a70',
      '9c14f097-68e3-4e6b-a772-71a44442f72f',
      '7c722ac4-f06c-4f2a-a41f-b0c5aa10070a',
    ];

    if (this.savedData) {
      if (this.savedData.educationalLevels) {
        this.educationalDetailsForm.get('educationalLevels').setValue(this.savedData.educationalLevels);

        this.educationalLevelsChange(this.savedData.educationalLevels);
      }

      if (this.savedData.earlyChildhoodEducationSubjects) {
        this.educationalDetailsForm.get('earlyChildhoodEducationSubjects').setValue(this.savedData.earlyChildhoodEducationSubjects);
      }

      if (this.savedData.prePrimaryEducationSubjects) {
        this.educationalDetailsForm.get('prePrimaryEducationSubjects').setValue(this.savedData.prePrimaryEducationSubjects);
      }

      if (this.savedData.basicStudySubjects) {
        this.educationalDetailsForm.get('basicStudySubjects').setValue(this.savedData.basicStudySubjects);

        this.basicStudySubjectsChange(this.savedData.basicStudySubjects);
      }

      if (this.savedData.basicStudyObjectives) {
        this.educationalDetailsForm.get('basicStudyObjectives').setValue(this.savedData.basicStudyObjectives);
      }

      if (this.savedData.basicStudyContents) {
        this.educationalDetailsForm.get('basicStudyContents').setValue(this.savedData.basicStudyContents);
      }

      if (this.savedData.upperSecondarySchoolSubjects) {
        this.educationalDetailsForm.get('upperSecondarySchoolSubjects').setValue(this.savedData.upperSecondarySchoolSubjects);
      }

      if (this.savedData.vocationalDegrees) {
        this.educationalDetailsForm.get('vocationalDegrees').setValue(this.savedData.vocationalDegrees);
      }

      if (this.savedData.selfMotivatedEducationSubjects) {
        this.educationalDetailsForm.get('selfMotivatedEducationSubjects').setValue(this.savedData.selfMotivatedEducationSubjects);
      }

      if (this.savedData.branchesOfScience) {
        this.educationalDetailsForm.get('branchesOfScience').setValue(this.savedData.branchesOfScience);
      }

      if (this.savedData.scienceBranchObjectives) {
        this.educationalDetailsForm.get('scienceBranchObjectives').setValue(this.savedData.scienceBranchObjectives);
      }
    }
  }

  get educationalLevels(): FormControl {
    return this.educationalDetailsForm.get('educationalLevels') as FormControl;
  }

  get earlyChildhoodEducationSubjects(): FormControl {
    return this.educationalDetailsForm.get('earlyChildhoodEducationSubjects') as FormControl;
  }

  get prePrimaryEducationSubjects(): FormControl {
    return this.educationalDetailsForm.get('prePrimaryEducationSubjects') as FormControl;
  }

  get basicStudySubjects(): FormControl {
    return this.educationalDetailsForm.get('basicStudySubjects') as FormControl;
  }

  get upperSecondarySchoolSubjects(): FormControl {
    return this.educationalDetailsForm.get('upperSecondarySchoolSubjects') as FormControl;
  }

  get vocationalDegrees(): FormControl {
    return this.educationalDetailsForm.get('vocationalDegrees') as FormControl;
  }

  get selfMotivatedEducationSubjects(): FormControl {
    return this.educationalDetailsForm.get('selfMotivatedEducationSubjects') as FormControl;
  }

  get branchesOfScience(): FormControl {
    return this.educationalDetailsForm.get('branchesOfScience') as FormControl;
  }

  get scienceBranchObjectives(): FormControl {
    return this.educationalDetailsForm.get('scienceBranchObjectives') as FormControl;
  }

  public educationalLevelsChange($event): void {
    this.hasEarlyChildhoodEducation = $event.filter((e: any) => this.earlyChildhoodEducationKeys.includes(e.key)).length > 0;

    this.hasPrePrimaryEducation = $event.filter((e: any) => this.prePrimaryEducationKeys.includes(e.key)).length > 0;

    this.hasBasicStudies = $event.filter((e: any) => this.basicStudyKeys.includes(e.key)).length > 0;

    if (this.hasBasicStudies === false) {
      this.hasBasicStudySubjects = false;
    }

    this.hasUpperSecondarySchool = $event.filter((e: any) => this.upperSecondarySchoolKeys.includes(e.key)).length > 0;

    this.hasVocationalDegree = $event.filter((e: any) => this.vocationalDegreeKeys.includes(e.key)).length > 0;

    this.hasSelfMotivatedEducation = $event.filter((e: any) => this.selfMotivatedEducationKeys.includes(e.key)).length > 0;

    this.hasHigherEducation = $event.filter((e: any) => this.higherEducationKeys.includes(e.key)).length > 0;
  }

  public basicStudySubjectsChange($event): void {
    this.hasBasicStudySubjects = $event.length > 0;

    this.basicStudyObjectives = [];
    this.basicStudyContents = [];

    $event.forEach((subject: BasicStudySubject) => {
      subject.vuosiluokkakokonaisuudet.forEach((gradeEntity: GradeEntity) => {
        gradeEntity.tavoitteet.forEach((objective: GradeEntityContents) => {
          this.basicStudyObjectives.push({
            key: objective.key,
            value: objective.value[this.lang] !== undefined ? objective.value[this.lang] : objective.value.fi,
            subject: subject.value,
          });
        });

        gradeEntity.sisaltoalueet.forEach((content: GradeEntityContents) => {
          this.basicStudyContents.push({
            key: content.key,
            value: content.value[this.lang] !== undefined ? content.value[this.lang] : content.value.fi,
            subject: subject.value,
          });
        });
      });
    });
  }

  public onSubmit() {
    if (this.educationalDetailsForm.valid) {
      const data = Object.assign({}, getLocalStorageData(this.localStorageKey), this.educationalDetailsForm.value);

      // save data to local storage
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));

      this.tabs.tabs[3].active = true;
    }
  }

  // @todo: some kind of confirmation
  public resetForm() {
    // reset form values
    this.educationalDetailsForm.reset();

    // clear data from local storage
    localStorage.removeItem(this.localStorageKey);
  }

  public previousTab() {
    this.tabs.tabs[1].active = true;
  }
}
