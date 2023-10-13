/*import { Injectable } from '@angular/core';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HomeService } from './home.service';
import { ArticlesService } from '../../../articles/data-access/src/lib/services/articles.service';

export interface HomeState {
  tags: string[];
}

@Injectable()
export class HomeStoreService extends ComponentStore<HomeState> implements OnStateInit {
  //constructor(private readonly homeService: HomeService) {
  constructor(private readonly homeService: HomeService, private readonly articlesService: ArticlesService) {
    super({ tags: [] });
    this.articlesService.articlePublished$.subscribe(() => {
      this.getTags();
  }

  ngrxOnStateInit() {
    this.getTags();
  }

  // SELECTORS
  tags$ = this.select((store) => store.tags);

  // EFFECTS
  readonly getTags = this.effect<void>(
    pipe(
      switchMap(() =>
        this.homeService.getTags().pipe(
          tapResponse(
            (response) => {
              this.patchState({ tags: response.tags });
            },
            (error) => {
              console.error('error getting tags: ', error);
            },
          ),
        ),
      ),
    ),
  );
}*/

import { Injectable } from '@angular/core';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HomeService } from './home.service';
import { ArticlesService } from '../../../articles/data-access/src/lib/services/articles.service';
import { tap } from 'rxjs/operators';

export interface HomeState {
  tags: string[];
}

@Injectable()
export class HomeStoreService extends ComponentStore<HomeState> implements OnStateInit {
  constructor(private readonly homeService: HomeService, private readonly articlesService: ArticlesService) {
    super({ tags: [] });
  }

  ngrxOnStateInit() {
    // Fetch the tags initially
    this.getTags();

    // Set up a subscription to listen for new articles being published
    this.articlesService.articlePublished$.subscribe(() => {
      console.log("Received article published event, fetching tags");
      this.getTags();
  });

  }

  // SELECTORS
  tags$ = this.select((store) => store.tags);

  // EFFECTS
  readonly getTags = this.effect<void>(
    pipe(
        tap(() => {
            console.log("Executing getTags effect");
        }),
        switchMap(() =>
            this.homeService.getTags().pipe(
                tapResponse(
                    (response) => {
                        this.patchState({ tags: response.tags });
                    },
                    (error) => {
                        console.error('error getting tags: ', error);
                    },
                ),
            ),
        ),
    ),
);
}

