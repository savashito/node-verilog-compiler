	var AritOp = function(op,a,b){
		this.getCode=function(){
			// we can optimize code here
			// if both are constants do the op
			var exp = ''
			if(a.isConstant() && b.isConstant()){
				exp = a.const + b.const;
			}else 
				exp = a.getCode()+' '+op+' '+b.getCode();

			return '('+exp+')';
		};
		this.toString = this.getCode;
	};
	AritOp.prototype.isConstant = function(){return false;};
	module.exports = AritOp;