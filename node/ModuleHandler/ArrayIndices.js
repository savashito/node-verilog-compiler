// Constructor
var ArrayIndices = function(indices){
	this.indices_ = indices; // obj.indices;
}



ArrayIndices.prototype.getCode = function(){
	var size = this.indices_;
	// console.log('size',size,size[0],size.length);
	if(size.length==1){
		if(size[0]==1)
			return '';
		return '['+size[0]+']'; 
	}
	return '['+size[0]+','+size[1]+']'; 
};

module.exports = ArrayIndices;