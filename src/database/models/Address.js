const {Model, DataTypes} = require('sequelize')

class Address extends Model{
    static init(sequelize){
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'O nome do endereço é obrigatório'
                    },
                    len: {
                        args: [2,20],
                        msg: "O nome do endereço deve conter entre 2 e 20 caracteres"
                    }
                }
            },
            zipCode: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'O cep é obrigatório'
                    },
                    is: {
                        args: /^(\d){5}-(\d){3}$/,
                        msg: "Formato de cep inválido"
                    },
                }
            },
            street: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'A rua é obrigatória'
                    },
                    len: {
                        args: [4,100],
                        msg: "A rua deve conter entre 4 e 100 caracteres"
                    }
                }
            },
            neighbourhood: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'O bairro é obrigatório'
                    },
                    len: {
                        args: [3,100],
                        msg: "O bairro deve conter entre 3 e 100 caracteres"
                    }
                },
                
            },
            uf: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'O estado é obrigatório'
                    },
                    len: {
                        args: [2,2],
                        msg: "UF deve conter apenas 2 caracteres"
                    }
                }
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'A cidade é obrigatória'
                    },
                    len: {
                        args: [3,100],
                        msg: "A cidade deve conter entre 3 e 100 caracteres"
                    },
                }
            }
        },{
            sequelize,
            tableName: 'addresses',
        })
    }
    static associate(models){
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userID',
        })
    }
}

module.exports = Address