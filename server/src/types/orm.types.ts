import { Model } from 'sequelize';

export type Attributes<M extends Model<any>> =
  M extends Model<infer Attributes> ? Attributes : string;
