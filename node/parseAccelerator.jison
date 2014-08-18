
/* description: Parses end executes mathematical expressions. */
/*

	identifiers_r "STRING" ';' 
	identifiers_r "STRING" ',' "STRING" ';'  {  }
	| "STRING" ';' {verilogModuleCompiler.addIdentifier($1)}

	*/
/* lexical grammar */


%{
	var ModuleHandlerFile = require('./ModuleHandler');
	var ModuleHandler = ModuleHandlerFile.ModuleHandler;
	var Module = ModuleHandlerFile.Module;
	var NameIO = ModuleHandlerFile.NameIO;
	var ContinousAssign = ModuleHandlerFile.ContinousAssign;
	var AritOp = ModuleHandlerFile.AritOp;
	var LogicOp = ModuleHandlerFile.LogicOp;
	var NotOp = ModuleHandlerFile.NotOp;
	var NegOP = ModuleHandlerFile.NegOP;
	var ArrayIndices = ModuleHandlerFile.ArrayIndices;
	var Expression = ModuleHandlerFile.Expression;
	var ModuleInstance = ModuleHandlerFile.ModuleInstance;
	var ListModuleIOWires = ModuleHandlerFile.ListModuleIOWires;
	// var Module = ModuleHandlerFile.module;
%}
%lex

%s comment
%%

\/\/.* {}
[ \t]         ;
'=='|'&&'			{  return yytext;} // [(==)(!=)(<=)]
[\[\]\(\);,:\.=?!\+\-]   	{ return yytext[0];}
module          	{ return 'MODULE'; }
assign 				{ /*ModuleHandler.setStartStatementLine();*/ return 'ASSIGN'; }
input       		{ return 'INPUT'; }
output      		{ return 'OUTPUT'; }
wire        		{ return 'WIRE'; }
reg         		{ return 'REG'; }
endmodule			{ return 'endmodule'}
type           		{ return 'TYPE'; }
end            		{ return 'END'; }
[a-zA-Z_]+([0-9]*[a-zA-Z_]*)*    	{ /*console.log('string');*/ return 'STRING'}
[0-9]+\.[0-9]+  	{ return 'FLOAT'; }
[0-9]+          	{ /*console.log('number');*/ return 'INT'; }
			
/t        {console.log("comentario!!!\n");  this.begin('comment');}
\n            ModuleHandler.incLine();
<<EOF>>  	{return 'eof';}
.           {console.log("Error: not Recognized: '%s'\n",yytext ); return 'INVALID';}

<comment>/t     {this.begin('INITIAL');console.log("Termino Comments");}
<comment>\n        ModuleHandler.incLine();
<comment>. 		  {console.log("Estoy comment");}

/*

module pipeLineAcceleratorQS( f );



	wire [32:3] clk,a,b,c,q,w;
	input wire t,rw,e;
	reg m;
	fpu_add adder(
		.clk(clk),
		.opa(negDataIn),
		.opb(opb), 
		.control(x1), 
		.out(addOutput)
	);


	

endmodule



*/




/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left '==' '&&'
%left NEG     /* negation--unary minus */
%left NOT     /* negation--unary minus */
// %right '!'
%right '%'
%left UMINUS

%start verilogModule

%% /* language grammar */

test:
	INT eof
	| STRING eof
	;

verilogModule:
	moduleHeader moduleBody 'endmodule' 'eof' { return ModuleHandler;}
	;


moduleHeader:
    "MODULE" "STRING" "(" ")" ";" { ModuleHandler.addModule($2);console.log('Module ',$2)}
	| "MODULE" "STRING" "(" names ")" ";" { ModuleHandler.addModule($2,$4);console.log('Module ',$2,' anmes: ',$4)}
    ;

moduleBody:
	declarations assignStatements dataPaths
	| declarations dataPaths
	;

dataPaths:
	dataPathT 
	| %empty
	;
dataPathT:
	dataPathT dataPath {ModuleHandler.setStartStatementLine();} // record where does the datapath starts
	| dataPath 			{ModuleHandler.setStartStatementLine();}
	;
 dataPath:
 	"STRING" "STRING" '(' names ')' ';' { $$ = ModuleHandler.addModuleInstance( new ModuleInstance($1, new ListModuleIOWires($4)  )); }
 	| "STRING" "STRING" '(' namesWithNameIO ')' ';' {$$ = ModuleHandler.addModuleInstance(new ModuleInstance($1, new ListModuleIOWires($4)  )); }
 	| "STRING" "STRING" '(' ')' ';'
 	;


 namesWithNameIO:
 	namesWithNameIO ',' '.' STRING '(' lval ')' {  var kunt = ($1); kunt.push(new NameIO($4,$6)) }
 	| '.' STRING '(' lval ')' {  $$ =[new NameIO($2,$4)] }
 	;

assignStatements:
	assignStatements assignStatement 	{ ModuleHandler.setStartStatementLine();} // record where does the assigment start
	| assignStatement 					{ModuleHandler.setStartStatementLine();}
	;
assignStatement:
	"ASSIGN" lval '=' rvalEx ';' { ModuleHandler.addAssign($2,$4);  }
	;

lval:
	"STRING" 			{$$ = new Expression({identifier:ModuleHandler.getIdentifier($1),index:undefined});}
	| "STRING" subArray {$$ = new Expression({identifier:ModuleHandler.getIdentifier($1),index:$2});}
	;

rvalEx :
	expression 				
	| expression '?' expression ':' expression 	{$$ = new ContinousAssign($1,$3,$5);}//{$$ = {type:'?',ops:[$1,$3,$5]};}
	;


/*
expression:
	'(' expression ')' {$$ = $2}
	| expression opArit terminalVal {{$$ = $3}}

	| terminalVal
	;
	*/
expression:
 	terminalVal
 	| expression '+' expression {$$ = new AritOp($2,$1,$3)}
 	| expression '-' expression {$$ = new AritOp($2,$1,$3)}
 	| expression '==' expression {$$ = new LogicOp($2,$1,$3)}
 	| expression '&&' expression {$$ = new LogicOp($2,$1,$3)}
 	| '(' expression ')' {$$ = $2}
 	| '!' expression %prec NOT {$$ = new NotOp($2);}
 	| '-' expression %prec NEG {$$ = new NegOP($2);}
	;
/*
terminalExp:
	terminalVal
	| terminalVal opArit terminalExp
	;
*/

/*
rval:
	rval opLog terminalVal 	{$$ = new LogicOp($2,$1,$3);}	//	{$$ = {type:$2,ops:[$1,$3]};}
	// | '!' terminalVal  	{$$ = new Negator($2);}
	// | rval opArit terminalVal 	{$$ = new AritOp($2,$1,$3);}
	| '(' rval ')'	{$$=$2;}
	| '!' '(' rval ')'	{$$ = new Negator($3);}
//	| '!' terminalVal  {$$ = new Negator($2);}
	| terminalVal 
	;
*/

/*	
rval:
	'!' rvaln {$$ = new Negator($2);}
	| rvaln
	;
*/
terminalVal:
	lval		{$$ = $1;}   // lval is already an expression
	| constant	{$$ = Expression.constant($1);}
	// | '!' lval
	// | '!' constant {$$=parseInt($1)}
	;

/*
opArit:
	'+'
	| '-'
	;

opLog:
	'&&'
	| '=='
	;

*/

constant:
	'INT' {$$ = parseInt($1)}
	;


declarations:
	declaration {ModuleHandler.setStartStatementLine();}
	| %empty
	;

declaration:
	declaration type identifiers {var ident = $3; ident.type = $2;  ModuleHandler.addIdentifier(ident); }// types.push('REG');  ModuleHandler.addIdentifier(ident);
	| type identifiers 		  {var ident = $2; ident.type =  $1;  ModuleHandler.addIdentifier(ident); }
	; 
type:
	"REG" {$$ = ['reg']}
	| 'WIRE' {$$ = ['wire']}
	| 'INPUT' {$$ = ['input']}
	| 'OUTPUT' {$$ = ['output']}
	| 'INPUT' 'WIRE' {$$ = ['input','wire']}
	| 'OUTPUT' 'REG' {$$ = ['output','reg']}
	;
datapath:
	'eof'
	;
identifiers:
	size identifiers_r 	{ $$ = {size:$1,identifiers:$2,type:undefined};}// console.log('size',$1,'identifiers',$2) }// verilogModuleCompiler.setCurrentIdentifierSize($1);  verilogModuleCompiler.setCurrentIdentifierSize(Number($1))}
	| identifiers_r 	{ $$ = {size: new ArrayIndices([1]),identifiers:$1,type:undefined};} // console.log('size',1,'identifiers',$1) }// verilogModuleCompiler.setCurrentIdentifierSize(1)}
	;

identifiers_r:
	names ',' "STRING" ';' { var kunt = $1; kunt.push($3);   }
	| "STRING" ';' { $$=[$1]; }
	;

names:
	names ',' "STRING" {  var kunt = $1; kunt.push($3); $$ = kunt; }
	| "STRING" { $$ = [$1] }
	;

subArray:
	'[' INT ']'  				{ $$ = new ArrayIndices([parseInt($2)]); }
	| '[' INT ':' INT']'		{ $$ = new ArrayIndices([ parseInt($2),parseInt($4)]); }
	;

size:
	'[' INT ':' INT']'		{ $$ = new ArrayIndices([parseInt($2),parseInt($4)]); }
	;
