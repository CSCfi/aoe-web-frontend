import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

// 3rd party components
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxEchartsModule } from 'ngx-echarts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// components
import { AdminComponent } from './admin.component';
import { RemoveMaterialComponent } from './remove-material/remove-material.component';
import { ChangeMaterialOwnerComponent } from './change-material-owner/change-material-owner.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageMaterialsComponent } from './manage-materials-view/manage-materials.component';
import { NotificationComponent } from './notification/notification.component';
import { ManageServiceComponent } from './manage-service-view/manage-service.component';
import { AnalyticsViewComponent } from './analytics-view/analytics-view.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
// guards
import { AdminGuard, AuthGuard } from '../guards';
import { CustomDatePipe } from '@admin/pipes/custom-date.pipe';

@NgModule({
  declarations: [
    AdminComponent,
    CustomDatePipe,
    RemoveMaterialComponent,
    ChangeMaterialOwnerComponent,
    DashboardComponent,
    ManageMaterialsComponent,
    NotificationComponent,
    ManageServiceComponent,
    AnalyticsViewComponent,
    LineChartComponent,
  ],
  imports: [
    AdminRoutingModule,
    BsDatepickerModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [AuthGuard, AdminGuard],
})
export class AdminModule {}
