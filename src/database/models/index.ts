import { Sequelize } from 'sequelize';
import { Role, RoleModel } from './Role';
import { User, UserModel } from './User';
import { Profile, ProfileModel } from './Profile';
import { Rating, RatingModel } from './Rating';
import { Subscriber, SubscriberModel } from './Subscriber';

interface Models {
  Role: typeof Role;
  User: typeof User;
  Profile: typeof Profile;
  Rating: typeof Rating;
  Subscriber: typeof Subscriber;
}

export const AllModels = (sequelize: Sequelize): Models => ({
  Role: RoleModel(sequelize),
  User: UserModel(sequelize),
  Profile: ProfileModel(sequelize),
  Rating: RatingModel(sequelize),
  Subscriber: SubscriberModel(sequelize),
});
