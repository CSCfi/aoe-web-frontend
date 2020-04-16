import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RatingPost } from '@models/rating-post';
import { Rating, Ratings } from '@models/backend/ratings';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingsService {
  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Posts material rating.
   * @param {RatingPost} rating Material rating
   */
  postRating(rating: RatingPost) {
    return this.http.post<RatingPost>(`${environment.backendUrl}/rating`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
    });
  }

  /**
   * Returns material ratings.
   * @param {number | string} materialId Material ID
   * @returns {Observable<Ratings>} List of material ratings
   */
  getRatings(materialId: number | string): Observable<Ratings> {
    return this.http.get<Ratings>(`${environment.backendUrl}/ratings/${materialId}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
    });
  }

  /**
   * Returns users rating.
   * @param {number | string} materialId Material ID
   * @returns {Observable<Rating>} Users rating
   */
  getRating(materialId: number | string): Observable<Rating> {
    return this.http.get<Rating>(`${environment.backendUrl}/rating/${materialId}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
    });
  }
}
