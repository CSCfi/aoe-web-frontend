import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from '@services/auth.service';
import { MaterialService } from '@services/material.service';
import { EducationalMaterialCard } from '@models/educational-material-card';
import { Subscription } from 'rxjs';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UserCollection } from '@models/collections/user-collection';
import { CollectionService } from '@services/collection.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-materials-view',
  templateUrl: './user-materials-view.component.html',
  styleUrls: ['./user-materials-view.component.scss'],
})
export class UserMaterialsViewComponent implements OnInit, OnDestroy {
  lang: string = this.translate.currentLang;
  publishedMaterialSubscription: Subscription;
  publishedMaterials: EducationalMaterialCard[];
  unpublishedMaterialSubscription: Subscription;
  unpublishedMaterials: EducationalMaterialCard[];
  privateCollectionSubscription: Subscription;
  privateCollections: UserCollection[];
  publicCollectionSubscription: Subscription;
  publicCollections: UserCollection[];
  serviceName: string;

  constructor(
    private materialService: MaterialService,
    private translate: TranslateService,
    private collectionService: CollectionService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.setTitle();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;

      this.setTitle();
    });

    this.publishedMaterialSubscription = this.materialService.publishedUserMaterials$$.subscribe(
      (materials: EducationalMaterialCard[]) => {
        this.publishedMaterials = materials;
      },
    );

    this.unpublishedMaterialSubscription = this.materialService.unpublishedUserMaterials$$.subscribe(
      (materials: EducationalMaterialCard[]) => {
        this.unpublishedMaterials = materials;
      },
    );

    this.materialService.updateUserMaterialList();

    this.privateCollectionSubscription = this.collectionService.privateUserCollections$.subscribe(
      (collections: UserCollection[]) => {
        this.privateCollections = collections;
      },
    );

    this.publicCollectionSubscription = this.collectionService.publicUserCollections$.subscribe(
      (collections: UserCollection[]) => {
        this.publicCollections = collections;
      },
    );

    this.collectionService.updateUserCollections();
  }

  ngOnDestroy(): void {
    this.publishedMaterialSubscription.unsubscribe();
    this.unpublishedMaterialSubscription.unsubscribe();
    this.privateCollectionSubscription.unsubscribe();
    this.publicCollectionSubscription.unsubscribe();
  }

  setTitle(): void {
    this.translate
      .get(['common.serviceName', 'titles.userMaterials'])
      .subscribe((translations: { [key: string]: string }) => {
        this.titleService.setTitle(`${translations['titles.userMaterials']} - ${translations['common.serviceName']}`);
      });
  }

  expireAlertType(date: Date): string {
    return new Date(date) < new Date() ? 'expired' : 'expires';
  }
}
