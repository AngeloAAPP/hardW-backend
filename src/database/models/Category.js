const {Model, DataTypes} = require('sequelize')

class Category extends Model{
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            imageUrl: DataTypes.STRING
        },{
            sequelize, 
            tableName: 'categories'
        })
    }
    static associate(models){
        this.belongsToMany(models.Subcategory, {
            as: 'subcategories',
            through: 'categories-subcategories',
            foreignKey: 'categoryID'
        })
        this.hasMany(models.Advertisement, {
            as: 'adverts',
            foreignKey: 'categoryID'
        })
    }
}

module.exports = Category