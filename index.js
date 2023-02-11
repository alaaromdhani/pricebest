

const request = require("request")
const multer =require('multer')
const {BrandFecher,detailFecher} = require('./CategoryFetcher')
const {spacenetFechers,JumiaFechers,MytekFecher,foireFecher} = require("./utils")
const puppeteer = require('puppeteer')
const Sequelize = require('sequelize');
const fs = require("fs");
const cors = require("cors")
const { hasSubscribers } = require("diagnostics_channel");
const { stringify } = require("querystring");
const { get } = require("https");
const express = require('express');
const { isFunction } = require("util");
const app = express();
(async function(){

  let browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })
  let page = await browser.newPage()
    
  function writetoFile(somString){

    fs.appendFileSync('./product.json', somString, 'utf8', err => {
        if (err) {
          console.log(`Error writing file: ${err}`)
        } else {
          console.log(`File is written successfully!`)
        }
      })

  }

  console.log("getting categories ....")
   JumiaFechers.categorieFetcher(fs,async(err,data)=>{
    let products = await JumiaFechers.productFecher(page,JSON.parse(data))
    writetoFile(JSON.stringify(products))  
  })


  
  let minMaxPrice=undefined
  
  
  
  
 
  let all_categories = []
  let all_products=[]

  function getProducts(filename){
    fs.readFile("./"+filename,(err,data)=>{

      if(err){
        console.log(err)
      }
      all_products=JSON.parse(data)
       fs.readFile('all_jumia_products.json',(e,d)=>{
        all_products = all_products.concat(JSON.parse(d))
        fs.readFile('all_spacenet_products.json',(er,da)=>{
          all_products = all_products.concat(JSON.parse(da))
          all_products = all_products.sort(i=>Math.random()-Math.random())

        })
       })
        
      //console.log(allproducts)
    })
 
  }
  
  
  
  async function  getCategories(filename){
     fs.readFile("./"+filename,(err,data)=>{
      if(err){
        console.log(err)
      }
      all_categories=JSON.parse(data)
      
      
      
      
    })
     


     
    
        
      
     }
     

      
    
  


  

    
      getCategories("categories.json");
      getProducts("all_mytek_products.json");
    
   
   

   
   
  
  
  
 
   function compareName(string1,string2){
      const biggerOne = ""
      let semilarities = 0
      if(string1.length>string2.length){
        for(let i=0;i<string2.length;i++){
          if(string1[i]==string2[i]){
            semilarities++
          }

        }
      }
      else{
        for(let i=0;i<string2.length;i++){
          if(string1[i]==string2[i]){
            semilarities++
          }

        }
      }
      return semilarities
      

   }
  
  const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.get('/find/product',(req,res)=>{
    const squ = req.query.id
   
   
    const product = all_products.filter(p=>p.id===squ)[0]
    const sameCat=all_products.filter(p=>p.category==product.category)
    let testingSemilaties = []  
    sameCat.forEach(p=>{
        testingSemilaties.push({product:p,semilatiries:compareName(p.name.toUpperCase().trim(),product.name.toUpperCase().trim())})

    })

    const semilarities = testingSemilaties.sort((p1,p2)=>p2.semilarities-p1.semilarities).slice(0,3)

    res.json({products:product,semilarities:semilarities})


  })
    app.get('/product/search',(req,rs)=>{
        const q = req.query.q
        res.json(all_products.filter(p=>p.name.toUpperCase().includes(q.trim().toUpperCase())).slice(0,3))
    })

    app.get('/api/data', (req, res) => {
      let products=[]
      
    let prices=[]
      let available_brands = new Set()
     const page = req.query.page
     const categorie = req.query.category
     let priceFrom = req.query.priceFrom
     let priceTo = req.query.priceTo
      const  brands = req.query.brands
      if(categorie!=undefined){
        if(priceTo!=undefined && priceFrom!=undefined){
          if(brands!=undefined){
           products = all_products.filter(p=>{
            if(p.category!=categorie){
               return false
            }
            let filterBrands = brands.split(",")

            let testBrand =  (filterBrands.filter(b=>b.trim()==p.brand.name.trim()).length>0)
            if(!testBrand){
              return false
            }
            prices.push(p.price)
            if(p.price<priceFrom){
              return false
            }
            if(p.price>priceTo){
              return false
            }
            available_brands.add(p.brand.image)
            
           })
          }
          else{
            products = all_products.filter(p=>{
              if(p.category!=categorie){
                 return false
              }
              prices.push(p.price)
              if(p.price<priceFrom){
                return false
              }
              if(p.price>priceTo){
                return false
              }
              available_brands.add(p.brand.image)
              return true
             })

          }
        }
        else{
          if(brands!=undefined){
            products = all_products.filter(p=>{
              if(p.category!=categorie){
                 return false
              }
              prices.push(p.price)
              available_brands.add(p.brand.image)
              let filterBrands = brands.split(",")
              return (filterBrands.filter(b=>b.trim()==p.brand.name.trim()).length>0)

             })

          }
          else{
            products = all_products.filter(p=>{
              if(p.category!=categorie){
                 return false
              }
              prices.push(p.price)
              available_brands.add(p.brand.image)
              return true
             })

          }
        }

      }
      else{
        if(brands!=undefined){
          if(priceTo!=undefined && priceFrom!=undefined){
            products = all_products.filter(p=>{
              let filterBrands = brands.split(",")
              let testBrand= (filterBrands.filter(b=>b.trim()==p.brand.name.trim()).length>0)
              if(!testBrand){
                return false
              }
              prices.push(p.price)
              if(p.price<priceFrom){
                return false
              }
              if(p.price>priceTo){
                return false
              }
              available_brands.add(p.brand.image)
              return true
  
             })
          }
          else{
            products = all_products.filter(p=>{
              available_brands.add(p.brand.image)
              
              let filterBrands = brands.split(",")
              let testBrand =  (filterBrands.filter(b=>b.trim()==p.brand.name.trim()).length>0)
              if(testBrand){
                prices.push(p.price)
                return true
              }
              else{
                return false
              }
              
             })
          }

        }
        else{
          if(priceTo!=undefined && priceFrom!=undefined){
            products = all_products.filter(p=>{
              prices.push(p.price)
              if(p.price<priceFrom){
                return false
              }
              if(p.price>priceTo){
                return false
              }
              available_brands.add(p.brand.image)
              return true
             })
          }
          else{
            products=all_products
            all_products.forEach(p=>{
              prices.push(p.price)
              available_brands.add(p.brand.image)
            })

          }
          
        }

      }
      
      
    
      
   

      
     const beginIndex = (page-1)*25
     let  endIndex = beginIndex+25
     if(endIndex>products.length){
        endIndex = products.length
     }
     if(beginIndex>products.length){
      res.json({products:[],items:0,brands:[],prices:minMaxPrice})
   
     }
     else{
      let all_items = products.length
      let sortedPrice = prices.sort((price1,price2)=>{return price1-price2})
      minMaxPrice = {min:sortedPrice[0],max:sortedPrice[sortedPrice.length-1]} 
       
      res.json({products:products.slice(beginIndex,endIndex),items:all_items,brands:Array.from(available_brands),prices:minMaxPrice})
   
     }
     

     products.forEach
    });
    app.get('/api/cat',(req,res)=>{

      res.json(all_categories)

    })
   
    
  

  


app.listen(3000, () => console.log('Server running on port 3000'));


     



})()
/*(async function(){
  function writetoFile(somString){

    fs.appendFileSync('./product.json', somString, 'utf8', err => {
        if (err) {
          console.log(`Error writing file: ${err}`)
        } else {
          console.log(`File is written successfully!`)
        }
      })

  }
  async function findAllMyteckCategories(page,url){
    await page.goto(url,{
      waitUntil: "networkidle0"
    })


  }
  async function getAllLinks(page){
   
    await page.goto("https://www.jumia.com.tn",{
      waitUntil: "networkidle0"
    })

    let links = await page.evaluate(()=>{
      let href = []
        let items = document.querySelectorAll(".s-itm")
        for(let i =0;i<items.length;i++){
          href.push(items[i].getAttribute("href"))
          
        }
        return href 
    })
    console.log(links.length)
    
  }
  async function fetchJumiaWebsite(page,url){
    var products = []
    for(let i=0;i<10;i++){
        console.log("visiting page "+(i+1))  
      await page.goto("https://www.jumia.com.tn/smartphones/?page="+(i+1))
        let productObjects = await page.evaluate(()=>{
            return window.__STORE__.products
        })
        console.log("visiting page "+(i+1)+"with number of products "+(productObjects.length))  
        productObjects.forEach(element => {
          products.push(new Product(id=element.sku,category=element.categories,name=element.name,brand=element.brand,image=element.image,link=element.url,price=element.prices.price,website="jumia.com.tn"))
        });


    }
    console.log("done fetching with number of products = "+products.length)
  }
  async function fetchMytekWebsite(page,url){
    var products = []
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.resourceType() === 'image') {
        request.abort();
      } else {
          if(request.url().includes("www.facebook.com") && request.method()=="POST" ){
            const somString = request.postData()
              const postedData = somString.split('[{')[somString.split('[{').length-1].split("}}]")[0]
              
              JSON.parse('[{'+postedData+"}}]").forEach(element=>{
                let product =new Product(id=element.sku,category="top category",name=element.name,brand=element.brand,image=element.image,link=element.url,price=element.offers.price,website="mytek.tn")
                products.push(product)

              })
              console.log("written to file successfully")
          }
        request.continue()
        }
    });
    const pageUrl = 'https://www.mytek.tn/informatique/ordinateurs-portables/pc-portable.html?p='+1+'&product_list_limit=50'
    await page.goto(pageUrl, {
      waitUntil: "networkidle0"
      
    });
    writetoFile(JSON.stringify(products))
    



  }
  async function fetchSpaceNet(){


  }
  function writetoFile(somString){

    fs.appendFileSync('./product.json', somString, 'utf8', err => {
        if (err) {
          console.log(`Error writing file: ${err}`)
        } else {
          console.log(`File is written successfully!`)
        }
      })

  }
  let browser = await puppeteer.launch()
  let page = await browser.newPage()

  //await page.goto("https://spacenet.tn/")
  
  console.log("fetching for categories ...")
  console.log("fetching spacenet ....")
  let spacenetTable = await spacenetFechers.categorieFetcher(page=page,"https://spacenet.tn")
  console.log("fetch succeed :) :) with number of categories "+spacenetTable.length)
  console.log("fetching jumia")
  let jumiaTable = await JumiaFechers.categorieFetcher(page=page,"https://www.jumia.com.tn/")
  console.log("fetch succeed :) :) with number of categories "+jumiaTable.length)
  console.log("fetching mytek ")
  let mytekTable = await MytekFecher.categorieFetcher(page=page,"https://www.mytek.tn/")
  console.log("fetch succeed :) :) with number of categories "+mytekTable.length)
  console.log("time for some products")
  console.log("spacenet.tn ......")
  let all_products = []
  all_products = all_products.concat(await spacenetFechers.productFecher(page,spacenetTable))
  console.log("done fetching spacenet with success :) :)..")
  
  console.log("mytek.tn")
  all_products = all_products.concat(await MytekFecher.productFecher(browser,page,mytekTable))
  console.log("done fetching mytek with success :) :)..")
  console.log("jumia .....")
  all_products = all_products.concat(await JumiaFechers.productFecher(page,jumiaTable))
  
  console.log("done fetching jumia with success :):) ..")

  writetoFile(JSON.stringify(all_products))

  await browser.close()


  





})()*/
