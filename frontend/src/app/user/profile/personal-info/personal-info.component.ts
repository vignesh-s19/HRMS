import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RelationshipInfo } from '../../shared/relationship.model';

interface RelationshipType {
  // id:string;
  name: string;
}

@Component({
  selector: 'personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

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
  relationship = new RelationshipInfo()
  dataarray = [];
  constructor() { }

  ngOnInit() {
    this.relationship = new RelationshipInfo()
    this.dataarray.push(this.relationship);
  }

  addForm() {
    this.relationship = new RelationshipInfo()
    this.dataarray.push(this.relationship);
  }

  removeForm(index: number) {
    this.dataarray.splice(index);
  }

  onsubmit() {
    console.log(this.dataarray);
  }

}
