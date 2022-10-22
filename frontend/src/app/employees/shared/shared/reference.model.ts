export class ReferenceDetails{
    id: string;
    name: string;
    mobileNo: string;
    relationship: string;
  }
  export  class  ReferenceDetailsVM extends ReferenceDetails{
    isEdit: boolean;
  }
  
  export const ReferenceDetailsColumns = [
    // {
    //   key: 'name',
    //   type: 'text',
    //   label: 'Reference Name',
    //   required: true,
    // },
    // {
    //   key: 'mobileNo',
    //   type: 'text',
    //   label: 'Mobile Number',
    //   required: true,
    // },
    // {
    //   key: 'relation',
    //   type: 'select',
    //   label: 'Relationship',
    //   required: true,
    // },
    // {
    //   key: 'isEdit',
    //   type: 'isEdit',
    //   label: '',
    // }
    {
      key: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      key: 'mobileNo',
      type: 'text',
      label: 'Mobile Number',
      required: true,
    },
    // {
    //   key: 'birthDate',
    //   type: 'date',
    //   label: 'Date of Birth',
    //   required: true,
    // },
    {
      key: 'relationship',
      type: 'select',
      label: 'Relationship',
      required: true,
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: '',
    }
  ];
  