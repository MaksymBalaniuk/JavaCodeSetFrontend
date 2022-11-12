import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AuthenticationComponent } from './component/ui/authentication/authentication.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './component/page/main-page/main-page.component';
import { NavigationBarComponent } from './component/ui/navigation-bar/navigation-bar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { ModalComponent } from './component/ui/modal/modal.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { RegistrationComponent } from './component/ui/registration/registration.component';
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {MatSidenavModule} from "@angular/material/sidenav";
import { SearchComponent } from './component/ui/search/search.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { NoResultsComponent } from './component/ui/no-results/no-results.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { CodeBlockPaginatorPipe } from './pipe/code-block-paginator.pipe';
import { CodeBlockPageComponent } from './component/page/code-block-page/code-block-page.component';
import { CodeHighlightDirective } from './directive/code-highlight.directive';
import { CommentComponent } from './component/ui/comment/comment.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { CodeBlockViewComponent } from './component/ui/code-block-view/code-block-view.component';
import { CodeBlockCardComponent } from './component/ui/code-block-card/code-block-card.component';
import { CodeBlockEditComponent } from './component/ui/code-block-edit/code-block-edit.component';
import { InstantFormatterPipe } from './pipe/instant-formatter.pipe';
import { ProfilePageComponent } from './component/page/profile-page/profile-page.component';
import { CompilerPageComponent } from './component/page/compiler-page/compiler-page.component';
import {ClipboardModule} from "ngx-clipboard";

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    MainPageComponent,
    NavigationBarComponent,
    ModalComponent,
    RegistrationComponent,
    SearchComponent,
    NoResultsComponent,
    CodeBlockPaginatorPipe,
    CodeBlockPageComponent,
    CodeHighlightDirective,
    CommentComponent,
    CodeBlockViewComponent,
    CodeBlockCardComponent,
    CodeBlockEditComponent,
    InstantFormatterPipe,
    ProfilePageComponent,
    CompilerPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatCardModule,
    MatGridListModule,
    MatChipsModule,
    MatDividerModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatExpansionModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
