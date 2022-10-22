import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ReferenceInfo } from '../../shared/reference.model';


interface RelationshipType {
  name: string;
}
@Component({
  selector: 'reference-info',
  templateUrl: './reference-info.component.html',
  styleUrls: ['./reference-info.component.scss']
})
export class ReferenceInfoComponent implements OnInit {

  relationshipControl = new FormControl(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  relationships: RelationshipType[] = [
    { name: 'Father' },
    { name: 'Mother' },
    { name: 'Spouse' },
    { name: 'Brother' },
    { name: 'Sister' },
    { name: 'Son' },
    { name: 'Daughter' },
  ];
  date = new FormControl(new Date());
  reference = new ReferenceInfo()
  dataarray = [];
  constructor() { }

  ngOnInit() {
    this.reference = new ReferenceInfo()
    this.dataarray.push(this.reference);
  }

  addForm() {
    this.reference = new ReferenceInfo()
    this.dataarray.push(this.reference);
  }

  removeForm(index: number) {
    this.dataarray.splice(index);
  }

  onsubmit() {
    console.log(this.dataarray);
  }

}
