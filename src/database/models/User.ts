import { Sequelize, Model, DataTypes } from 'sequelize';
import { Role } from './Role';
import { Profile } from './Profile';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  roleId: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface UserCreationAttributes
  extends Omit<UserAttributes, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'> {
  id?: string;
  deletedAt?: null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public roleId!: string;
  public isActive!: boolean;

  public createdAt: Date = new Date();
  public updatedAt!: Date;
  public deletedAt: null = null;

  static associate(models: { Role: typeof Role; Profile: typeof Profile }): void {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    User.hasMany(models.Profile, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

  public toJSON(): object | UserAttributes {
    return {
      ...this.get(),
      password: undefined,
      deletedAt: undefined,
    };
  }
}

export const UserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
    },
  );
  return User;
};
