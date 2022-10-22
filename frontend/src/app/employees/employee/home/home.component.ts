import { Component, OnInit } from '@angular/core';
class NavLink {
  constructor(public path: string, public label: string) {}
}

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  navLinks: NavLink[] = [];
  constructor() {}
  ngOnInit() {
    
  }
}
