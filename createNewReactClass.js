const fs = require('fs');
const readline = require('readline');
const prototypeFile = __dirname + "/" + 'prototypeReactFile.txt';
let result;

//root directory, change to your root directory
const rootdir = __dirname;

//create interFace
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// First Question where in the root directory do you want the file
// "/" at the end is not necessary
rl.question('Enter Where ', (answerWhere) => {
  result = rootdir + '/' + answerWhere;
  console.log('Got location: ' + result );

  //Second Question What name do you want to give the file?
  // "/" at the beginning is not necessary
  // .jsx not necessary
  rl.question('Enter Filename ', (answerFileName)=>{
    //clean the entered filename
    answerFileName = cleanFileName(answerFileName);

    //combine the the location with the filename
    result = result + '/' + answerFileName + '.jsx';
    console.log('Creating file: ' + result);

    //read the prototypefile.
    fs.readFile(prototypeFile, function(err, data) {

      //the filename will be the classname, use capitalize helper function below
      const classname = capitalize(answerFileName);

      //write the data to the newly created file.
      fs.writeFile(result, eval('`' + data.toString('utf-8') + '`'), function (err) {

        if (err) throw err;
        console.log('React class file created at: ' + result);

      rl.close();
      });
    });
  })
});

//helper function to capitalize the first letter of a string
const capitalize = (str) =>{
  str = str.split('');
  str[0] = str[0].toUpperCase();
  return str.join('');
}

//helper method to take out the .jsx suffix
const cleanFileName = (answerFileName) => {
  if (answerFileName.includes('.jsx')){
    answerFileName = answerFileName.split(".")[0];
  }
  return answerFileName;
}
