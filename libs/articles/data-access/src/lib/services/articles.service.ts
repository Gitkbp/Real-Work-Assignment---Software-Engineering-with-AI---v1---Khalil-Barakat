import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@realworld/core/http-client';
import { Article, ArticleResponse, MultipleCommentsResponse, SingleCommentResponse } from '@realworld/core/api-types';
import { ArticleListConfig } from '../+state/article-list/article-list.reducer';
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

// Type guard to check if a variable is a string
function isString(value: any): value is string {
  return typeof value === 'string';
}

@Injectable({ providedIn: 'root' })

export class ArticlesService {

  articlePublished$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  getArticle(slug: string): Observable<ArticleResponse> {
    return this.apiService.get<ArticleResponse>('/articles/' + slug);
  }

  getComments(slug: string): Observable<MultipleCommentsResponse> {
    return this.apiService.get<MultipleCommentsResponse>(`/articles/${slug}/comments`);
  }

  deleteArticle(slug: string): Observable<void> {
    return this.apiService.delete<void>('/articles/' + slug);
  }

  deleteComment(commentId: number, slug: string): Observable<void> {
    return this.apiService.delete<void>(`/articles/${slug}/comments/${commentId}`);
  }

  addComment(slug: string, payload = ''): Observable<SingleCommentResponse> {
    return this.apiService.post<SingleCommentResponse, { comment: { body: string } }>(`/articles/${slug}/comments`, {
      comment: { body: payload },
    });
  }

  query(config: ArticleListConfig): Observable<{ articles: Article[]; articlesCount: number }> {
    return this.apiService.get(
      '/articles' + (config.type === 'FEED' ? '/feed' : ''),
      this.toHttpParams(config.filters),
    );
  }

  /*publishArticle(article: Article): Observable<ArticleResponse> {
    if (article.slug) {
      return this.apiService.put<ArticleResponse, ArticleResponse>('/articles/' + article.slug, {
        article: article,
      });
    }
    return this.apiService.post<ArticleResponse, ArticleResponse>('/articles/', { article: article });
  }*/

  publishArticle(article: Article): Observable<ArticleResponse> {
    // Create a copy of the article object to ensure we're not modifying an immutable object
    let modifiedArticle = { ...article };

    // Use type guard to check if tagList is a string and then process
    if (isString(modifiedArticle.tagList)) {
        modifiedArticle.tagList = modifiedArticle.tagList
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0);
    }

    if (modifiedArticle.slug) {
        return this.apiService.put<ArticleResponse, ArticleResponse>('/articles/' + modifiedArticle.slug, {
            article: modifiedArticle,
        });
    }

    return this.apiService.post<ArticleResponse, ArticleResponse>('/articles/', { article: modifiedArticle }).pipe(
      tap(() => {
          console.log("Article published, emitting event");
          this.articlePublished$.next();
      })
  );
}

  // TODO: remove any
  private toHttpParams(params: any) {
    return Object.getOwnPropertyNames(params).reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }
}
