const {Product,Categorie,WebsiteCategory,Link} = require("./models")

const BrandFecher=async function(fs,callback){
    function isLike(str1,str2){
            if(str1.includes(str2)){
                return true
            }
            if(str2.includes(str1)){

                return true
            }
            return false
    }
    
    fs.readFile('./all_spacenet_products.json',(err,data)=>{
        let all_jumia_products=JSON.parse(data)
        all_jumia_products.forEach(element => {
            element.price = parseFloat(element.price)
            
        });
        fs.writeFile('./all_spacenet_products.json',JSON.stringify(all_jumia_products),(e,d)=>{
            if(!e){
                console.log("changes are written to file as successfully")
            }           
            callback(null,d)
        })



    })

}

const detailFecher = function(fs){
    /*let DataLinks=new Map()
    const findAllSubstrings=function(str){
        let substringTable = []
         if(str.length>=5){
             for(let i =0;i<str.length-5;i++){
                 substringTable.push(str.substring(i,i+5))
     
             }
     
         }
         else if(str.length>=4){
             for(let i =0;i<str.length-5;i++){
                 substringTable.push(str.substring(i,i+4))
     
             }
     
         }
         
         return substringTable
     
     
     
     }
     function handleLinks( link1 ){
       
            let type= link1.split("/")[link1.split("/").length-1].split(".")[0]
            let All_types = Array.from(DataLinks.keys())
            let semilarTypes = All_types.filter(t=>isLike(type,t))
            if(semilarTypes.length>0){
                DataLinks.get(semilarTypes[0]).push(link1)

            }
            else{

                DataLinks.set(type,[link1])

            }
       

    }
        
        
     
    function isLike(str1,str2){
        str1 = str1.toUpperCase().trim().replace(/[._-]/g,'')
        str2 = str2.toUpperCase().trim().replace(/[._-]/g,'')
        
        let table1 = findAllSubstrings(str1)
        let table2 = findAllSubstrings(str2)
       if(table1.length>table2.length){
            
            return (table2.filter(s=>table1.filter(str=>str.includes(s)).length>0).length>0)
        
       }
       else{
        return (table1.filter(s=>table2.filter(str=>str.includes(s)).length>0).length>0)

       }
               
    }
    function getAllLinks(id,callback){
        let all_links=[]
        fs.readFile('jumia.json',(err,data)=>{
            JSON.parse(data).filter(c=>c.id==id)[0].links.forEach(i=>{
                i=i.substring(0,i.length-1)
                all_links.push("https://www.jumia.com.tn"+i)
            
            })
            fs.readFile('spacenet.json',(e,d)=>{
                JSON.parse(d).filter(c=>c.id==id)[0].links.forEach(lc=>{
                    all_links.push("https://www.spacenet.tn"+lc)
                })
                
                
                fs.readFile('websiteCategories.json',(er,da)=>{
                    all_links = all_links.concat(JSON.parse(da).filter(c=>c.id==id)[0].links)
                    
                    callback(null,all_links)

                }) 

            })
            

        })


    }
    

    getAllLinks(id,(err,data)=>{
        let all_links = []
        data.forEach(l=>{
            handleLinks(l)
        })
       let all_types = Array.from(DataLinks.keys())
       all_types.forEach(t=>{
        DataLinks.get(t).forEach(l=>{
            all_links.push(new Link(l,t))
        })


       })
       writetoFile(JSON.stringify(all_links))
    })*/
    function writetoFile(f,somString){

        fs.appendFileSync('./'+f, somString, 'utf8', err => {
            if (err) {
              console.log(`Error writing file: ${err}`)
            } else {
              console.log(`File is written successfully!`)
            }
          })
    
      }
      
      function mapToCategory(){
        fs.readFile('./websiteCategories.json',(err,data)=>{
            let new_categories = []
            JSON.parse(data).forEach(c=>{
                if(!c.hasOwnProperty("links")){
                    new_categories.push({id:c.id,name:c.name,hasSubCategory:c.hasSubCategory,parent:c.parent,links:[]})
                }
                else{
                    new_categories.push({id:c.id,name:c.name,hasSubCategory:c.hasSubCategory,parent:c.parent,links:c.links})

                }
            })
            writetoFile("backup.json",JSON.stringify(new_categories))
        })
    
        }
        mapToCategory()
   // getAllLinks()
    

    

}

module.exports={BrandFecher,detailFecher}