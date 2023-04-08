import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodeBlockPaginatorPipe } from './pipe/code-block-paginator.pipe';
import { DateFormatterPipe } from './pipe/date-formatter.pipe';
import { CodeBlockTimeSortPipe } from './pipe/code-block-time-sort.pipe';
import { NavigationBarComponent } from './component/ui/navigation-bar/navigation-bar.component';
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import { NoResultsComponent } from './component/ui/no-results/no-results.component';
import { SearchComponent } from './component/ui/search/search.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    AppComponent,
    CodeBlockPaginatorPipe,
    DateFormatterPipe,
    CodeBlockTimeSortPipe,
    NavigationBarComponent,
    NoResultsComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
