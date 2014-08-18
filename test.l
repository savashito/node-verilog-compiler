%{
#include <iostream>
#include "test.tab.h"
using namespace std;
#define YY_DECL extern "C" int yylex()
int line_num = 1;
%}
%x comment
%%
[ \t]         ;
[\[\]\(\);,:]	{printf("vio %s\n", yytext); return yytext[0];}
module        	{ printf("vio %s\n", yytext); return MODULE; }
input 		{ printf("vio %s\n", yytext); return INPUT; }
output 		{ printf("vio %s\n", yytext); return OUTPUT; }
wire 		{ printf("vio %s\n", yytext); return WIRE; }
reg 		{ printf("vio %s\n", yytext); return REG; }

type           { printf("--> encontro tupo\n"); return TYPE; }
end            { return END; }
[0-9]+\.[0-9]+  {  yylval.fval = atof(yytext);return FLOAT; }
[0-9]+          {  yylval.fval = atoi(yytext);return INT; }
[a-zA-Z0-9_]+    { yylval.sval = strdup(yytext);return STRING; }
"//".* 	{printf("comentario\n");}
"/*" 		{BEGIN(comment);}
\n            line_num++;
.			{printf("Error: not Recognized: '%s'\n",yytext );}
<comment>{
	"/" 	{BEGIN(INITIAL);printf("Termino Comments");}
	. {printf("Estoy comment");}
}
%%
/*
main() {
	// lex through the input:
	yylex();
}

*/

/*
%{
#include <iostream>
#include "test.tab.h"
using namespace std;
#define YY_DECL extern "C" int yylex()
int line_num = 1;
%}
%%
[ \t]          ;
sNaZZle        { return SNAZZLE; }
type           { return TYPE; }
end            { return END; }
[0-9]+\.[0-9]+ { yylval.fval = atof(yytext); return FLOAT; }
[0-9]+         { yylval.ival = atoi(yytext); return INT; }
[a-zA-Z0-9]+   {
	// we have to copy because we can't rely on yytext not changing underneath us:
	yylval.sval = strdup(yytext);
	return STRING;
}
\n             return ENDL;
.              ;
%%
*/


