export interface RoleInterface {
  id: string;
  name: string;
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}


export type CreateRoleInterface = Omit<
  RoleInterface,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export interface GetAllRoles {
  roles: RoleInterface[];
}
