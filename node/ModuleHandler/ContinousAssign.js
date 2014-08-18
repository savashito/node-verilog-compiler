var ContinousAssign = function(q,rTrue,rFalse){
	this.getCode=function(){
		return q.getCode()+'?'+rTrue.getCode()+':'+rFalse.getCode();
	};
	this.toString = this.getCode;
};

module.exports = ContinousAssign;