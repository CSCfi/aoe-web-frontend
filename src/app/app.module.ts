import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { LoginComponent } from './views/login/login.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppBreadcrumbModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgSelectModule } from '@ng-select/ng-select';

import { SharedModule, HttpLoaderFactory } from './shared/shared.module';

import { AddMaterialComponent } from './views/add-material/add-material.component';
import { HelpViewComponent } from './views/help-view/help-view.component';
import { TermsOfUseViewComponent } from './views/terms-of-use-view/terms-of-use-view.component';
import { PrivacyPolicyViewComponent } from './views/privacy-policy-view/privacy-policy-view.component';
import { AccessibilityPolicyViewComponent } from './views/accessibility-policy-view/accessibility-policy-view.component';
import { EducationalMaterialViewComponent } from './views/educational-material-view/educational-material-view.component';
import { EducationalMaterialPreviewComponent } from './components/educational-material-preview/educational-material-preview.component';
import { VideoPreviewComponent } from './components/video-preview/video-preview.component';
import { AudioPreviewComponent } from './components/audio-preview/audio-preview.component';
import { PdfPreviewComponent } from './components/pdf-preview/pdf-preview.component';
import { HtmlPreviewComponent } from './components/html-preview/html-preview.component';
import { OfficePreviewComponent } from './components/office-preview/office-preview.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { InfoViewComponent } from './views/info-view/info-view.component';
import { KoodistoTestiComponent } from './views/koodisto-testi/koodisto-testi.component';
import { BasicDetailsComponent } from './views/add-educational-resource-form/basic-details/basic-details.component';
import { EducationalDetailsComponent } from './views/add-educational-resource-form/educational-details/educational-details.component';
import { ExtendedDetailsComponent } from './views/add-educational-resource-form/extended-details/extended-details.component';
import { LicenseDetailsComponent } from './views/add-educational-resource-form/license-details/license-details.component';
import { BasedOnDetailsComponent } from './views/add-educational-resource-form/based-on-details/based-on-details.component';
import { StepsNavComponent } from './views/add-educational-resource-form/steps-nav/steps-nav.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppSidebarModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    SharedModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AccordionModule.forRoot(),
    NgxExtendedPdfViewerModule,
    NgSelectModule,
    FormsModule,
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    LoginComponent,
    AddMaterialComponent,
    HelpViewComponent,
    TermsOfUseViewComponent,
    PrivacyPolicyViewComponent,
    AccessibilityPolicyViewComponent,
    EducationalMaterialViewComponent,
    EducationalMaterialPreviewComponent,
    VideoPreviewComponent,
    AudioPreviewComponent,
    PdfPreviewComponent,
    HtmlPreviewComponent,
    OfficePreviewComponent,
    ImagePreviewComponent,
    InfoViewComponent,
    KoodistoTestiComponent,
    BasicDetailsComponent,
    EducationalDetailsComponent,
    ExtendedDetailsComponent,
    LicenseDetailsComponent,
    BasedOnDetailsComponent,
    StepsNavComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
