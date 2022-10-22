import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-employee-image-details',
  templateUrl: './employee-image-details.component.html',
  styleUrls: ['./employee-image-details.component.scss']
})
export class EmployeeImageDetailsComponent implements OnInit {
  imgsrc = 'https://www.w3schools.com/howto/img_avatar.png';

  constructor( public _d: DomSanitizer ) { }
  ngOnInit(): void {
  }

  fileChange(e: { srcElement: { files: any[]; }; }): void  {
    const file = e.srcElement.files[0]; 
    this.imgsrc = window.URL.createObjectURL(file); 
  }
}
