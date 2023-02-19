import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Album } from '../interfaces/album';
import { Photo } from '../interfaces/photo';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserAlbums(userId: number): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.apiUrl}/users/${userId}/albums`);
  }

  getAlbumPhotos(albumId: number, start: number, limit: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/albums/${albumId}/photos?_start=${start}&_limit=${limit}`);
  }
}
