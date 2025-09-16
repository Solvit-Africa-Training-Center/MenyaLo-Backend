interface UserInterface {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  googleId?: string;
  provider: 'local' | 'google';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

type CreateCitizenInterface = Omit<UserInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
interface CreateOrganizationInterface
  extends Omit<UserInterface, 'id' | 'username' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  name: string;
  address: string;
  registrationNumber: number;
}

interface GetAllUsers {
  users: UserInterface[];
}
