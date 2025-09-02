import { Sequelize } from 'sequelize';
import { Role, RoleModel } from './Role';
import { User, UserModel } from './User';
import { Profile, ProfileModel } from './Profile';
import { Address, AddressModel } from './Address';

interface Models {
  Role: typeof Role;
  User: typeof User;
  Profile: typeof Profile;
  Address: typeof Address;
}

export const AllModels = (sequelize: Sequelize): Models => ({
  Role: RoleModel(sequelize),
  User: UserModel(sequelize),
  Profile: ProfileModel(sequelize),
  Address: AddressModel(sequelize),
});
