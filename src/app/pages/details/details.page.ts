import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  pokemonId: number = 0;
  pokemonDetails: any;
  weight: number = 0;
  height: number = 0;
  abilities: string[] = [];
  stats: any[] = [];
  types: string[] = [];
  moves: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokeapiService: PokeapiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pokemonId = +params['id'];
      this.getPokemonDetails();
      console.log(this.getPokemonDetails());
    });
  }

  getPokemonDetails() {
    this.pokeapiService.getPokemonDetailsById(this.pokemonId).subscribe(details => {
      this.pokemonDetails = details;
      this.weight = details.weight;
      this.height = details.height;
      this.abilities = details.abilities.map((ability: any) => ability.ability.name);
      this.stats = details.stats.map((stat: any) => ({
        name: stat.stat.name,
        base_stat: stat.base_stat
      }));
      this.types = details.types.map((type: any) => type.type.name);
      // Vamos filtrar apenas os movimentos que tenham a propriedade 'name'
      this.moves = details.moves
        .filter((move: any) => move.move && move.move.name)
        .map((move: any) => move.move.name);
    });
  }




}
