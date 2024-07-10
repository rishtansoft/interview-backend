import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: true // createdAt va updatedAt uchun
});

sequelize.sync() // Jadvallarni yaratish
  .then(() => console.log('Users table has been synchronized successfully.'))
  .catch(err => console.error('Error synchronizing the users table:', err));

export default User;
