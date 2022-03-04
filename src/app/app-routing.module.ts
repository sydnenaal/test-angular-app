import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PageTableComponent } from './page-table/page-table.component'

const routes: Routes = [{ path: '', component: PageTableComponent }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
