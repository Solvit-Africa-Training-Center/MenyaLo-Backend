import { Sequelize, Model, DataTypes } from 'sequelize';
import { User } from './User';
import { Address } from './Address';

interface ProfileAttributes {
  id: string;
  userId: string;
  userRole: 'User' | 'Firm' | 'Organization';
  name: string;
  bio?: string;
  avatarUrl?: string;
  logoUrl?: string;
  organisationType?: 'ForProfit' | 'NonProfit' | 'Governmental';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface ProfileCreationAttributes
  extends Omit<ProfileAttributes, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'> {
  id?: string;
  deletedAt?: null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Profile
  extends Model<ProfileAttributes, ProfileCreationAttributes>
  implements ProfileAttributes
{
  public id!: string;
  public userId!: string;
  public userRole!: 'User' | 'Firm' | 'Organization';
  public name!: string;
  public bio?: string;
  public avatarUrl?: string;
  public logoUrl?: string;
  public organisationType?: 'ForProfit' | 'NonProfit' | 'Governmental';
  public updatedAt!: Date;
  public createdAt: Date = new Date();
  public deletedAt: null = null;

  static associate(models: { User: typeof User, Address: typeof Address }): void {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Profile.hasMany(models.Address, {
      foreignKey: 'profileId',
      as:'addresses',
    });
  }

  public toJSON(): object | ProfileAttributes {
    return {
      ...this.get(),
      updatedAt:undefined,
      createdAt:undefined,
      deletedAt:undefined,
    };
  }
}

export const ProfileModel = (sequelize: Sequelize):typeof Profile => {
  Profile.init({
    id: {
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    userRole:{
      type:DataTypes.ENUM('User','Firm','Organization'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type:DataTypes.TEXT,
      allowNull:true,
    },
    avatarUrl: {
      type:DataTypes.STRING,
      allowNull:true,
    }, 
    logoUrl: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    organisationType:{
      type: DataTypes.ENUM('ForProfit','NonProfit','Governmental'),
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    timestamps: true,
    paranoid:true,
  });
  return Profile;
};