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

@NgModule({
  declarations: [
    AppComponent,
    CodeBlockPaginatorPipe,
    DateFormatterPipe,
    CodeBlockTimeSortPipe,
    NavigationBarComponent,
    NoResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
