import { Component, Input } from '@angular/core';

import { Material } from '../../models/demo/material';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
})
export class ImagePreviewComponent {
  @Input() material: Material;
}