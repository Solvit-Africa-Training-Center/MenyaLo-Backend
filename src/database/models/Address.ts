import { Sequelize, Model, DataTypes } from 'sequelize';
import { Profile } from './Profile';

interface AddressAttributes {
  id: string;
  country: string;
  province: string;
  city: string;
  district: string;
  sector: string;
  street?: string;
  profileId: string;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface AddressCreationAttributes
  extends Omit<AddressAttributes, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'> {
  id?: string;
  deletedAt?: null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Address
  extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes
{
  public id!: string;
  public country!: string;
  public province!: string;
  public city!: string;
  public district!: string;
  public sector!: string;
  public street!: string;
  public profileId!: string;
  public latitude?: number;
  public longitude?: number;
  public updatedAt!: Date;
  public createdAt: Date = new Date();
  public deletedAt: null = null;

  static associate(models: { Profile: typeof Profile }): void {
    Address.belongsTo(models.Profile, {
      foreignKey: 'profileId',
      as: 'profile',
    });
  }

  public toJSON(): object | AddressAttributes {
    return {
      ...this.get(),
      updatedAt: undefined,
      createdAt: undefined,
      deletedAt: undefined,
    };
  }
}

export const AddressModel = (sequelize: Sequelize): typeof Address => {
  Address.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      country: {
        type: DataTypes.STRING,
        defaultValue: 'Rwanda',
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sector: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      profileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'profiles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Address',
    },
  );
  return Address;
};
