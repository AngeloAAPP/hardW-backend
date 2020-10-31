const {Model, DataTypes} = require('sequelize')

class Question extends Model{
    static init(sequelize){
        super.init({
            question: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "A pergunta é obrigatória"
                    },
                    len: {
                        args: [10, 200],
                        msg: "A pergunta deve conter entre 10 e 200 caracteres"
                    }
                }
            },
            answer: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    len:{
                        args: [1, 200],
                        msg: "A pergunta deve conter entre 1 e 200 caracteres"
                    }
                }
            }
        },{
            sequelize, 
            tableName: 'questions'
        })
    }
    static associate(models){
        this.belongsTo(models.User, {
            as: 'autor',
            foreignKey: 'userID'
        })
        this.belongsTo(models.Advertisement, {
            as: 'advertisement',
            foreignKey: 'advertisementID'
        })
    }
}

module.exports = Question