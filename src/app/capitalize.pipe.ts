import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return ''; // Verifica se o valor é nulo ou indefinido
    return value.charAt(0).toUpperCase() + value.slice(1); // Capitaliza a primeira letra e concatena com o restante da string
  }
}
