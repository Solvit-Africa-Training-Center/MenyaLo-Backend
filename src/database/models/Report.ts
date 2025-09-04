import { Sequelize, Model, DataTypes } from 'sequelize';
import { User } from './User';

export interface ReportAttributes {
  id: string;
  reporterId: string;
  reportedId: string;
  reason?: string;
  status?: 'pending' | 'reviewed' | 'blocked';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReportCreationAttributes
  extends Omit<ReportAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export class Report extends Model<ReportAttributes, ReportCreationAttributes>
  implements ReportAttributes {
  public id!: string;
  public reporterId!: string;
  public reportedId!: string;
  public reason?: string;
  public status?: 'pending' | 'reviewed' | 'blocked';
  public createdAt?: Date;
  public updatedAt?: Date;

  static associate(models: { User: typeof User }): void {
    Report.belongsTo(models.User, { foreignKey: 'reporterId', as: 'reporter' });
    Report.belongsTo(models.User, { foreignKey: 'reportedId', as: 'reported' });
  }

  public toJSON(): object | ReportAttributes {
    return { ...this.get() };
  }
}

export const ReportModel = (sequelize: Sequelize): typeof Report => {
  Report.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reporterId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reportedId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'blocked'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Report',
      tableName: 'reports',
      paranoid: true,
    },
  );

  return Report;
};
