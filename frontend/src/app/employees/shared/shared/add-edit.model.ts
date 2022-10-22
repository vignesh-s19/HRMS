export class FamilyDetails{
    id: string;
    name: string;
    relationship: string;
    birthDate: string;
}
export  class  FamilyDetailsVM extends FamilyDetails{
  isEdit: boolean;
}
export const FamilyDetailsColumns = [
    {
      key: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      key: 'relationship',
      type: 'select',
      label: 'Relationship',
      required: true,
    },
    {
      key: 'birthDate',
      type: 'date',
      label: 'Date of Birth',
      required: true,
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: '',
    }
  ];



