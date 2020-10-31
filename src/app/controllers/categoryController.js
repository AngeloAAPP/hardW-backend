const Category = require('../../database/models/Category')

module.exports = {
    //list all categories
    index: async(req,res) => {
        const categories = await Category.findAll({
            attributes: ['id', 'name', 'imageUrl'],
            include: {
                association: 'subcategories',
                attributes: ['id', 'name', 'imageUrl'],
                through: {
                    attributes: []
                }
        }})
    
        return res.json(categories)
    }
}