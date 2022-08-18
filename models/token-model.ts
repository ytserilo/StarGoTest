import { DataTypes, Model } from 'sequelize'
import { sequelize } from "../db";

export interface TokenInterface{
    id?: number;
    refreshToken: string;
    UserId?: number;
}
export class Token extends Model<TokenInterface> implements TokenInterface {
    public refreshToken!: string;
    public UserId?: number; 
}

Token.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelize,
    modelName: 'Token'
});
