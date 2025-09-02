interface UserInterface {
  id: string;
  email: string;
  password: string;
  roleId: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

type CreateUserInterface = Omit<UserInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

interface GetAllUsers {
  users: UserInterface[];
}
