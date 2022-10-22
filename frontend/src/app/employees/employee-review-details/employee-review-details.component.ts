import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-employee-review-details',
  templateUrl: './employee-review-details.component.html',
  styleUrls: ['./employee-review-details.component.scss']
})
export class EmployeeReviewDetailsComponent implements OnInit {
  imgsrc = 'https://www.w3schools.com/howto/img_avatar.png';

  constructor(
    public _d: DomSanitizer
  ) { }
  ngOnInit(): void {
  
  }

  fileChange(e) {
    const file = e.srcElement.files[0]; 
    this.imgsrc = window.URL.createObjectURL(file); 

  }

}
