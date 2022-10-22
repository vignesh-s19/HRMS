import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'image-info',
  templateUrl: './image-info.component.html',
  styleUrls: ['./image-info.component.scss']
})
export class ImageInfoComponent implements OnInit {

  imgsrc = 'https://www.w3schools.com/howto/img_avatar.png';

  constructor(public _d: DomSanitizer) { }
  ngOnInit(): void {
  }

  fileChange(e: { srcElement: { files: any[]; }; }): void {
    const file = e.srcElement.files[0];
    this.imgsrc = window.URL.createObjectURL(file);
  }

}
