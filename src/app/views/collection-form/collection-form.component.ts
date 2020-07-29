import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CollectionService } from '@services/collection.service';
import { ToastrService } from 'ngx-toastr';
import { Collection } from '@models/collections/collection';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.scss']
})
export class CollectionFormComponent implements OnInit, OnDestroy {
  collectionId: string;
  tabId: number;
  routeSubscription: Subscription;
  collection: Collection;
  collectionSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectionSvc: CollectionService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('collectionId');

    this.routeSubscription = this.route.paramMap.subscribe((params: Params) => {
      this.tabId = +params.get('tabId');

      if (!this.tabId) {
        return this.router.navigate(['/kokoelma', this.collectionId, 'muokkaa', 1]);
      }
    });

    this.collectionSubscription = this.collectionSvc.editCollection$.subscribe((collection: Collection) => {
      this.collection = collection;

      if (JSON.stringify(collection) === '{}') {
        this.toastr.error('Yrität muokata kokoelmaa johon sinulla ei ole oikeutta. Mikäli kokoelma on sinun tallentamasi, tarkistathan että olet kirjautunut samalla tunnistautumisella mitä käytit materiaalin jakaessasi.', 'Käyttöoikeusvirhe');

        return this.router.navigate(['/etusivu']);
      }
    });
    this.collectionSvc.updateEditCollection(this.collectionId);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.collectionSubscription.unsubscribe();
  }
}
