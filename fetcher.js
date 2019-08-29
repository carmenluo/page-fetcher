const request = require('request');
const readline = require('readline');
const fs = require('fs');
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const fetcher = function () {
  const arguments = process.argv.slice(2);
  request(arguments[0], (error, response, body) => {
    console.log('error', error);
    console.log('statusCode', response && response.statusCode);
    console.log('body', body);
    if (response.statusCode === 200) {
      let file = arguments[1];
      checkFileExist(file).then(result=>{
        r1.close();
        if (result === "ok"){
          writeFinishedPromise(file, body).then(data =>{
            console.log(data);
            const fileSize = fs.statSync(file);
            console.log(`Downloaded and saved ${fileSize.size} bytes`);

          })
        }
      })
      
    }
    else {
      console.log(`Something wrong happen to our connection!!!`);
      process.exit();
    }
  })
}
const writeFinishedPromise = (file, data) =>{
  return new Promise((resolve, reject)=>{
    fs.writeFile(file, data,function (err){
      if (err) throw err;
      else resolve("ok");
    })
  })
}
const checkFileExist = function (file){
  return new Promise((resolve, reject)=>{
    try{
      if (fs.existsSync(file)){
        r1.question("Do you want to overwrite the file\n",answer=>{
          if (answer == "y"){
            resolve("ok");
          }
          else {
            process.exit();
          }
        })
      }
      else {resolve("ok");}
    } catch(err){
      console.error(err);
    }
  })
}
fetcher();