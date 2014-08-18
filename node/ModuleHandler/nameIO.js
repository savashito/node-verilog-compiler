nameIO = function (ioName,name){
	this.ioName = ioName; 	// module wire identifier
	this.name = name;  		// input wire identifier
};
nameIO.prototype.getCode = function(){
	return '.'+this.ioName+'('+this.name.getCode()+'),';
}
ListModuleIOWires = function(list){
	this.listModuleIOWires = list;
};
ListModuleIOWires.prototype.getCode = function(){
	var list = this.listModuleIOWires,s='';
	for (var i = list.length - 1; i >= 0; i--) {
		var nameIO = list[i];
		s+= '\t'+nameIO.getCode()+'\n';
	};
	return s.substr(0,s.length-2)+'\n';
}
module.exports = {
	NameIO:nameIO,
	ListModuleIOWires:ListModuleIOWires
};