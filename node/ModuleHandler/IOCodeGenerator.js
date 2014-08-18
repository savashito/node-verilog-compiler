

function IOCodeGenerator(){
	this.iWire = []
	this.oWire = []
}

function makeArray(name_wires){
	if(Array.isArray(name_wires) == false){
		name_wires = [name_wires]
	}
	return name_wires
}
IOCodeGenerator.prototype.addIWire = function(name_wires,i,size){
	name_wires = makeArray(name_wires)

	// wireObj = composeWireObj(nameWire,i)
	this.addIOWire(this.iWire,composeWireObj,name_wires,i,size)
}
IOCodeGenerator.prototype.addOWire = function(name_wires,i,size){
	this.addIOWire(this.oWire,composeWireObjOutput,name_wires,i,size)
}
function composeWireObj(name,i){
	return {name:name+''+i,unconn:'unconn_'+name+''+i,id:i,
			getCodeDeclaration:function(){
					return this.name;
				},
			generateIOWiresString:function(size){
				var wireObj = this
				var s = '// IO wires for '+wireObj.name+'\n'
				s += 'wire ['+size+':0] '+wireObj.unconn+';\nassing '+wireObj.unconn+' = 0; // Ground wire for ODIN\n'
				for (var i = 0; i <size; i++) {
					s += 'io_wire unconn_'+ composeName(wireObj.name,i) +'(.to_uva('+wireObj.unconn+'), .from_uva('+wireObj.name+'['+i+']'+'));\n'
					
				};
				return s
			},
			generateDeclarations:function(size){
				return 'wire ['+size+':0] '
			}
		}
}

function composeWireObjOutput(name,i){
	return {name:name+''+i,unconn:'unconn_'+name+''+i,id:i,
			getCodeDeclaration:function(){
					return this.name;
				},
			generateIOWiresString:function(size){
				var wireObj = this
				var s = '// IO wires for '+wireObj.name+'\n'
				s += 'wire ['+size+':0] '+wireObj.unconn+';\n'
				for (var i = 0; i <size; i++) {
					s += 'io_wire unconn_'+ composeName(wireObj.name,i) +'(.to_uva('+wireObj.name+'['+i+']'+'), .from_uva('+wireObj.unconn+'));\n'
					
				};
				return s
			},
			generateDeclarations:function(size){
				return 'reg ['+size+':0] '
			}
		}
}

IOCodeGenerator.prototype.addIOWire  = function (wires,composeWireObj,name_wires,i,size){
	name_wires = makeArray(name_wires)

	if(wires[size]===undefined)wires[size] = []
	// now its an array
	name_wires.forEach(function(nameWire){
		var obj =  composeWireObj(nameWire,i)
		console.log('added '+obj.name)
		wires[size].push(obj)
		// wih(name_wires)
	})
}

IOCodeGenerator.prototype.getCode = function()
{
	var s = this.getCodeDeclaration(this.iWire) //+ '// inout \n ' +this.getCodeDeclaration(this.iWire)
	return s//this.getCodeGeneric(this.iWire)
}

function composeName(name,i){
	return name+'_'+i
}

/*
function generateIOWiresString(wireObj,size){
	var s = '// IO wires for '+wireObj.name+'\n'
	s += 'wire ['+size+':0] '+wireObj.unconn+';\nassing '+wireObj.unconn+' = 0; // Ground wire for ODIN\n'
	for (var i = 0; i <size; i++) {
		s += 'io_wire unconn_'+ composeName(wireObj.name,i) +'(.to_uva('+wireObj.unconn+'), .from_uva('+wireObj.name+'['+i+']'+'));\n'
		
	};
	return s
}*/

IOCodeGenerator.prototype.getCodeDeclaration = function(ioWires){
	var s = ''
	var io_wire_s = ''
	ioWires.forEach(function(names,size){
		
		s += names[0].generateDeclarations(size)// 'wire ['+size+':0] '
		names.forEach(function(wireObj){
			//console.log('miau '+wireObj.name)
			/*for (var j = 0; j <size; j++) {
				s+= name.getCodeDeclaration()// '\tio_wire '+name+'_'+j+'(.to_uva(unconn_dataIn'+i+'['+j+']), .from_uva(dataIn'+i+'['+j+']));\n'
			}*/
			s += wireObj.name +', '
			io_wire_s += wireObj.generateIOWiresString(size) // generateIOWiresString(wireObj,size) +'\n'
		})
		s = s.substr(0,s.length-2)+';\n'
		//console.log(s+io_wire_s)
		// console.log(p+' i: '+i+'\n')
	});
	return s + io_wire_s
}

IOCodeGenerator.prototype.getCodeGeneric = function(ioWires){
	// ioWires [..,32:['wireName','othrewire'],..,64:]
	s = ''
	/*
	ioWires.forEach(function(names,size){
		names.forEach(function(name){
			for (var j = 0; j <size; j++) {
				s+='\tio_wire '+name+'_'+j+'(.to_uva(unconn_dataIn'+i+'['+j+']), .from_uva(dataIn'+i+'['+j+']));\n'
				// s+='\tio_wire io_minOut'+i+'_'+j+'(.to_uva(unconn_minOut'+i+'['+j+']), .from_uva(minOut'+i+'['+j+']));\n'
			}
		})
		console.log(p+' i: '+i+'\n')
	});
*/
	
	return s
}


function generateComparatorCode(i){
	/*
	comparators = '\twire [31:0] dataIn'+i+' ,minOut'+i+';\n'+
		 	  '\twire ldMax'+i+', compareMax'+i+' , getMax'+i+';\n'+
		 	  '\tComparator3Stage simpleComparator'+i+' (dataIn'+i+', ldMax'+i+', getMax'+i+', compareMax'+i+', minOut'+i+', clk);\n\n';
	*/
	io = new IOCodeGenerator()
	
	io.addIWire(['negDataIn','opb'],i,32)
	io.addOWire('addOutput',i,32) 
	//io.addOWire('control',i,8) 	
	// comparators = "fpu_add adder"+i+"(.clk(clk),.opa(negDataIn"+i+"),.opb(opb"+i+"),.control(control"+i+"),.out(addOutput"+i+");\n\n" 	  
	return io.getCode()// +comparators
}

function generateComparator(n){
	var s = '';
	var comparators = '';
 	var ConnectorStateMachine = '';
	var endMem = '';
	var io_wires = ''
	for (var i = 0; i <n; i++) {
		comparators += generateComparatorCode(i)
			
	}

	writeConfigFile(comparators)

	// writeConfigFile(io_wires+comparators+endMem)
}
generateComparator(2)




module.exports = IOCodeGenerator;
