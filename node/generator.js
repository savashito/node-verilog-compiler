// mygenerator.js
// var Parser = require("jison").Parser;

var parser = require("./parseAccelerator").parser;

var routeBenchmark = './Pipeline'

var verilogUtil = {
	isVerilogFileName:function(s){
		// console.log(s);
		return (s.match('.*\.v')!=null);
	}
}

// console.log(parser)
// you can also use the parser directly from memory
// console.log("Hola\nComo te va?"); 
var fs = require('fs');




/*

var accDir = '../Pipeline/Accellerator/';
fs.readdir(accDir,function(err,names){
	for (var i = names.length - 1; i >= 0; i--) {
		if(verilogUtil.isVerilogFileName(names[i])){
			// console.log('df '+names[i]);
			var path = accDir+names[i];
			console.log(path)
			fs.readFile(path,function(err,data){
				console.log(data);
			})
		}
	};
});

*/


fs.readFile('./testFile.v',function(err,data){

	//if(err)throw err;
	//console.log('miau: '+data);
	
	moduleHandler = parser.parse(''+data);
	moduleHandler.setTopModule('pipeLineAcceleratorQS');
	moduleHandler.generateAcelleratorCode(function(code){

		console.log('OutCode:\n',code);
	});
/*
	function(moduleHandler){
		
		console.log('OutCode:\n',);

	});
	
	//parser.asincParse(''+data,function(moduleHandler){
		/*
		moduleHandler.setTopModule('pipeLineAcceleratorQS');
		console.log('OutCode:\n',moduleHandler.generateAcelleratorCode());
*/
	
})

// console.log(parser.parse("modulec\n"));
// returns true

//console.log(parser.parse("adfe34bc zxg"));
// throws lexical error