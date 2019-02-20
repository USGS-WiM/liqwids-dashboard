import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatInputModule } from '@angular/material';
import { MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatExpansionModule} from '@angular/material/expansion';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, MatInputModule, MatTableModule, MatSortModule, MatFormFieldModule, MatExpansionModule,
    BrowserAnimationsModule, HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
