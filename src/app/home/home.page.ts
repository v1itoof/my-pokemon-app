import { Component, HostListener, OnInit } from '@angular/core';
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
  pagesToShow: number = 10;

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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updatePagesToShow(event.target.innerWidth);
  }

  updatePagesToShow(width: number) {
    if (width < 768) {
      this.pagesToShow = 5;
    } else if (width < 1200) {
      this.pagesToShow = 7;
    } else {
      this.pagesToShow = 10;
    }
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
    let startPage = 1;

    if (this.totalPages > this.pagesToShow) {
      if (this.currentPage > this.totalPages - Math.floor(this.pagesToShow / 2)) {
        startPage = this.totalPages - this.pagesToShow + 1;
      } else {
        startPage = Math.max(1, this.currentPage - Math.floor(this.pagesToShow / 2));
      }
    }

    let endPage = Math.min(this.totalPages, startPage + this.pagesToShow - 1);

    if (endPage - startPage < this.pagesToShow - 1) {
      startPage = Math.max(1, endPage - this.pagesToShow + 1);
    }

    let pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      pages.unshift(0); // Primeira página
    }

    if (endPage < this.totalPages) {
      pages.push(this.totalPages + 1); // Última página
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
