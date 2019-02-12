import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TruncatePipe } from '../pipes/truncate.pipe';

import { EDUCATIONALMATERIALS as EducationalMaterialsFI } from '../mocks/demo/educational-materials-fi.mock';
import { EDUCATIONALMATERIALS as EducationalMaterialsEN } from '../mocks/demo/educational-materials-en.mock';
import { EDUCATIONALMATERIALS as EducationalMaterialsSV } from '../mocks/demo/educational-materials-sv.mock';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    TruncatePipe
  ],
  exports: [
    CommonModule,
    TranslateModule,
    TruncatePipe
  ],
})

export class SharedModule { }

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export function setLanguage(lang: string): void {
  localStorage.setItem('user', JSON.stringify({ lang: lang }));
}

export function getLanguage(): string | undefined {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user === null) {
    return undefined;
  } else {
    return user.lang;
  }
}

export const materials = {
  'fi': EducationalMaterialsFI,
  'en': EducationalMaterialsEN,
  'sv': EducationalMaterialsSV,
};
