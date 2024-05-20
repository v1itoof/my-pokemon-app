import { Component, OnInit } from '@angular/core';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public pokemons: any[] = [];
  private offset: number = 0;
  private limit: number = 20;
  private totalPokemonCount: number = 0;
  public totalPages: number = 0;
  public currentPage: number = 1;

  constructor(private router: Router, private pokeapiService: PokeapiService) {}

  ngOnInit() {
    this.loadPokemonCount();
    this.loadPokemons();
  }

  loadPokemonCount() {
    this.pokeapiService.getTotalNumberOfPokemon().subscribe(total => {
      this.totalPokemonCount = total;
      this.totalPages = Math.ceil(this.totalPokemonCount / this.limit);
    });
  }

  loadPokemons() {
    this.pokeapiService.getPokemonList(this.offset, this.limit).subscribe((data: any[]) => {
      this.pokemons = data;
    });
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.offset = (this.currentPage - 1) * this.limit;
      this.loadPokemons();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.offset = (this.currentPage - 1) * this.limit;
      this.loadPokemons();
    }
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.offset = (this.currentPage - 1) * this.limit;
    this.loadPokemons();
  }

  getTotalPages(): number[] {
    let pagesToShow = 10; // Número de páginas a serem exibidas
    let startPage = 1;

    if (this.totalPages > pagesToShow) {
      if (this.currentPage > this.totalPages - 6) {
        startPage = this.totalPages - 9; // Começa a partir das últimas 10 páginas
      } else {
        startPage = Math.max(1, this.currentPage - 2);
      }
    }

    let endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    let pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      pages.unshift(0); // Adiciona botão para ir para o início
    }

    if (endPage < this.totalPages) {
      pages.push(this.totalPages + 1); // Adiciona botão para ir para as últimas 10 páginas
    }

    return pages;
  }


  goToDetails(pokemonId: number) {
    this.router.navigate(['/details', pokemonId]);
  }

  formatPokemonId(id: number): string {
    if (id < 10) {
      return `000${id}`;
    } else if (id < 100) {
      return `00${id}`;
    } else if (id < 1000) {
      return `0${id}`;
    } else {
      return `${id}`;
    }
  }
}
