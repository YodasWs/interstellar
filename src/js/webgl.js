/***********************************************************************************/
// Forked from MDN's WebGL Tutorial
// https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample5/webgl-demo.js

const matrix = require('./matrix.js');
const programInfo = {
	uniformMatrices: {
		projection: {
			webglVar: 'uProjectionMatrix',
			type: 'uniformMatrix4fv',
			transpose: false,
			mat: [],
		},
		camera: {
			webglVar: 'uCameraMatrix',
			mat: matrix.flatten(matrix.identity(4)),
			type: 'uniformMatrix4fv',
			transpose: false,
		},
		normalMatrix: {
			webglVar: 'uNormalMatrix',
			mat: matrix.flatten(matrix.identity(4)),
			type: 'uniformMatrix4fv',
			transpose: false,
		},
		ambientLight: {
			webglVar: 'uAmbientLight',
			mat: [0.5, 0.5, 0.5],
			type: 'uniform3fv',
		},
		dLightMatrix: {
			webglVar: 'uLightMatrix',
			mat: matrix.flatten(matrix.identity(3)),
			type: 'uniformMatrix3fv',
			transpose: false,
		},
		dLightColor: {
			webglVar: 'uDLightColor',
			mat: [0.3, 0.7, 0.3],
			type: 'uniform3fv',
		},
	},
	uniformLocations: {},
};
let gl;

module.exports = (function() {
	let S = 5;

	const init = (canvas, bgColor=[1, 1, 1, 1]) => {
		gl = canvas.getContext('webgl');

		// Initialize a shader program; this is where all the lighting
		// for the vertices and so forth is established.
		const shaderProgram = initShaderProgram();

		// Collect all the info needed to use the shader program.
		programInfo.program = shaderProgram;

		// attribLocations are different for each vertex, they define each point to be rendered
		// TODO: Unify matrices and vectors into object and convert below to Object.entries().forEach()
		programInfo.attribLocations = {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			// Normal vector of plane tangent to object at this vertex
			vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
			vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
		};

		// Define uniform locations
		// These apply equally to every vertex
		// Defines camera positioning, perspective, and lighting
		Object.entries(programInfo.uniformMatrices).forEach(([key, obj]) => {
			programInfo.uniformLocations[key] = gl.getUniformLocation(shaderProgram, obj.webglVar);
		});

		// Set Drawing Options
		gl.clearColor(...bgColor);
		gl.clearDepth(1);

		// Depth
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		// gl.depthMask(false);

		// Blending
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.blendEquation(gl.FUNC_ADD);
		gl.disable(gl.CULL_FACE);
	};

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram() {
	// Vertex shader program
	const vsSource = `
		attribute vec4 aVertexPosition;
		attribute vec4 aVertexColor;
		uniform mat4 uProjectionMatrix;
		uniform mat4 uCameraMatrix;
		uniform mat4 uNormalMatrix;
		varying highp vec4 vColor;

		uniform mat3 uLightMatrix;
		varying highp vec3 vDirectionalVector;

		uniform vec3 uAmbientLight;
		varying highp vec3 vAmbientLight;

		uniform vec3 uDLightColor;
		varying highp vec3 vDLightColor;

		attribute vec3 aVertexNormal;
		varying highp vec3 vTransformedNormal;

		void main(void) {
			// Each Point's Projected Position
			gl_Position = uProjectionMatrix * uCameraMatrix * aVertexPosition;

			vColor = aVertexColor;
			vAmbientLight = uAmbientLight;
			vDLightColor = uDLightColor;

			// Undo Camera Rotation to keep Lighting in constant position
			vTransformedNormal = mat3(uNormalMatrix) * aVertexNormal;

			vDirectionalVector = normalize(uLightMatrix * vec3(0, 0, 1));
		}
	`;

	// Fragment shader program
	const fsSource = `
		varying highp vec3 vLighting;
		varying highp vec4 vColor;
		varying highp vec3 vTransformedNormal;
		varying highp vec3 vDirectionalVector;
		varying highp vec3 vAmbientLight;
		varying highp vec3 vDLightColor;

		void main(void) {
			// Directional Light
			highp float directional = max(dot(vTransformedNormal.xyz, vDirectionalVector), 0.0);
			// Apply Lighting on Vertex's Color
			highp vec3 vLighting = vAmbientLight + (vDLightColor * directional);
			gl_FragColor = vColor * vec4(vLighting, 1.0);
		}
	`;

	const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source, and compiles it.
//
function loadShader(type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object
	gl.shaderSource(shader, source);

	// Compile the shader program
	gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

//
// Draw the scene.
//
function drawScene(bufferData) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Projection
	// TODO: Move to point S is changed to save processing time
	// Zoom affects only X and Y values
	// TODO: Adjust Z using map [ Camera, Farthest ] => [ -1, 1 ]
	programInfo.uniformMatrices.projection.mat = (() => {
		return matrix.flatten([
			[S * gl.canvas.height / gl.canvas.width, 0, 0, 0],
			[0, S, 0, 0],
			[0, 0, -1, 0],
			[0, 0, 0, 1],
		]);
	})();

	bufferData.forEach((buffer) => {
		const buffers = {
			indices: gl.createBuffer(),
			normals: gl.createBuffer(),
		};

		[
			// Colors
			{
				array: buffer.pointColors,
				attrib: 'vertexColor',
				numBytes: 4,
			},
			// Vertices
			{
				array: buffer.renderedPoints,
				attrib: 'vertexPosition',
				numBytes: 3,
			},
			// Normals at Vertices
			{
				array: buffer.renderedNormals,
				attrib: 'vertexNormal',
				numBytes: 3,
			},
		].forEach((buf) => {
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(matrix.flatten(buf.array)), gl.STATIC_DRAW);
			gl.vertexAttribPointer(
				programInfo.attribLocations[buf.attrib],
				buf.numBytes,
				gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(programInfo.attribLocations[buf.attrib]);
		});

		// Set Indices Buffer
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buffer.indices), gl.STATIC_DRAW);

		// Tell WebGL to use our program when drawing
		gl.useProgram(programInfo.program);

		// Set Uniform Matrices
		Object.entries(programInfo.uniformMatrices).forEach(([key, obj]) => {
			gl[obj.type](...[
				programInfo.uniformLocations[key],
				obj.transpose,
				obj.mat,
			].filter(a => a !== undefined));
		});

		// Draw!
		gl.drawElements(buffer.drawType, buffer.indices.length, gl.UNSIGNED_SHORT, 0);
	});
}

//
// Rotate View
//
function rotateCamera(...θ) {
	programInfo.uniformMatrices.camera.mat = matrix.flatten([
		...matrix.axonometric(...θ).map(r => r.push(0) && r),
		[0, 0, 0, 1],
	]);

	// Undo Camera Rotation to keep Lighting in constant position
	programInfo.uniformMatrices.normalMatrix.mat = matrix.flatten(matrix.inverseTranspose(programInfo.uniformMatrices.camera.mat));
}

function lookAt(eye, center, up) {
	programInfo.uniformMatrices.normalMatrix.mat = matrix.flatten(matrix.lookAt(eye, center, up).rotation);
	programInfo.uniformMatrices.camera.mat = matrix.flatten(matrix.inverseTranspose(programInfo.uniformMatrices.normalMatrix.mat));
}

function setCameraMatrix(camera) {
	programInfo.uniformMatrices.camera.mat = matrix.flatten(camera);
	programInfo.uniformMatrices.normalMatrix.mat = matrix.flatten(matrix.inverseTranspose(camera));
}

function zoom(z) {
	S = 50 / z;
}

return {
	rotateCamera,
	setAmbientLight(color) {
		programInfo.uniformMatrices.ambientLight.mat = color;
	},
	setSpotlightColor(color) {
		programInfo.uniformMatrices.dLightColor.mat = color;
	},
	rotateSpotlight(...θ) {
		programInfo.uniformMatrices.dLightMatrix.mat = matrix.flatten(matrix.axonometric(...θ));
	},
	setCameraMatrix,
	drawScene,
	lookAt,
	init,
	zoom,
}

})();
