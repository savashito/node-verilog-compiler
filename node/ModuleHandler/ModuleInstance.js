

ModuleInstance = function (moduleName,listIO){
	this.moduleName = moduleName; 	// module wire name
	this.instanciationName = ModuleInstance.newInstaciationName(moduleName);
	this.listIO = listIO;  		// input wire name
	console.log('ModuleInstance, ',moduleName,listIO)
};
ModuleInstance.prototype.getCode = function(moduleList){
	var module = moduleList[this.moduleName];
	var s='';
	if(module){
		s = this.moduleName+' '+this.instanciationName+' (\n';
		s += this.listIO.getCode();
		s += ');\n'
	}else{
		console.log('Module '+this.moduleName+' not declared')
	}

	return s;
};
ModuleInstance.prototype.setInstanceLine = function(line){
	this.line = line;
}


// static memebers
ModuleInstance.InstanciationId ={};
ModuleInstance.newInstaciationName=function(name){
	var id;
	if(ModuleInstance.InstanciationId[name]){
		id = ModuleInstance.InstanciationId[name]++;
	}else{
		ModuleInstance.InstanciationId[name] = 1;
		id = 0;
	}
	return name+'_'+id;
}
	


module.exports = ModuleInstance;