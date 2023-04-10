import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./component/page/main-page/main-page.component";
import {CodeBlockPageComponent} from "./component/page/code-block-page/code-block-page.component";
import {CompilerPageComponent} from "./component/page/compiler-page/compiler-page.component";

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'code-block', component: CodeBlockPageComponent},
  {path: 'compiler', component: CompilerPageComponent},
  {path: '**', component: MainPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
