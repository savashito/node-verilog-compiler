var LogicOp = function(op,a,b){
	this.getCode=function(){
		return '('+a.getCode()+' '+op+' '+b.getCode()+')';
	};
	this.toString = this.getCode;
};
LogicOp.prototype.isConstant = function(){return false;};
module.exports = LogicOp;