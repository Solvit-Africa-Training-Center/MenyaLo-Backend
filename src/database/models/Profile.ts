import { Sequelize, Model, DataTypes } from 'sequelize';
import { User } from './User';
import { Rating } from './Rating';

interface ProfileAttributes {
  id: string;
  userId: string;
  userRole: string;
  name: string;
  bio?: string;
  occupation?: string;
  imageUrl?: string;
  website?: string;
  phoneNumber?: string;
  teamSize?: number;
  yearsOfExperience?: number;
  caseResolved?: number;
  successRate?: number;
  establishedAt?: Date;
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
  public userRole!: string;
  public name!: string;
  public bio?: string;
  public imageUrl?: string;
  public occupation?: string;
  public website?: string;
  public phoneNumber?: string;
  public teamSize?: number;
  public yearsOfExperience?: number;
  public caseResolved?: number;
  public successRate?: number;
  public establishedAt?: Date;
  public updatedAt!: Date;
  public createdAt: Date = new Date();
  public deletedAt: null = null;

  static associate(models: { User: typeof User; Rating: typeof Rating }): void {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Profile.hasMany(models.Rating, {
      foreignKey: 'firmId',
      as: 'ratings',
    });
  }

  public toJSON(): object | ProfileAttributes {
    return {
      ...this.get(),
      updatedAt: undefined,
      createdAt: undefined,
      deletedAt: undefined,
    };
  }
}

export const ProfileModel = (sequelize: Sequelize): typeof Profile => {
  Profile.init(
    {
      id: {
        type: DataTypes.UUID,
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
      userRole: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      occupation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      teamSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      yearsOfExperience: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      caseResolved: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      successRate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      establishedAt: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Profile',
      tableName: 'profiles',
      timestamps: true,
      paranoid: true,
    },
  );
  return Profile;
};
