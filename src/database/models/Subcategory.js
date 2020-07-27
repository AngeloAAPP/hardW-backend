const {Model, DataTypes} = require('sequelize')

class Subcategory extends Model{
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            imageUrl: DataTypes.STRING
        },{
            sequelize, 
            tableName: 'subcategories'
        })
    }
    static associate(models){
        this.belongsToMany(models.Category, {
            as: 'categories',
            through: 'categories-subcategories',
            foreignKey: 'subcategoryID'
        })
        this.hasMany(models.Advertisement, {
            as: 'adverts',
            foreignKey: 'subcategoryID'
        })
    }
}

module.exports = Subcategory