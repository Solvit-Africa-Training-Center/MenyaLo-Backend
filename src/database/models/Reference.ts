import { Sequelize, Model, DataTypes } from 'sequelize';
import { Law } from './Law';
import { Article } from './Article';
import { User } from './User';

type ReferenceType = 'Law' | 'Article' | 'Commentary';

interface ReferenceAttributes {
  id: string;
  lawId: string;
  articleId?: string | null;
  parentReferenceId?: string | null;
  userId?: string | null;
  type: ReferenceType;
  title: string;
  citation?: string | null;
  url?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ReferenceCreationAttributes extends Omit<ReferenceAttributes, 'id' | 'type'> {
  id?: string;
  type?: ReferenceType;
}

export class Reference
  extends Model<ReferenceAttributes, ReferenceCreationAttributes>
  implements ReferenceAttributes
{
  public id!: string;
  public lawId!: string;
  public articleId?: string | null;
  public parentReferenceId?: string | null;
  public userId?: string | null;
  public type!: ReferenceType;
  public title!: string;
  public citation?: string | null;
  public url?: string | null;
  public notes?: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  static associate(models: {
    Law: typeof Law;
    Article: typeof Article;
    User: typeof User;
    Reference: typeof Reference;
  }): void {
    Reference.belongsTo(models.Law, {
      foreignKey: 'lawId',
      as: 'law',
    });

    Reference.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article',
    });

    Reference.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Reference.belongsTo(models.Reference, {
      foreignKey: 'parentReferenceId',
      as: 'parentReference',
    });

    Reference.hasMany(models.Reference, {
      foreignKey: 'parentReferenceId',
      as: 'commentaries',
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
      articleId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'articles',
          key: 'id',
        },
        validate: {
          isUUID: {
            args: 4,
            msg: 'Article ID must be a valid UUID',
          },
        },
      },
      parentReferenceId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'references',
          key: 'id',
        },
        validate: {
          isUUID: {
            args: 4,
            msg: 'Parent Reference ID must be a valid UUID',
          },
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        validate: {
          isUUID: {
            args: 4,
            msg: 'User ID must be a valid UUID',
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
        allowNull: true,
        validate: {
          len: {
            args: [0, 500],
            msg: 'Citation cannot exceed 500 characters',
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
          fields: ['articleId'],
          name: 'references_article_id_index',
        },
        {
          fields: ['parentReferenceId'],
          name: 'references_parent_reference_id_index',
        },
        {
          fields: ['userId'],
          name: 'references_user_id_index',
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