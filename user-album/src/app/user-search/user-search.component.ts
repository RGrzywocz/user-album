import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  name = new FormControl(null, [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.min(1)
  ]);
  users: User[] = [];

  constructor(private router: Router, private dataService: DataService) {

  }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }

  submitUserIdForm() {
    this.router.navigate([`user/${Number(this.name.value)}`])
  }

}
