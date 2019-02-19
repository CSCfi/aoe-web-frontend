import { Component, Input } from '@angular/core';

import { Material } from '../../models/demo/material';

@Component({
  selector: 'app-educational-material-preview',
  templateUrl: './educational-material-preview.component.html',
})
export class EducationalMaterialPreviewComponent {
  @Input()
  mainMaterial: Material;
}