var Identifier = function(obj){
	// initialize internal variables
	this.name = obj.name;
	this.size = obj.size;
	this.line = obj.line;
	this.type = obj.type;

};
Identifier.prototype.getDuplacateErrorString = function(){
	var s = this.name +' is already define as '+ this.type+' on line '+this.line;

	return s;
};
// this is the code call when instanced
Identifier.prototype.getCode = function(){
	return this.name;
};

// returns the string declaring the identifieres orginize by string
// only verilog
Identifier.getVerilogInputGroupBySize = function(listIdentifiers,t){
	return Identifier.getVerilogIOGroupBySize(listIdentifiers,t,['input','wire']);
};
Identifier.getVerilogOutputGroupBySize = function(listIdentifiers,t){
	return Identifier.getVerilogIOGroupBySize(listIdentifiers,t,['output','reg']);
};
Identifier.getVerilogIOGroupBySize = function(listIdentifiers,t,listProto){
	var s = '';
	var size = listIdentifiers[0].size;
	for (var i = listIdentifiers.length - 1; i >= 0; i--) {
		s+= listIdentifiers[i].name + ', ';
	};
	s = s.substr(0,s.length-2)+';\n';
	var out ='';
	for (var i = listProto.length - 1; i >= 0; i--) {
		out += t+listProto[i]+ size.getCode() +' '+s;
	};
	return 	out;
};
/* Identifier.getVerilogSize(size) 
Identifier.getVerilogSize = function(size){
	console.log('size',size,size[0],size.length);
	if(size.length==1){
		if(size[0]==1)
			return '';
		return '['+size[0]+']'; 
	}
	return '['+size[0]+','+size[1]+']'; 
};
*/
module.exports = Identifier;