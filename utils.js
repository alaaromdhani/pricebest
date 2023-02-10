
const {Product,Categorie} = require("./models")
const util = require('util')

const JumiaFechers = {
    categorieFetcher:function(fs,callback){
        fs.readFile('./jumia.json',(err,data)=>{
            if(!err){
                callback(null,data)
            }

        })
    }

    ,
    productFecher:async function(page,categories){
        let all_products = []
        
        for(let c= 0;c<categories.length;c++){
            for(i = 0;i<categories[c].links.length;i++){
                
                    console.log(" fetching categorie "+categories[c].name+"......")
                    let test = true 
                    let p = 0
                    let numberOfproducts = 0
                    while(test){
                        p++
                        console.log("trying page number"+p+"....")
                        await page.goto(categories[c].links[i].url+"/?page="+p)
                        
                        let products  = await page.evaluate(()=>{
                             if(window.__STORE__!=undefined){if(window.__STORE__.hasOwnProperty("products")){return window.__STORE__.products} else{ return null   }}else{return null}
                        })   
                           
                        if(products==null ||products==undefined || products.length==0){
                            test = false
                            console.log("done with this categorie stopped when productnumber = "+numberOfproducts)
                        }
                        else{
                            products.forEach(element => {
                                all_products.push(new Product(id=element.sku,category=categories[c].id,name=element.name,brand=element.brand,image=element.image,link=element.url,price=element.prices.price,website="jumia.com.tn",description="",meta="",categories[c].links[i].type))
                                
                            });
                            numberOfproducts+=products.length 
                        }
                      
                        
        
        
                    }   
        
        
        
                    
                
                }
                
                
        
        
            }
            return all_products
        }
        
        

    }

const MytekFecher = {

    
        categorieFetcher:function(fs,callback){
            fs.readFile('./mytek.json',(err,data)=>{
                callback(null,data)
    
            })
        }
        ,
        productFecher:async function(browser,page,categories){
            let all_products=[]
            async function visitWebsite(page,url,ctName,pageNumber){
                let products = []
                await page.setRequestInterception(true);
                
                page.on('request', request => {
                if (request.resourceType() === 'image') {
                    request.abort();
                } else {
                    if(request.url().includes("www.facebook.com") && request.method()=="POST" ){
                        const somString = request.postData()
                        const postedData = somString.split('[{')[somString.split('[{').length-1].split("}}]")[0]
                        
                        JSON.parse('[{'+postedData+"}}]").forEach(element=>{
                            let product =new Product(id=element.sku,category=ctName,name=element.name,brand=element.brand,image=element.image,link=element.url,price=element.offers.price,website="mytek.tn",description=element.description,meta="",type=url.type)
                            products.push(product)
                            all_products.push(product)

                        })
                        
                    }
                    request.continue()
                    }
                });
                await page.goto(url.url+"?p="+pageNumber,{
                    waitUntil: "networkidle0"
                    
                })
                
                console.log("done with "+url.url +"with number of products = "+products.length)
            }
            
            for(let c = 0;c<categories.length;c++){
                console.log("checking category c===> "+categories[c].name)
                for(let i=0;i<categories[c].links.length;i++){
                    
                    console.log(" fetching categorie "+categories[c].links[i].url+"......")
                    
                    
                    await page.goto(categories[c].links[i].url)
                    let pages = await page.evaluate(()=>{
                        pageElemens= document.querySelectorAll('a.page') ;if(pageElemens!=null && pageElemens.length!=0){ return parseInt(pageElemens[pageElemens.length-1].textContent.split(" ")[1]) } else{return 1 }
                         
                    })
                    console.log(categories[c].links[i].url+" has "+pages)
                    if(pages!=null && pages!=undefined){
                        for(let index=0;index<pages;index++){
                            console.log("trying page number"+(index+1)+"....")
                            let newpage = await browser.newPage()
                            newpage.setDefaultNavigationTimeout(60000)
                            await visitWebsite(newpage,categories[c].links[i],categories[c].id,index+1)
                        }
                        


                    }
                    console.log("done with category "+categories[c].links[i].url)
                        
                }

            }
            
            
    
    
    
            return all_products
        }
       
}
const spacenetFechers = {
    categorieFetcher:function(fs,callback){
        fs.readFile('./spacenet.json',(err,data)=>{
            if(!err){
                callback(null,data)
            }

        })
    },
    productFecher:async function(page,categories){
        
            let all_products = []
            for (let c=0;c<categories.length;c++){
                console.log("fetching category "+categories[c].name)
                for(let i = 0;i<categories[c].links.length;i++ ){
                    console.log("checking the link "+ categories[c].links[i].url)
                    await page.goto(categories[c].links[i].url)
                    let productsNumber = await page.evaluate(()=>{
                        let div = document.querySelector('.total-products')
                        if(div==null){
                            return 0
                        }
                        if(div.textContent.split("dans ").length<2){
                            return 1
                        }
                        return parseInt(div.textContent.split("dans ")[div.textContent.split("dans ").length-1].split(" produit")[0])
    
                    })    
                    let p = 0
                    let products = []
                    console.log("total number of products"+productsNumber)
                    while(products.length<productsNumber){
                    
                        p++
                        console.log("page number = "+p)
                        await page.goto(categories[c].links[i].url+"/?page="+p)
                        let productObjects = await page.evaluate(()=>{
                            let items=[];let products=[];let len =document.querySelectorAll('.field-product-item').length/2;  document.querySelectorAll('.field-product-item').forEach((item,index)=>{ if(index<len){ items.push(item) }  }) ;
                            items.forEach(i=>{let imgElement=i.querySelector('.product_image');let referenceElement = i.querySelector('.product-reference') ;let brandElement = i.querySelector(".manufacturer-logo");let nameElement = i.querySelector(".product_name");let priceElement=i.querySelector(".product-price-and-shipping"); if(imgElement && nameElement && priceElement && referenceElement&&brandElement){let price  = parseFloat(priceElement.textContent.trim().split("TND")[0].trim().replace(',','.'));let pBrand = brandElement.getAttribute("alt");let pImage = imgElement.getAttribute("src");let pName=nameElement.textContent ;let referenceCheck = referenceElement.querySelector("span") ; let linkElement=i.querySelector("a"); if(referenceCheck && linkElement){ let link  = linkElement.getAttribute("href"); let reference = referenceCheck.textContent; products.push({name:pName,image:pImage,url:link,id:reference,brand:pBrand,price:price})}  } });
                            return products 
    
                        })
                        if(productObjects.length>0){
                            productObjects.forEach((p)=>{
                                let product = new Product(id=p.id,category=categories[c].id,name=p.name,brand=p.brand,image=p.image,link=p.url,price=p.price,website="spacenet",description="",meta="",type=categories[c].links[i].type)
    
                                all_products.push(product)
                            })
                            products = products.concat(productObjects)
                        }
                        else{
                            console.log("something went wrong ")
                            break
                        }
                        
    
                   
                    }
                    console.log("ended fetching with products Number = "+products.length)
    

                }
            }
            
            
              return all_products
            



    },
}
const foireFecher={
    cetegoryFecher:async function(page){
        await page.goto("https://www.foire.tn")
        console.log("waiting for network .....")
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        console.log("completed with success")
        await page.evaluate(()=>{
            let categories=[] ; let mainCategories = document.querySelectorAll('li.category-nav-element'); mainCategories.forEach(li=>{ctName=li.querySelector('span.cat-name').textContent; let level1={id:categories.length+1,name:ctName,hasSubCategory:true,parent:0}; let menu = li.querySelector('div.card-columns')  ; categories.push(level1) ;if(menu!=null) {let sub_menus = menu.querySelectorAll('div.card') ;sub_menus.forEach(s=>{ let level3_cats = s.querySelectorAll('a.linkxxx'); if( level3_cats.length==0 ){ let level2_cat = {id:categories.length+1,name:s.querySelector('a.linkx').textContent,hasSubCategory:false,parent:level1.id}; categories.push(level2_cat)  }else{ let level2_cat = {id:categories.length+1,name:s.querySelector('a.linkx').textContent,hasSubCategory:true,parent:level1.id}; categories.push(level2_cat); level3_cats.forEach(l3=>{ categories.push({id:categories.length+1,name:l3.textContent,hasSubCategory:false,parent:level2_cat.id})  }) }  }  ) }});    
            return categories

        })

    }



}
module.exports={spacenetFechers,JumiaFechers,MytekFecher,foireFecher}
