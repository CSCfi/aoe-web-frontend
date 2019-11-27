import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaterialsViewComponent } from './user-materials-view.component';

describe('UserMaterialsViewComponent', () => {
  let component: UserMaterialsViewComponent;
  let fixture: ComponentFixture<UserMaterialsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMaterialsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMaterialsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
