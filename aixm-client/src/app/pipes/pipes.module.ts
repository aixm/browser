import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HexToRgbAPipe } from './hex-to-rgb-a-pipe';
import { LimitToPipe } from './limit-to.pipe';



@NgModule({
  declarations: [
      LimitToPipe,
      HexToRgbAPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LimitToPipe,
    HexToRgbAPipe
  ]
})
export class PipesModule { }
