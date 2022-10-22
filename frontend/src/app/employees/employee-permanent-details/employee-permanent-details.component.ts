import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-employee-permanent-details',
  templateUrl: './employee-permanent-details.component.html',
  styleUrls: ['./employee-permanent-details.component.scss']
})
export class EmployeePermanentDetailsComponent implements OnInit {
  disableSelect = new FormControl(false);
  constructor() { }

  ngOnInit(): void {
  }
  
}
