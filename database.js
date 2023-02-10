const sequelize = new Sequelize('pricebest', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

const ProductEntity = sequelize.defsine('product',{
    //id,category,name,brand,image,link,price,website
    id:{
      type:Sequelize.STRING,
      primaryKey:true
      
    },
    name:{
      type:Sequelize.STRING
    },
    brand:{
      type:Sequelize.STRING
    },
    image:{
      type:Sequelize.STRING
    },
    price:{
      type:Sequelize.FLOAT
    },
    website:{
      type:Sequelize.STRING
    }

  })
  const CategoryEntity= sequelize.define('category',{
    id:{
      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true

    },
    name:{
      type:Sequelize.STRING
    },
    hasSubCategory:{
      type:Sequelize.BOOLEAN
    },






  })
  ProductEntity.belongsTo(CategoryEntity,{foreignKey:'categoryId',as:"category"})
  CategoryEntity.hasMany(ProductEntity,{as:"products"})
  CategoryEntity.belongsTo(CategoryEntity,{foreignKey:'categoryId',as:"parent"})
  CategoryEntity.hasMany(CategoryEntity,{as :"children"})
  sequelize.sync().then(()=>{
    console.log('tables created')
  })