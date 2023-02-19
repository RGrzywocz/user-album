import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MatPaginator,
  PageEvent
} from '@angular/material/paginator';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Album
} from '../interfaces/album';
import { Photo } from '../interfaces/photo';
import {
  User
} from '../interfaces/user';
import {
  DataService
} from '../services/data.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, AfterViewInit {
  userId: number;
  user!: User;
  userInitials!: string;
  albums!: Album[]
  displayedAlbums!: Album[]
  pageEvent: PageEvent;
  datasource: null;
  pageIndex: number = 0;
  pageSize: number = 3;
  length: number;
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
    this.dataService.getUsers().subscribe(users => {
        users.forEach(user => {
          if (user.id === this.userId) {
            this.user = user;
            this.userInitials = this.getUserInitials(this.user.name);
            this.dataService.getUserAlbums(this.user.id).subscribe(albums => {
              this.albums = albums;
              this.displayedAlbums = this.albums.slice(0, 3);
              this.length = this.albums.length;
              this.chosenAlbumId = Number(this.route.snapshot.paramMap.get('album_id'));
              this.updateChosenAlbumTitle(this.chosenAlbumId);
              this.dataService.getAlbumPhotos(this.chosenAlbumId, 0, 4).subscribe(res=>{
                this.photosToDisplay = res;
              })
              this.dataService.getAlbumPhotos(this.chosenAlbumId, 0, 1000).subscribe(res=>this.photoLength = res.length);
            })
          }
        })
      }, (err) => console.error(err),
      () => this.dataLoaded = true)

  }
  ngAfterViewInit(): void {

  }

  navigateToUserSearch() {
    this.router.navigate(['user'])
  }

  getUserInitials(name: string) {
    const nameArray = name.split(' ');
    const initials = nameArray.map(n => n.charAt(0).toUpperCase());
    return initials.join('');
  }

  setAlbums(event: PageEvent): PageEvent {
    let page = event.pageIndex;
    this.displayedAlbums = this.albums.slice(page * 3, page * 3 + 3);
    return event;
  }

  setPhotos(event: PageEvent): PageEvent {
    let page = event.pageIndex;
    this.dataService.getAlbumPhotos(this.chosenAlbumId, event.pageIndex, event.pageSize).subscribe(res=>{
      this.photosToDisplay = res;
    })
    console.log(this.photosToDisplay);
    return event;
  }

  chooseAlbum(album_id: number) {
    this.router.navigate([`user/${Number(this.userId)}/album/${album_id}`]);
    this.updateChosenAlbumTitle(album_id);
    this.chosenAlbumId = album_id;
    this.dataService.getAlbumPhotos(this.chosenAlbumId, 0, 4).subscribe(res=>{
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
  addPhoto(photo_id:Photo){
    let skip = false;
    this.chosenPhotos.forEach(photo => {
      if(photo.id === photo_id.id){
        skip = true;
      }
    })
    if(skip){
      return;
    }
    this.chosenPhotos.push(photo_id);
    return;
  }
  togglePhoto(event: any, index:number){
    const hasClass = event.target.classList.contains('big-photo');
    if(!hasClass){
      event.target.classList.add('big-photo')
    }else{
      this.chosenPhotos = this.chosenPhotos.filter(photo => this.chosenPhotos.indexOf(photo)!==index)
    }
  }
}
