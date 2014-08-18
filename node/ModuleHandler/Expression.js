var Expression = function(obj){
	// initialize internal variables
	this.identifier = obj.identifier;
	this.arrayIndices = obj.index;
	this.const = obj.const;
};

// can be overwrited
Expression.prototype.getCode = function(){
	var indices = this.arrayIndices?this.arrayIndices.getCode():'';
	if(this.isConstant())
		return this.const;
	return this.identifier.getCode()+indices;
};
Expression.prototype.isConstant = function(){
	return this.const !== undefined; 
}

Expression.constant = function(cons){
	return new Expression({const:cons});
}

module.exports = Expression;