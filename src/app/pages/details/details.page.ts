import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeapiService } from '../../services/pokeapi.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  pokemonDetails: any;
  weight: string = '';
  height: string = '';
  abilities: { name: string, isHidden: boolean, description: string }[] = [];
  stats: { name: string, base_stat: number }[] = [];
  types: string[] = [];
  moves: any[] = [];
  pokemonId: number = 0;
  evolutions: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private pokeapiService: PokeapiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pokemonId = Number(params.get('id'));
      this.getPokemonDetails();
    });
  }

  getPokemonDetails() {
    this.pokeapiService.getPokemonDetailsById(this.pokemonId).subscribe(details => {
      this.pokemonDetails = details;

      this.loadEvolutions(details.species.url);

      this.weight = this.formatWithComma(details.weight);
      this.height = this.formatWithComma(details.height);

      this.stats = details.stats.map((stat: any) => ({
        name: stat.stat.name,
        base_stat: stat.base_stat
      }));

      this.types = details.types.map((type: any) => type.type.name);

      this.moves = [];

      details.moves.forEach((move: any) => {
        const moveName = move.move.name;

        const lastVersionGroupDetail = move.version_group_details[move.version_group_details.length - 1];
        const learnedBy = lastVersionGroupDetail.move_learn_method.name === 'level-up' ? 'Level' :
                         lastVersionGroupDetail.move_learn_method.name === 'machine' ? 'TM' :
                         lastVersionGroupDetail.move_learn_method.name === 'tutor' ? 'Tutor' : '';

        this.pokeapiService.getMoveByName(moveName).subscribe((moveData: any) => {
          let learnedAt = '';
          if (learnedBy === 'Level') {
            learnedAt = lastVersionGroupDetail.level_learned_at.toString();
          } else if (learnedBy === 'TM') {
            learnedAt = 'TM';
          }

          this.moves.push({
            name: moveName,
            learnedBy: learnedBy,
            learnedAt: learnedAt,
            type: moveData.type.name,
            power: moveData.power,
            accuracy: moveData.accuracy
          });
        });
      });

      details.abilities.forEach((abilityInfo: any) => {
        this.pokeapiService.getAbilityByName(abilityInfo.ability.name).subscribe((abilityDetails: any) => {
          this.abilities.push({
            name: abilityInfo.ability.name,
            isHidden: abilityInfo.is_hidden,
            description: abilityDetails.effect_entries.find((entry: any) => entry.language.name === 'en')?.effect
          });
        });
      });
    });
  }

  loadEvolutions(speciesUrl: string) {
    this.pokeapiService.getPokemonDetailsByUrl(speciesUrl).subscribe((speciesDetails: any) => {
      this.pokeapiService.getEvolutionChainByUrl(speciesDetails.evolution_chain.url).subscribe((evolutionChain: any) => {
        this.parseEvolutionChain(evolutionChain.chain);
      });
    });
  }

  parseEvolutionChain(chain: any) {
    const evolveDetails = chain.evolution_details;
    const evolvesTo = chain.evolves_to;

    if (evolveDetails.length > 0) {
      evolveDetails.forEach((detail: any) => {
        const method = detail.trigger.name;
        const level = detail.min_level || 'Not specified';
        const pokemonName = chain.species.name;
        this.evolutions.push({ pokemonName, method, level });
      });
    }

    evolvesTo.forEach((evolution: any) => {
      this.parseEvolutionChain(evolution);
    });
  }

  // Função para adicionar a vírgula antes do último zero
  formatWithComma(value: number): string {
    const valueStr = value.toString();
    const length = valueStr.length;
    return length > 1 ? valueStr.slice(0, -1) + '.' + valueStr.slice(-1) : valueStr;
  }
}
