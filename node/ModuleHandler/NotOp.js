	var Negator = function(rval){
		this.getCode=function(){
			return '!'+rval;
		};
		this.toString = this.getCode;
	};
	exports = Negator;