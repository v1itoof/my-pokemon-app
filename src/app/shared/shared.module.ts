// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../capitalize.pipe';  // Importe o pipe

@NgModule({
  declarations: [CapitalizePipe],  // Declare o pipe
  imports: [CommonModule],  // Importe CommonModule (se necessário)
  exports: [CapitalizePipe]  // Exporte o pipe para que possa ser utilizado em outros módulos
})
export class SharedModule { }
