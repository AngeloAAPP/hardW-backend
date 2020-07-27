const {Model, DataTypes} = require('sequelize')
const {cloudinary} = require('../../config/cloudinary')

class AdvertImage extends Model{
    static init(sequelize){
        super.init({
            url: DataTypes.STRING,
            publicID: DataTypes.STRING
        },{
            sequelize, 
            tableName: 'images',
        })
    }
    static associate(models){
        this.belongsTo(models.Advertisement, {
            as: 'advertisement',
            foreignKey: 'advertisementID'
        })
    }
}

module.exports = AdvertImage