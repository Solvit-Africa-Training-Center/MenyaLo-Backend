import { Sequelize, Model, DataTypes } from 'sequelize';
import { Law } from './Law';

type ReferenceType = 'Law' | 'Article' | 'Commentary';

interface ReferenceAttributes {
  id: string;
  lawId: string;
  type: ReferenceType;
  title: string;
  citation: string;
  url?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ReferenceCreationAttributes extends Omit<ReferenceAttributes, 'id'> {
  id?: string;
}

export class Reference
  extends Model<ReferenceAttributes, ReferenceCreationAttributes>
  implements ReferenceAttributes
{
  public id!: string;
  public lawId!: string;
  public type!: ReferenceType;
  public title!: string;
  public citation!: string;
  public url?: string | null;
  public notes?: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  static associate(models: { Law: typeof Law }): void {
    Reference.belongsTo(models.Law, {
      foreignKey: 'lawId',
      as: 'law',
    });
  }

  public toJSON(): object | ReferenceAttributes {
    return {
      ...this.get(),
    };
  }
}

export const ReferenceModel = (sequelize: Sequelize): typeof Reference => {
  Reference.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lawId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'laws',
          key: 'id',
        },
        validate: {
          notEmpty: {
            msg: 'Law ID cannot be empty',
          },
          isUUID: {
            args: 4,
            msg: 'Law ID must be a valid UUID',
          },
        },
      },
      type: {
        type: DataTypes.ENUM('Law', 'Article', 'Commentary'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['Law', 'Article', 'Commentary']],
            msg: 'Type must be Law, Article, or Commentary',
          },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Title cannot be empty',
          },
          len: {
            args: [3, 500],
            msg: 'Title must be between 3 and 500 characters',
          },
        },
      },
      citation: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Citation cannot be empty',
          },
          len: {
            args: [3, 500],
            msg: 'Citation must be between 3 and 500 characters',
          },
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'URL must be a valid URL',
          },
          len: {
            args: [0, 2000],
            msg: 'URL cannot exceed 2000 characters',
          },
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 5000],
            msg: 'Notes cannot exceed 5000 characters',
          },
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: 'Reference',
      tableName: 'references',
      indexes: [
        {
          fields: ['lawId'],
          name: 'references_law_id_index',
        },
        {
          fields: ['type'],
          name: 'references_type_index',
        },
        {
          fields: ['createdAt'],
          name: 'references_created_at_index',
        },
      ],
    },
  );

  return Reference;
};