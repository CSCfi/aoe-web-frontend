import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '@services/search.service';
import { SearchResult } from '@models/search/search-results';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results-view',
  templateUrl: './search-results-view.component.html',
  styleUrls: ['./search-results-view.component.scss']
})
export class SearchResultsViewComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  resultSubscription: Subscription;
  results: any[];
  mockResults: SearchResult[] = [];

  constructor(
    private searchSvc: SearchService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      keywords: this.fb.control(null, [ Validators.required ]),
    });

    this.resultSubscription = this.searchSvc.searchResults$.subscribe((results: any[]) => {
      this.results = results;
    });

    this.mockResults.push({
      id: 1,
      createdAt: new Date(2019, 1, 3),
      name: 'Mock material',
      description: 'Kuvaus',
      authors: [
        {
          authorname: 'Mehiläinen, Maija',
        },
      ],
      learningResourceTypes: [
        {
          learningresourcetypekey: 'key',
          value: 'video',
        }
      ],
      license: 'CCBY4.0',
      educationalLevels: [
        {
          educationallevelkey: 'key',
          value: 'Yläaste',
        },
      ],
      thumbnail: 'https://aoethumbnail.object.pouta.csc.fi/thumbnail1580736649891.png',
    });

    this.mockResults.push({
      id: 2,
      createdAt: new Date(2020, 0, 15),
      name: 'Mock material 2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean accumsan sed est et varius. Nulla posuere in justo eget vehicula. Nulla et sem ultrices, tincidunt quam facilisis, finibus eros. Donec vitae enim in erat pretium ultrices ut eu neque.',
      authors: [
        {
          authorname: 'Mehiläinen, Maija 2',
        },
      ],
      learningResourceTypes: [
        {
          learningresourcetypekey: 'key',
          value: 'audio',
        }
      ],
      license: 'CCBY4.0',
      educationalLevels: [
        {
          educationallevelkey: 'key',
          value: 'Yläaste',
        },
      ],
      thumbnail: 'https://aoethumbnail.object.pouta.csc.fi/thumbnail1580736649891.png',
    });
  }

  ngOnDestroy(): void {
    this.resultSubscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.searchSvc.updateSearchResults(this.searchForm.value);
    }
  }
}
