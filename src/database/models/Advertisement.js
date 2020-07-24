const {Model, DataTypes} = require('sequelize')

class Advertisement extends Model{
    static init(sequelize){
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(500),
                allowNull: false
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Ativo"
            },
        },{
            sequelize,
            tableName: 'adverts'
        })
    }
}

module.exports = Advertisement