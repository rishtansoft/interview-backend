import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/config';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

class User extends Model {
  public id!: string;
  public username!: string;
  public email!: string;
  public role!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    values: ['superadmin', 'admin', 'user'],
    allowNull: false,
    defaultValue: 'user'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await User.hashPassword(user.password);
      }
    }
  }
});

sequelize.sync()
  .then(async () => {
    console.log('Users table has been synchronized successfully.');
    // Superadmin foydalanuvchisini yaratish
    const superadminExists = await User.findOne({ where: { username: 'superadmin' } });
    if (!superadminExists) {
      await User.create({
        username: 'superadmin',
        email: 'superadmin@example.com',
        role: 'superadmin',
        password: '12345'
      });
      console.log('Superadmin user has been created.');
    }
  })
  .catch(err => console.error('Error synchronizing the users table:', err));

export default User;
