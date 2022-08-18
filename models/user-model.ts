import { DataTypes, Model } from 'sequelize'
import { sequelize } from "../db";
import { Token } from './token-model';

export interface UserInterface{
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    age: number;
    gender: string;
}
export class User extends Model<UserInterface> implements UserInterface {
    public id?: number;
    public username!: string;
    public firstName!: string;
    public lastName!: string;
    public password!: string;
    public age!: number;
    public gender!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelize,
    modelName: 'User'
});

User.hasOne(Token);