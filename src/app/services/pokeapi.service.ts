import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private baseUrl: string = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) {}

  getTotalNumberOfPokemon(): Observable<number> {
    return this.http.get<any>(`${this.baseUrl}pokemon`).pipe(
      map(response => response.count)
    );
  }

  getPokemonList(offset: number = 0, limit: number = 20): Observable<any> {
    return this.http.get(`${this.baseUrl}pokemon?offset=${offset}&limit=${limit}`).pipe(
      map((response: any) => response.results),
      switchMap((results: any[]) => {
        const detailedRequests = results.map(pokemon => this.getPokemonDetails(pokemon.url));
        return forkJoin(detailedRequests);
      })
    );
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url).pipe(
      map((pokemon: any) => {
        return {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.front_default,
          types: pokemon.types.map((typeInfo: { type: { name: any; }; }) => typeInfo.type.name)
        };
      })
    );
  }

  getPokemonDetailsByUrl(url: string): Observable<any> {
    return this.http.get(url);
  }

  getPokemonDetailsById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${id}`);
  }

  getAbilityByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ability/${name}`);
  }

  getMoveByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/move/${name}`);
  }

  getEvolutionChainByUrl(url: string): Observable<any> {
    return this.http.get(url);
  }

  getPokemonEvolutions(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/evolution-chain/${id}`);
  }

  getAllPokemons(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/pokemon?limit=1000`).pipe(
      map((response: any) => response.results)
    );
  }

}
