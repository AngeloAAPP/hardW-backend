const {Model, DataTypes} = require('sequelize')

class Subcategory extends Model{
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            imageURL: DataTypes.STRING
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
    }
}

module.exports = Subcategory