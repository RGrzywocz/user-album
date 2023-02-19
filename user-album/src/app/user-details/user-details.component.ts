import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from '../interfaces/album';
import { Photo } from '../interfaces/photo';
import { User } from '../interfaces/user';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user!: User;
  userId: number;
  userInitials!: string;
  albums!: Album[]
  displayedAlbums!: Album[]
  pageEvent: PageEvent;
  albumPageIndex: number = 0;
  albumPageSize: number = 3;
  albumLength: number;
  photoPageIndex: number = 0;
  photoPageSize: number = 4;
  photoLength: number;
  dataLoaded: boolean = false;
  chosenAlbumId: number;
  chosenAlbumTitle: string;
  photosToDisplay: Photo[];
  chosenPhotos: Photo[] = [];

  constructor(private router: Router, private dataService: DataService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.chosenAlbumId = Number(this.route.snapshot.paramMap.get('album_id'));
    this.dataService.getUsers().subscribe(users => {
        users.forEach(user => {
          if (user.id === this.userId) {
            this.user = user;
            this.userInitials = this.getUserInitials(this.user.name);
            this.dataService.getUserAlbums(this.user.id).subscribe(albums => {
              this.albums = albums;
              this.displayedAlbums = this.albums.slice(0, 3);
              this.albumLength = this.albums.length;

              this.updateChosenAlbumTitle(this.chosenAlbumId);
              this.dataService.getAlbumPhotos(this.chosenAlbumId, 0, 4).subscribe(res => {
                this.photosToDisplay = res;
              })
              this.dataService.getAlbumPhotos(this.chosenAlbumId, 0, 1000).subscribe(res => this.photoLength = res.length);
            })
          }
        })
      }, (err) => console.error(err),
      () => this.dataLoaded = true)
  }

  navigateToUserSearch(): void {
    this.router.navigate(['user'])
  }

  getUserInitials(name: string): string {
    const nameArray = name.split(' ');
    const initials = nameArray.map(n => n.charAt(0).toUpperCase());
    return initials.join('');
  }

  paginateAlbums(event: PageEvent): PageEvent {
    let page = event.pageIndex;
    this.displayedAlbums = this.albums.slice(page * 3, page * 3 + 3);
    return event;
  }

  paginatePhotos(event: PageEvent): PageEvent {
    let page = event.pageIndex;
    this.dataService.getAlbumPhotos(this.chosenAlbumId, page * 4, this.photoPageSize).subscribe(res => {
      this.photosToDisplay = res;
    })
    return event;
  }

  chooseAlbum(album_id: number): void {
    this.router.navigate([`user/${Number(this.userId)}/album/${album_id}`]);
    this.updateChosenAlbumTitle(album_id);
    this.chosenAlbumId = album_id;
    this.dataService.getAlbumPhotos(this.chosenAlbumId, 0, 4).subscribe(res => {
      this.photosToDisplay = res;
    })
  }

  updateChosenAlbumTitle(album_id: number) {
    let returnedTitle: string = "";
    this.albums.forEach(album => {
      if (album.id === album_id) {
        returnedTitle = album.title;
      }
    });

    this.chosenAlbumTitle = returnedTitle

  }
  addPhoto(photo_id: Photo): void {
    let skip = false;
    this.chosenPhotos.forEach(photo => {
      if (photo.id === photo_id.id) {
        skip = true;
      }
    })
    if (skip) {
      return;
    }
    this.chosenPhotos.push(photo_id);
  }

  clickPhoto(event: any, index: number) {
    const isBig = event.target.classList.contains('big-photo');
    if (!isBig) {
      event.target.classList.add('big-photo')
    } else {
      this.chosenPhotos = this.chosenPhotos.filter(photo => this.chosenPhotos.indexOf(photo) !== index)
    }
  }
}
