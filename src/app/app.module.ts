import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CodeBlockPaginatorPipe } from './pipe/code-block-paginator.pipe';
import { DateFormatterPipe } from './pipe/date-formatter.pipe';
import { CodeBlockTimeSortPipe } from './pipe/code-block-time-sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CodeBlockPaginatorPipe,
    DateFormatterPipe,
    CodeBlockTimeSortPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
