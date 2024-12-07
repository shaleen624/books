import { Doc } from 'fyo/model/doc';

export default class Party extends Doc {
  role: 'Customer' | 'Supplier' | 'Both' = 'Customer';
  name?: string;

  constructor(data: any) {
    super(data);
    this.role = data.role || 'Customer';
  }

  validate() {
    if (!this.role) {
      throw new Error(this.fyo.t`Role is required`);
    }
  }

  static getDoctype() {
    return {
      name: 'Party',
      label: 'Party',
      fields: [
        {
          fieldname: 'name',
          label: 'Name',
          fieldtype: 'Data',
          required: true,
        },
        {
          fieldname: 'role',
          label: 'Role',
          fieldtype: 'Select',
          options: ['Customer', 'Supplier', 'Both'],
          required: true,
          default: 'Customer',
        },
      ],
    };
  }
} 