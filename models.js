class Product{
    constructor(id,category,name,brand,image,link,price,website,description,meta,type){
        this.id = id
        this.category=category
        this.name=name
        this.brand=brand
        this.image=image
        this.link=link
        this.price = price
        this.website=website
        this.description = description
        this.meta = meta
        this.type = type
        
    }

}

class Categorie{
    constructor(id,name,hasSubCategory,parent){
        this.id= id
        this.name = name
        this.hasSubCategory = hasSubCategory,
        this.parent = parent

    }
}
class WebsiteCategory{
   
        constructor(id,name,hasSubCategory,parent){
            this.id= id
            this.name = name
            this.hasSubCategory = hasSubCategory,
            this.parent = parent
            this.links = []
    
        }

   
}
class Link{
    constructor(url,type){
        this.url = url
        this.type = type

    }

}



module.exports={Product,Categorie,WebsiteCategory,Link}
