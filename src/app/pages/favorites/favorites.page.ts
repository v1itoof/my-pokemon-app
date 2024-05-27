import { Component, HostListener, OnInit } from '@angular/core';
import { PokeapiService } from 'src/app/services/pokeapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  public pokemons: any[] = [];
  private offset: number = 0;
  private limit: number = 10000;
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
      const favoriteIds: number[] = this.getFavorites();
      this.pokemons = data.filter(pokemon => favoriteIds.includes(pokemon.id));
    });
  }


  goToDetails(pokemonId: number) {
    this.router.navigate(['/details', pokemonId]);
  }

  getFavorites(): number[] {
    const favorites = sessionStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }

  formatPokemonId(id: number): string {
    return `Nº ${id.toString().padStart(3, '0')}`;
  }
}
