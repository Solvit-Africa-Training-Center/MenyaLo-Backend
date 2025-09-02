import { Sequelize, Model, DataTypes } from 'sequelize';
import { Post } from './Post';

interface HashtagAttributes {
  id: string;
  name: string;
  postCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface HashtagCreationAttributes extends Omit<HashtagAttributes, 'id'> {
  id?: string;
}

export class Hashtag
  extends Model<HashtagAttributes, HashtagCreationAttributes>
  implements HashtagAttributes
{
  public id!: string;
  public name!: string;
  public postCount!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  static associate(models: { Post: typeof Post }): void {
    Hashtag.belongsToMany(models.Post, {
      through: 'post_hashtags',
      foreignKey: 'hashtagId',
      otherKey: 'postId',
      as: 'posts',
    });
  }

  public toJSON(): object | HashtagAttributes {
    return {
      ...this.get(),
    };
  }
}

export const HashtagModel = (sequelize: Sequelize): typeof Hashtag => {
  Hashtag.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Hashtag name cannot be empty',
          },
          len: {
            args: [1, 100],
            msg: 'Hashtag name must be between 1 and 100 characters',
          },
        },
      },
      postCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Post count cannot be negative',
          },
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: 'Hashtag',
      tableName: 'hashtags',
      indexes: [
        {
          unique: true,
          fields: ['name'],
          name: 'hashtags_name_unique',
        },
        {
          fields: ['postCount'],
          name: 'hashtags_post_count_index',
        },
        {
          fields: ['createdAt'],
          name: 'hashtags_created_at_index',
        },
      ],
    },
  );

  return Hashtag;
};