const { Model, DataTypes } = require('sequelize')
const Category = require('../models/Category')

class Advertisement extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Nome do anúncio é obrigatório"
                    },
                    len: {
                        args: [4, 60],
                        msg: "Nome do anúncio deve conter entre 4 e 60 caracteres"
                    }
                }
            },
            description: {
                type: DataTypes.STRING(500),
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Descrição do anúncio é obrigatória"
                    },
                    len: {
                        args: [20, 500],
                        msg: "A descrição do anúncio deve conter entre 20 e 500 caracteres"
                    }
                }
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Preço é obrigatório"
                    }
                }
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Ativo"
            },
        }, {
            sequelize,
            tableName: 'adverts',
            hooks: {
                
                beforeCreate: async function (advertisement) {

                    //check categories and subcategories

                    if (!advertisement.categoryID)
                        throw new Error("Categoria é obrigatória")

                    const subcategories = await Category.findByPk(advertisement.categoryID, {
                        attributes: ['id'],
                        include: {
                            association: 'subcategories',
                            attributes: ['id']
                        }
                    })

                    if (!subcategories)
                        throw new Error("Categoria não encontrada")

                    if (!advertisement.subcategoryID && subcategories.dataValues.subcategories.length > 0)
                        throw new Error("Subcategoria é obrigatória para a categoria escolhida")

                    const subcategoriesIDS = subcategories.dataValues.subcategories.map(sub => sub.dataValues.id)

                    //checks if the chosen category has the chosen subcategory
                    if (advertisement.subcategoryID && !subcategoriesIDS.includes(+ advertisement.subcategoryID))
                        throw new Error("Subcategoria inválida para a categoria escolhida")

                },
                beforeUpdate: async function ({status}) {
                    if (status)
                        if (status !== 'Ativo' && status !== 'Inativo')
                            throw new Error("status inválido! deve ser Ativo ou Inativo")
                }
            }
        })
    }
    static associate(models) {
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userID'
        })
        this.belongsTo(models.Category, {
            as: 'category',
            foreignKey: 'categoryID'
        })
        this.belongsTo(models.Subcategory, {
            as: 'subcategory',
            foreignKey: 'subcategoryID'
        })
        this.hasMany(models.AdvertImage, {
            as: 'images',
            foreignKey: 'advertisementID'
        })
        this.hasMany(models.Question, {
            as: 'questions',
            foreignKey: 'advertisementID'
        })
    }
}

module.exports = Advertisement