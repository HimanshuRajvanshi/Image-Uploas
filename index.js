console.log("Hi i am");
var sharp = require('sharp');


uploadImages: async (req, res)=> {
    try{      
       console.log("In Upload Image");
       // var modelName = 'users';
       var modelName = req.query.modelName;
       if ((!modelName) || typeof modelName == undefined) {
         return res.status(404).json({ "success": false, "error": { "code": 404, "message": "Please Add Model Name"} });
       }
       req.file('data').upload({ maxBytes:5000000,dirname: '../../assets/images' },async(err,file)=>{
           if(err){
             if(err.code == 'E_EXCEEDS_UPLOAD_LIMIT'){
                 return res.status(404).json({ "success": false, "error": { "code": 404, "message": "Please Select Image Below 5Mb"} });
             }
           }
           let fullpath = []
           let resImagePath = []
           file.forEach(async (element,index) => {      
               var name = generateName() 
               // console.log(element.fd)
               typeArr = element.type.split("/");
               fileExt = typeArr[1]
               fs.readFile(file[index].fd, async(err, data)=>{
                   if (err) {
                       return res.status(403).json({"success": false,"error": {"code": 403,"message": err},});
                   }else{
                       if (data) {
                           var path = file[index].fd
                           fs.writeFile( 'assets/images/'+modelName+ '/' + name +'.'+fileExt, data, function (err, image) {
                               if (err) {
                                   console.log(err)
                                   return res.status(400).json({ "success": false,"error": {"code": 400,"message": err},});
                               }
                           })

                           fullpath.push( name+'.'+fileExt)
                           resImagePath.push('assets/images/'+modelName+'/'  + name+'.'+fileExt)
                           var thumbpath = 'assets/images/' + modelName + '/thumbnail/200/' + name + '.' + fileExt;
                           sharp(path).resize({ height: 200, width: 200 }).toFile(thumbpath).then(function (newFileInfo) { })
                               .catch(function (err) { console.log("Got Error",err); });
                           var thumbpath1 = 'assets/images/' + modelName + '/thumbnail/300/' + name + '.' + fileExt;
                           var thumbpath2 = 'assets/images/' + modelName + '/thumbnail/500/' + name + '.' + fileExt;
                           sharp(path).resize({ height: 300, width: 300 }).toFile(thumbpath1)
                               .then(function (newFileInfo) { })
                               .catch(function (err) { console.log("Got Error",err); });
                           sharp(path).resize({ height: 500, width: 500 }).toFile(thumbpath2)
                               .then(function (newFileInfo) {
                               }).catch(function (err) { console.log("Got Error"); });
   
                               await new Promise(resolve => setTimeout(resolve, 1000));    

                           if(index == file.length -1){                               
                               return res.json({
                                   "success": true,
                                   "code":200,
                                   "data": {
                                       "fullPath": resImagePath[0],
                                       "imagePath":fullpath[0],
                                   },
                               });
                           }
                       }
                   }
               });//end of loop
           })
        })
   }catch(err){
       console.log(err)
       return res.status(500).json({"success": false , "error":{"code":500,"message":""+err}})
   }
   }