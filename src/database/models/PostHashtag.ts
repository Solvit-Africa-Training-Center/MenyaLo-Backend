import { Sequelize, Model, DataTypes } from 'sequelize';

interface PostHashtagAttributes {
  postId: string;
  hashtagId: string;
}

export class PostHashtag
  extends Model<PostHashtagAttributes>
  implements PostHashtagAttributes
{
  public postId!: string;
  public hashtagId!: string;
}

export const PostHashtagModel = (sequelize: Sequelize): typeof PostHashtag => {
  PostHashtag.init(
    {
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
      },
      hashtagId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'hashtags',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'PostHashtag',
      tableName: 'post_hashtags',
      indexes: [
        {
          unique: true,
          fields: ['postId', 'hashtagId'],
          name: 'post_hashtags_unique',
        },
        {
          fields: ['hashtagId'],
          name: 'post_hashtags_hashtag_id_index',
        },
        {
          fields: ['postId'],
          name: 'post_hashtags_post_id_index',
        },
      ],
    },
  );

  return PostHashtag;
};