import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { AccordionComponent } from "../widgets/accordion/accordion.component";
import { InformationBarComponent } from '../widgets/information-bar/information-bar.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, AccordionComponent, InformationBarComponent]
})
export class HomePageModule {}
