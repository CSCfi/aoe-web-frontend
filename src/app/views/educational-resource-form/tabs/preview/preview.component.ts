import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { BackendService } from '../../../../services/backend.service';
import { AlignmentObjectExtended } from '../../../../models/alignment-object-extended';
import { UploadedFile } from '../../../../models/uploaded-file';
import { koodistoSources } from '../../../../constants/koodisto-sources';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit {
  private savedDataKey = environment.newERLSKey;
  private fileUploadLSKey = environment.fileUploadLSKey;
  lang: string = this.translate.currentLang;
  savedData: any;
  fileUpload: any;

  earlyChildhoodEducationSubjects: AlignmentObjectExtended[];
  earlyChildhoodEducationObjectives: AlignmentObjectExtended[];
  prePrimaryEducationSubjects: AlignmentObjectExtended[];
  prePrimaryEducationObjectives: AlignmentObjectExtended[];
  basicStudySubjects: AlignmentObjectExtended[];
  basicStudyObjectives: AlignmentObjectExtended[];
  basicStudyContents: AlignmentObjectExtended[];
  upperSecondarySchoolSubjects: AlignmentObjectExtended[];
  upperSecondarySchoolObjectives: AlignmentObjectExtended[];
  vocationalDegrees: AlignmentObjectExtended[];
  vocationalUnits: AlignmentObjectExtended[];
  vocationalEducationObjectives: AlignmentObjectExtended[];
  selfMotivatedEducationSubjects: AlignmentObjectExtended[];
  selfMotivatedEducationObjectives: AlignmentObjectExtended[];
  branchesOfScience: AlignmentObjectExtended[];
  scienceBranchObjectives: AlignmentObjectExtended[];
  prerequisites: AlignmentObjectExtended[];

  previewForm: FormGroup;

  uploadedFileSubscription: Subscription;
  uploadedFiles: UploadedFile[];

  materialId: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private backendSvc: BackendService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;
    });

    this.savedData = JSON.parse(sessionStorage.getItem(this.savedDataKey));
    this.fileUpload = JSON.parse(sessionStorage.getItem(this.fileUploadLSKey));
    this.materialId = this.fileUpload.id;

    this.uploadedFileSubscription = this.backendSvc.uploadedFiles$.subscribe((uploadedFiles: UploadedFile[]) => {
      this.uploadedFiles = uploadedFiles;
    });

    this.backendSvc.updateUploadedFiles(this.materialId);

    this.previewForm = this.fb.group({
      confirm: this.fb.control(false, [ Validators.requiredTrue ])
    });

    if (this.savedData && this.savedData.alignmentObjects) {
      this.earlyChildhoodEducationSubjects = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.earlyChildhoodSubjects);

      this.earlyChildhoodEducationObjectives = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.earlyChildhoodObjectives);

      // @todo: framework

      this.prePrimaryEducationSubjects = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.prePrimarySubjects);

      this.prePrimaryEducationObjectives = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.prePrimaryObjectives);

      this.basicStudySubjects = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.basicStudySubjects);

      this.basicStudyObjectives = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.basicStudyObjectives);

      this.basicStudyContents = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.basicStudyContents);

      this.upperSecondarySchoolSubjects = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.upperSecondarySubjects);

      this.upperSecondarySchoolObjectives = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.upperSecondaryObjectives);

      this.vocationalDegrees = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.vocationalDegrees);

      this.vocationalUnits = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.vocationalUnits);

      this.vocationalEducationObjectives = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.vocationalObjectives);

      this.selfMotivatedEducationSubjects = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.selfMotivatedSubjects);

      this.selfMotivatedEducationObjectives = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.selfMotivatedObjectives);

      this.branchesOfScience = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.scienceBranches);

      this.scienceBranchObjectives = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.scienceBranchObjectives);

      this.prerequisites = this.savedData.alignmentObjects
        .filter((alignmentObject: AlignmentObjectExtended) => alignmentObject.source === koodistoSources.prerequisites);
    }
  }

  onSubmit() {
    if (this.previewForm.valid) {
      this.backendSvc.postMeta(+this.fileUpload.id, this.savedData).subscribe(() => {
        // clean up session storage
        sessionStorage.removeItem(this.savedDataKey);
        sessionStorage.removeItem(this.fileUploadLSKey);

        // redirect to new material
        this.router.navigate([ '/materiaali', this.fileUpload.id ]);
      });
    }
  }

  // @todo: some kind of confirmation
  resetForm() {
    // reset form values
    this.previewForm.reset();

    // clear data from session storage
    sessionStorage.removeItem(this.savedDataKey);
    sessionStorage.removeItem(this.fileUploadLSKey);
  }

  previousTab() {
    this.router.navigate(['/lisaa-oppimateriaali', 6]);
  }
}
