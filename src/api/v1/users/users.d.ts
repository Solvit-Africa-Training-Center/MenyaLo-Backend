interface UserInterface {
  id: string;
  name?: string;
  username?: string;
  email: string;
  address?: string;
  registrationNumber?: number;
  password: string;
  roleId: string;
  isActive: boolean;
  googleId?: string;
  provider?: 'local' | 'google';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

type CreateCitizenInterface = Omit<UserInterface, 'id' | 'createdAt' | 'deletedAt'>;
type CreateOrganizationInterface = Omit<
  UserInterface,
  'id' | 'username' | 'createdAt' | 'deletedAt'
>;

type UpdateCitizenInterface = Partial<CreateCitizenInterface>;
type UpdateOrganizationInterface = Partial<CreateOrganizationfaceInterface>;
interface GetAllUsers {
  users: UserInterface[];
}
