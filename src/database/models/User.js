const {Model, DataTypes} = require('sequelize')
const bcrypt = require('bcrypt')

class User extends Model{
    static init(sequelize){
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "O Nome é obrigatório"
                    },
                    len: {
                        args: [3,50],
                        msg: "O nome inserido é muito pequeno"
                    }
                }
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "O Ultimo Nome é obrigatório"
                    },
                    len: {
                        args: [2,50],
                        msg: "O ultimo nome inserido é muito pequeno"
                    }
                }
            },
            whatsapp:{
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: {
                        args: /^\(\d{2}\)[9]\d{4}-\d{4}$/,
                        msg: "Whatsapp inválido"
                    },
                    notNull: {
                        msg: "Whatsapp é obrigatório"
                    }
                }
            },
            avatarUrl: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isUrl: {
                        msg: "A foto de perfil deve ser uma url válida"
                    }
                }
            },
            imagePublicID: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "O Email é obrigatório"
                    },
                    isEmail: {
                        msg: "O Email inserido não é válido"
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "A senha é obrigatória"
                    }
                }
            },
        },{
            sequelize,
            tableName: 'users',
            hooks: {
                beforeCreate: async function(user){
                    if(user.password.length < 5 || user.password.length > 20)
                        throw new Error("A senha deve conter entre 5 e 20 caracteres")

                    await isEmailExists(user);
                    await encryptPassword(user);
                }
            }    
        })
    }
    static associate(models){
        this.hasOne(models.Address, {
            as: 'address',
            foreignKey: 'userID'
        })
        this.hasMany(models.Advertisement, {
            as: 'adverts',
            foreignKey: 'userID'
        })
        this.hasMany(models.AdvertImage, {
            as: 'images',
            foreignKey: 'advertisementID'
        })
    } 
}

//check if the email is registered
const isEmailExists = async user => {
    const exists = await User.findOne({
        where: {
            email: user.email
        }
    })

    if(exists)
        throw new Error("Ja existe uma conta cadastrada com o email informado")
}

//encriypt password before saving the user 
const encryptPassword = async user => {
    try
    {
        user.password = await bcrypt.hash(user.password, 10)
    }
    catch(err){
        throw new Error("Não foi possível criar o usuário. Verifique os dados e tente novamente")
    }
    
}

module.exports = User;