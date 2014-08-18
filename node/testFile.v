module pipeLineAcceleratorQS( f,test,jojo );

	input clk,ldMax,compareMax,getMax;
	wire clk,ldMax,compareMax,getMax;
	input wire[31:0] dataIn;
	// wire  [31:0] dataIn;
	output [31:0] minOut;
	wire [31:0] minOut;
	wire [31:0] negDataIn;
	wire bGreater;
	// Internal Registers
	reg [31:0] max,oldDataIn;
	// Wire assigments
	// flip the bit sign
	reg a,t,f,opb,c;
	reg clkg,x1_control,addOutput;
	
	assign a[4] = t ? f[5:3] :3;


	


	assign opb = c;
	


	assign opb = c;
	assign opb = (c+1)+(1+c+4);
	assign opb = (bGreater==1 && (4+4))?oldDataIn:max;
	assign opb = c-opb;
	// assign negDataIn = dataIn[31]?{0,dataIn[30:0]}:{1,dataIn[30:0]};
	

	fpu_add_ adder(
		.clk(clkg),
		.opa(negDataIn[3]),
		.opb(opb), 
		.control(x1_control), 
		.out(addOutput)
	);

	fpu_add adder(
		.clk(clkg),
		.opa(negDataIn),
		.opb(opb), 
		.control(x1_control), 
		.out(addOutput)
	);

	fpu_add adder(
		.clk(clkg),
		.opa(negDataIn),
		.opb(opb), 
		.control(x1_control), 
		.out(addOutput)
	);
	

endmodule