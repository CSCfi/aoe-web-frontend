import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { HOMEPAGE } from '../../mocks/demo/home-page.mock';

@Component({
  templateUrl: 'main-view.component.html'
})
export class MainViewComponent implements OnInit, OnDestroy {
  private langChangeSubscription: Subscription;
  private contents = HOMEPAGE;
  public pageContent;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.pageContent = this.contents[this.translate.currentLang];

    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.pageContent = this.contents[event.lang];
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }
}
