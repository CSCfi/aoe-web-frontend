import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { LearningResourceTypeService } from '../../services/learning-resource-type.service';

import { EducationalMaterial } from '../../models/demo/educational-material';
import { EDUCATIONALMATERIALS } from '../../mocks/demo/educational-materials.mock';
import { Material } from '../../models/demo/material';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-demo-material-view',
  templateUrl: './educational-material-view.component.html',
})
export class EducationalMaterialViewComponent implements OnInit, OnDestroy {
  private educationalMaterials: EducationalMaterial[] = EDUCATIONALMATERIALS;
  public educationalMaterial: EducationalMaterial;
  private routeSubscription: Subscription;
  private langChangeSubscription: Subscription;
  public previewMaterial: Material;
  private specialId: number;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public lrtSvc: LearningResourceTypeService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.specialId = +params['specialId'];

      this.educationalMaterial = this.educationalMaterials.find(m =>
        m.specialId === this.specialId && m.inLanguage.id.toLocaleLowerCase() === this.translate.currentLang);

      this.previewMaterial = this.educationalMaterial.materials[0];
    });

    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.educationalMaterial = this.educationalMaterials.find(m =>
       m.specialId === this.specialId && m.inLanguage.id.toLocaleLowerCase() === event.lang);

       this.previewMaterial = this.educationalMaterial.materials[0];
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.langChangeSubscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  setPreviewMaterial(material: Material): void {
    this.previewMaterial = material;
  }
}
