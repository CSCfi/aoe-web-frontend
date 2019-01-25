import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DEMOMATERIALS } from '../demo-material-list/mock-demo-materials';
import { DemoMaterial } from '../../models/demo-material';

@Component({
  selector: 'app-demo-material-view',
  templateUrl: './demo-material-view.component.html',
})
export class DemoMaterialViewComponent implements OnInit {

  demoMaterials: DemoMaterial[] = DEMOMATERIALS;
  demoMaterial: DemoMaterial;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.demoMaterial = this.demoMaterials.find(m => m.id === +params['id']);
    });
  }

}