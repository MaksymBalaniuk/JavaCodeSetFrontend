import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./component/page/main-page/main-page.component";
import {CodeBlockPageComponent} from "./component/page/code-block-page/code-block-page.component";

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'code-block', component: CodeBlockPageComponent},
  {path: '**', component: MainPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
