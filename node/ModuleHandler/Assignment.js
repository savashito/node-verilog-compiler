// Constructor
var Assignment = function(obj){
	// left and right val are expression objetcs
	this.lval_ = obj.lval;
	this.rval_ = obj.rval;
	this.line_ = obj.line;
}

Assignment.prototype.getCode = function(){
	return 'assign '+this.lval_.getCode()+' = '+this.rval_.getCode();
}

module.exports = Assignment;