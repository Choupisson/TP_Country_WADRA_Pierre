import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

// Définition de l'interface pour les pays
interface Country {
  code: string;
  libelle: string;
}

// Définition du composant
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
})
export class CountryComponent implements AfterViewInit, OnDestroy {
  sub!: Subscription;  
  @ViewChild('input', { static: false }) inputText!: ElementRef;  // Référence à l'élément d'entrée

  // Liste des pays
  countries: Array<Country> = [
    { code: 'FR', libelle: 'France' },
    { code: 'EN', libelle: 'English' },
    { code: 'AU', libelle: 'Australia' },
    { code: 'NC', libelle: 'New Caledonia' },
    { code: 'CU', libelle: 'Cuba' },
  ];

  lesPays: Array<Country> = [];  // Liste des pays filtrés

  constructor() {}

  // Après l'initialisation du composant
  ngAfterViewInit() {
    this.sub = fromEvent(this.inputText.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),  
        map((event: any) => this.filterCountries(event.target.value))  // Filtre les pays basé sur la valeur d'entrée
      )
      .subscribe((filteredCountries) => this.lesPays = filteredCountries);  
  }

  // Filtre les pays en fonction de l'entrée
  filterCountries(input: string) {
    if (input.trim().length === 0) {
      return [];
    }
    return this.countries.filter(country => 
      country.libelle.toLowerCase().startsWith(input.toLowerCase())
    );
  }

  // Lorsque l'élément d'entrée perd le focus
  onBlur() {
    setTimeout(() => this.lesPays = [], 150);  // Vide la liste des pays filtrés après 150ms
  }

  // Lorsque l'élément d'entrée gagne le focus
  onFocus() {
    this.lesPays = this.filterCountries(this.inputText.nativeElement.value);  // Met à jour la liste des pays filtrés
  }

  selectCountry(event: MouseEvent) {
    this.inputText.nativeElement.value = (event.target as HTMLElement).innerText;  // Met à jour la valeur d'entrée
  }

  ngOnDestroy() {
    this.sub.unsubscribe();  // Se désabonne de l'observable
  }
}
