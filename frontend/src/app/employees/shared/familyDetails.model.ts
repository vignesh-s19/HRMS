export class FamilyDetailsV1 {
    id: number;
    name: string;
    relationship: string;
    dob: Date;
    mobileNo: number;
    isEdit: boolean;
}
export class FamilyDetailsVM  extends FamilyDetailsV1{
    id: number;
    relationShipName: string;
  }