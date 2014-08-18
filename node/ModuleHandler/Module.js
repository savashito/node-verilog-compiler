
var tabs=['','\t','\t\t','\t\t\t']; //{0:'',1:'\t',2:'\t\t'}
function wrapInTaps(s,nTabs){
	return s.replace(/\n/g,'\n'+tabs[nTabs]);

}

var Module = function(name,ioModuleWires){
		this.name = name;
		this.ioModuleWires = ioModuleWires; // this is actually never used, only here to follow standard verilog
		var parent = this;
		this.listAssignments = [];
		// this.listInputs=[];this.listOutputs=[];this.listRegs=[];this.listWires=[];
		//this.listIdentifiers={};
		this.addIdentifiers = {
			addGeneric:parent.addGeneric,
			'reg':parent.addReg,
			'wire':parent.addWire,
			'output':parent.addOutput,
			'input':parent.addInput,
			listIdentifiers:{},listRegs:{},
			listWires:{},listInputs:{},listOutputs:{}
		};
		this.listModuleInstances =[];
		this.tabs=0;
	};

var Identifier = require('./Identifier.js');
module.exports = Module; 
	Module.prototype.addModuleInstance=function( moduleInstance ){
		this.listModuleInstances.push(moduleInstance);
		// console.log('added ',moduleInstance);
	};
	Module.prototype.addAssign = function(v){
		
		this.listAssignments.push(v);
		// console.log('assign ',v);
	};
	// this functions are used internally by other actor
	Module.prototype.addReg = function(ident,size,line){
		this.addGeneric(ident,size,line,this.listRegs,'REG');
	}
	Module.prototype.addWire = function(ident,size,line){
		this.addGeneric(ident,size,line,this.listWires,'WIRE');
	};
	Module.prototype.addInput = function(ident,size,line){
		this.addGeneric(ident,size,line,this.listInputs,'INPUT');
	};
	Module.prototype.addOutput = function(ident,size,line){
		this.addGeneric(ident,size,line,this.listOutputs,'OUTPUT');
	};
	// this are the real deal
	Module.prototype.addInputToModule = function(ident,size,line){

		this.addIdentifiers['input'](ident,size,line);
	}
	Module.prototype.addOutputToModule = function(ident,size,line){
		this.addIdentifiers['output'](ident,size,line);
	}

	Module.prototype.generateAcelleratorCode = function(moduleList){
		var s='';

		s += this.getModuleHeader();
		s += this.getStartDeclaration();
		s += this.getInputDeclaration();
		s += this.getOutputDeclaration();
		s += this.getStartAssignments();
		s += this.getAssigmentsDelcaration();
		s += this.getDatapathInstanciation(moduleList);
		/*
		s += this.getOutputDeclaration();
		s += this.getWireDeclaration();
		s += this.getRegDeclaration();
		*/
		s+=this.getEndModule();
		return s;
	};
	Module.prototype.getModuleHeader = function(){

		this.incIdentationLevel();
		return "module "+this.name+'();\n';
	};
	Module.prototype.getEndModule = function(){
		this.decIdentationLevel();
		return "endmodule";
	};
	Module.prototype.getStartDeclaration = function(){
		return '\n'+tabs[this.tabs]+'// Declarations\n';
	};
	Module.prototype.getStartAssignments = function(){
		return '\n'+tabs[this.tabs]+'// Assignments\n';
	};
	Module.prototype.getInputs = function(){
		return this.addIdentifiers.listInputs;
	};
	Module.prototype.getOutputs = function(){
		return this.addIdentifiers.listOutputs;
	};
	Module.prototype.getInputDeclaration = function(){
		return this.getIODeclaration(this.getInputs(),Identifier.getVerilogInputGroupBySize);
	};
	Module.prototype.getAssigmentsDelcaration = function(){
		// tabs[this.tabs]
		
		// console.log(this.listAssignments);
		var s ='';
		var list = this.listAssignments;
		for (var i = list.length - 1; i >= 0; i--) {
			s += tabs[this.tabs]+list[i].getCode()+'\n';
		};
		return s;
	};
	Module.prototype.getDatapathInstanciation = function(moduleList){
		var s = tabs[this.tabs] + '// datapath\n';
		var list = this.listModuleInstances;
		for (var i = list.length - 1; i >= 0; i--) {
			var module = list[i];
			s += tabs[this.tabs] +wrapInTaps(module.getCode(moduleList),this.tabs)+'\n';
		};
		return s;
	}
	Module.prototype.getOutputDeclaration = function(){
		// console.log('getOutputDeclaration',this.getOutputs())
		return this.getIODeclaration(this.getOutputs(),Identifier.getVerilogOutputGroupBySize);
	};
	Module.prototype.getIODeclaration = function(inputs,callbackVerilogCode){
		var t = tabs[this.tabs];
		var s = ''; 
		// var inputs = this.getInputs();// .addIdentifiers.listInputs;
		// classify by sizes :)
		var listSize = {};

		// var k = Object.keys(inputs);
		Object.keys(inputs).forEach(function(key) {
  			var input = inputs[key];
  			var size = input.size;
  			if(listSize[size]==undefined)listSize[size]=[];
  			listSize[size].push(input);
		});
		Object.keys(listSize).forEach(function(key){
			s+= callbackVerilogCode(listSize[key],t);
		});

		return s;
	};

	var isValidTypeDuplicate = function(identifier,type){
		return (identifier==undefined || (type=='WIRE'&&identifier.type=='INPUT') || (type=='REG'&&identifier.type=='OUTPUT') || (type=='WIRE'&&identifier.type=='OUTPUT'));
	};
	Module.prototype.incIdentationLevel = function(){
		this.tabs++;
	};
	Module.prototype.decIdentationLevel=function(){
		this.tabs--;
	};
	Module.prototype.i = function(s){
		// ident a single line
		return tabs[this.tabs]+s;
	};
	Module.prototype.getIdentifier = function(name){
		var identf = this.addIdentifiers.listIdentifiers[name];
		// console.log('this.listIdentifiers',identf);
		return this.addIdentifiers.listIdentifiers[name];
	}
	// Warning! this si call by addIdentifier, not by getIdentifier
	Module.prototype.addGeneric = function(ident,size,line,listGeneric,typeGeneric){
		for (var i = ident.length - 1; i >= 0; i--) {
			/// HAS BEEN ADDED BEFORE?
			// console.log('this.listIdentifiers',this.listIdentifiers);
			if(isValidTypeDuplicate(this.listIdentifiers[ident[i]],typeGeneric)){
				// added
				var generic =  new Identifier({name:ident[i],size:size,line:line,type:typeGeneric});
				// add it to the general list of identifiers
				this.listIdentifiers[ident[i]] = generic;
				// add it to the generics list
				listGeneric[ident[i]] = generic;
				
			}else{
				// error already defined
				console.log('Error, '+this.listIdentifiers[ident[i]].getDuplacateErrorString());
			}

			//console.log('listIdent',this.listIdentifiers);
			// console.log('listGeneric',listGeneric);

		};
	};