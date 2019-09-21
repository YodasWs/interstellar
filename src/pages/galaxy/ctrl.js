yodasws.page('pageGalaxy').setRoute({
	template: 'pages/galaxy/galaxy.html',
	route: '/galaxy/',
}).on('load', () => {

const WebGL = require('./../../js/webgl.js');
const matrix = require('./../../js/matrix.js');

const gfx = (function() {
	const canvas = document.querySelector('canvas');
	const gl = canvas.getContext('webgl');

	const renderShapes = [];
	const shapes = [];

	function Shape(color) {
		this.color = color;
		this.rotation = matrix.identity(3);
		this.translation = new Array(3).fill(0);
		this.renderedNormals = [];
		this.renderedPoints = [];
		this.pointColors = [];
		this.indices = [];
		this.normals = [];
		this.points = [];
	}

	Shape.prototype = {
		render() {
			// Only recalculate if necessary
			if (this.renderedPoints.length === 0 || this.renderedNormals.length === 0 || this.pointColors.length === 0) {
				this.renderedNormals = [];
				this.renderedPoints = [];
				this.pointColors = [];

				const stdNormal = matrix.multiply(
					this.rotation,
					matrix.form2dCol([0, 0, 1]),
				);

				// Rotate and translate points from xy-plane into 3D space
				this.points.forEach((point, i) => {
					this.pointColors.push(this.color);
					if (this.normals.length === 0) {
						this.renderedNormals.push(stdNormal);
					} else {
						this.renderedNormals.push(matrix.multiply(
							this.rotation,
							matrix.form2dCol(this.normals[i] || [0, 0, 1]),
						));
					}
					this.renderedPoints.push(
						matrix.multiply(
								matrix.add(
								matrix.multiply(
									this.rotation,
									matrix.form2dCol(point),
								),
								matrix.form2dCol(this.translation),
							),
							1 / canvas.width / 5,
						),
					);
				});
				console.log(
					'Sam, numbers:\n',
					this.pointColors.length, 'colors,\n',
					this.renderedNormals.length, 'normals,\n',
					this.renderedPoints.length, 'points',
				);
			}
			return this;
		},

		rotate(yaw, pitch, roll) {
			yaw *= Math.PI / 180;
			pitch *= Math.PI / 180;
			roll *= Math.PI / 180;
			const x = [
				[1, 0, 0],
				[0, Math.cos(roll), Math.sin(roll)],
				[0, -Math.sin(roll), Math.cos(roll)],
			];
			const y = [
				[Math.cos(pitch), 0, Math.sin(pitch)],
				[0, 1, 0],
				[-Math.sin(pitch), 0, Math.cos(pitch)],
			];
			const z = [
				[Math.cos(yaw), Math.sin(yaw), 0],
				[-Math.sin(yaw), Math.cos(yaw), 0],
				[0, 0, 1],
			];
			this.rotation = matrix.multiply(
				matrix.multiply(z, y),
				x,
			);
			this.renderedPoints = [];
		},

		translate(x, y, z) {
			this.translation = [x, y, z];
			this.renderedPoints = [];
		},
	};

	function Square(x, y, width, height, color) {
		Shape.call(this, color);
		this.points = [
			[x, y, 0],
			[x, y + height, 0],
			[x + height, y + height, 0],
			[x + height, y, 0],
		];
		this.indices = [1, 0, 2, 3];

		this.drawType = gl.TRIANGLE_STRIP;
	}
	Square.prototype = {
		__proto__: Shape.prototype,
		constructor: Square,
	};

	function Circle(r, thickness, color) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_STRIP;

		let i = 0;
		for (let θ=0; θ<360; θ+=360/80) {
			this.points.push([
				(r + (-1) ** (i % 2) * thickness) * Math.cos(θ * Math.PI / 180),
				(r + (-1) ** (i % 2) * thickness) * Math.sin(θ * Math.PI / 180),
				0,
			]);
			this.indices.push(i++);
		}
		this.indices.push(0, 1);
	}
	Circle.prototype = {
		__proto__: Shape.prototype,
		constructor: Circle,
	};

	function Disc(r, color) {
		Shape.call(this, color);
		this.points = [[0,0,0]];
		this.indices = [0];

		this.drawType = gl.TRIANGLE_FAN;

		let i = 0;
		for (let θ=0; θ<360; θ+=360/80) {
			this.points.push([
				r * Math.cos(θ * Math.PI / 180),
				r * Math.sin(θ * Math.PI / 180),
				0,
			]);
			this.indices.push(++i);
		}
		this.indices.push(1);
	}
	Disc.prototype = {
		__proto__: Shape.prototype,
		constructor: Disc,
	};

	function Ring(r, thickness, color, inward = false) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_STRIP;

		let i = 0;
		for (let θ=0; θ<360; θ+=360/80) {
			this.points.push([
				r * Math.cos(θ * Math.PI / 180),
				r * Math.sin(θ * Math.PI / 180),
				(-1) ** (i % 2) * thickness,
			]);
			this.normals.push([
				Math.cos(θ * Math.PI / 180 + (inward ? 0 : Math.PI)),
				Math.sin(θ * Math.PI / 180 + (inward ? 0 : Math.PI)),
				0,
			]);
			this.indices.push(i++);
		}
		this.indices.push(0, 1);
	}
	Ring.prototype = {
		__proto__: Shape.prototype,
		constructor: Ring,
	};

	function Cone(r, height, color, inward = false) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_FAN;
		this.points = [[0, 0, height]];
		this.normals = [[0, 0, inward ? 1 : -1]];
		this.indices = [0];

		let i = 0;
		for (let θ=0; θ<360; θ+=360/80) {
			this.points.push([
				r * Math.cos(θ * Math.PI / 180),
				r * Math.sin(θ * Math.PI / 180),
				0,
			]);
			this.normals.push([
				Math.cos(θ * Math.PI / 180 + (inward ? 0 : Math.PI)),
				Math.sin(θ * Math.PI / 180 + (inward ? 0 : Math.PI)),
				0,
			]);
			this.indices.push(++i);
		}
		this.indices.push(1);
	}
	Cone.prototype = {
		__proto__: Shape.prototype,
		constructor: Cone,
	};

	function Sphere(r, color) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_STRIP;
		this.indices = [];
		this.normals = [];
		this.points = [];

		const n = 55;
		let i = 0;
		for (let α=0; α<=180; α+=180/n) {
			let j = 0;
			const k = this.points.length;
			const m = α === 0 || α === 180 ? 1 : n;
			for (let θ=0; θ<360; θ+=360/m) {
				if (α !== 180 || (α === 180 && θ === 0)) {
					this.points.push([
						r * Math.sin(α * Math.PI / 180) * Math.cos(θ * Math.PI / 180),
						r * Math.sin(α * Math.PI / 180) * Math.sin(θ * Math.PI / 180),
						r * Math.cos(α * Math.PI / 180),
					]);
					this.normals.push([
						Math.sin(α * Math.PI / 180) * Math.cos(θ * Math.PI / 180),
						Math.sin(α * Math.PI / 180) * Math.sin(θ * Math.PI / 180),
						Math.cos(α * Math.PI / 180),
					]);
				}
				this.indices.push(i);
				this.indices.push(Math.max(++i - m, 0));
				if (α === 180) {
					for (let l = 1; l<n+2; l++) {
						this.indices.push(this.points.length - l);
						this.indices.push(this.points.length - 1);
					}
				}
			}
		}
		console.log('Sphere:', this.indices.length, 'indices,', this.points.length, 'points');
	}
	Sphere.prototype = {
		__proto__: Shape.prototype,
		constructor: Sphere,
	};

	return {
		Circle,
		Sphere,
		Square,
		Cone,
		Disc,
		Ring,

		addShapes(...shape) {
			shapes.push(...shape)
		},

		draw(now) {
			now *= Number.parseInt(document.getElementById('speed').value, 10) / 100;
			const n = now % 360;

			const bufferData = [];
			shapes.forEach((shape) => {
				bufferData.push(shape.render(n));
			});

			WebGL.drawScene(bufferData);
			requestAnimationFrame(gfx.draw);
		},
	};
})();

function rotateCamera() {
	WebGL.rotateCamera(
		Number.parseInt(document.getElementById('radx').value, 10),
		Number.parseInt(document.getElementById('rady').value, 10),
		Number.parseInt(document.getElementById('radz').value, 10),
	);
}
document.getElementById('radx').addEventListener('input', rotateCamera);
document.getElementById('rady').addEventListener('input', rotateCamera);
document.getElementById('radz').addEventListener('input', rotateCamera);
rotateCamera();

function rotateLight() {
	WebGL.rotateLight(
		Number.parseInt(document.getElementById('lightx').value, 10),
		Number.parseInt(document.getElementById('lighty').value, 10),
		Number.parseInt(document.getElementById('lightz').value, 10),
	);
}
document.getElementById('lightx').addEventListener('input', rotateLight);
document.getElementById('lighty').addEventListener('input', rotateLight);
document.getElementById('lightz').addEventListener('input', rotateLight);
rotateLight();

WebGL.setAmbientLight([0.6, 0.6, 0.6]);
WebGL.setSpotlightColor([0, 0, 0]);

function zoom() {
	WebGL.zoom(
		Number.parseInt(document.getElementById('zoom').value, 10),
	);
}
document.getElementById('zoom').addEventListener('input', zoom);
zoom();

function showNumbers(e) {
	e.target.closest('label').querySelector('output').innerText = e.target.value;
}
document.querySelectorAll('input[type="range"]').forEach((input) => {
	input.addEventListener('input', showNumbers);
});

function chooseCamera(e) {
	if (!e.target.checked) return;
	document.querySelectorAll(`[data-camera]`).forEach((section) => {
		if (section.dataset.camera === e.target.value) {
			section.removeAttribute('hidden');
		} else {
			section.setAttribute('hidden', '');
		}
	});
	switch (e.target.value) {
		case 'origin':
			rotateCamera();
			break;
		case 'surface':
			setLatitude();
			break;
	}
}
document.querySelectorAll('[name="camera"]').forEach((section) => {
	section.addEventListener('input', chooseCamera);
});

function setLatitude(now) {
	const α = (now / 5) % 360;
	const β = 0; // (now / 10) % 180 - 90;
	const c = (radii.scale + 5) / 640 / 5;
	WebGL.lookAt(
		[
			c * Math.sin(β * Math.PI / 180),
			c * Math.cos(β * Math.PI / 180),
			0,
		],
		[
			Math.cos(α * Math.PI / 180),
			0,
			Math.sin(α * Math.PI / 180),
		],
		[0, Math.sin(β * Math.PI / 180), Math.cos(β * Math.PI / 180)],
	);
}
document.getElementById('lat').addEventListener('input', setLatitude);

const a0 = 10 * 16 +  0;
const f0 = 15 * 16 +  0;
const ff = 15 * 16 + 15;

const colors = [
	[ff / ff, a0 / ff, ff / ff, 1], // magenta
	[a0 / ff, ff / ff, ff / ff, 1], // cyan
	[ff / ff, ff / ff, a0 / ff, 1], // yellow
	[a0 / ff, ff / ff, a0 / ff, 1], // green
	[ff / ff, a0 / ff, a0 / ff, 1], // red
	[a0 / ff, a0 / ff, ff / ff, 1], // blue
];

const galaxy = require('./galaxy.json');

const sol = new gfx.Sphere(100, [
	ff / ff,
	ff / ff,
	ff / ff,
]);
gfx.addShapes(sol);
sol.translate(0, 0, 0);

/*
const multiplier = 100;

const halo = new Array(2).fill(0).map(() => new gfx.Disc(10 * multiplier, [
	Number.parseInt('2e', 16) / ff,
	Number.parseInt('8b', 16) / ff,
	Number.parseInt('57', 16) / ff,
	1.0,
]));
halo[0].translate(0, 0, 0.01);
halo[1].translate(0, 0, -0.01);
halo[1].rotate(0, 180, 0);
gfx.addShapes(...halo);

galaxy.forEach((star, i) => {
	if (i > 2) return;
	const sol = new gfx.Sphere(20, [
		ff / ff,
		ff / ff,
		ff / ff,
	]);
	gfx.addShapes(sol);
	const α = (galaxy[i].α[0] + galaxy[i].α[1] / 60 + galaxy[i].α[2] / 60 / 60) / 180 * Math.PI;
	const δ = (galaxy[i].δ[0] + galaxy[i].δ[1] / 60 + galaxy[i].δ[2] / 60 / 60) / 180 * Math.PI;
	const d = galaxy[i].d * multiplier;
console.log('Sam, α:', α);
console.log('Sam, δ:', δ);
	const x = d * Math.sin(δ) * Math.cos(α);
	const y = d * Math.sin(δ) * Math.sin(α);
	const z = d * Math.cos(δ);
	sol.translate(x, y, z);
});

/*
const radii = {
	scale: 200,
	moonScale: 5,
	moonOrbit: 385 * 1000,
	earth: 6371,
	moon: 1731.1,
};
const moonDistance = radii.scale * radii.moonScale * 1.5;

const earth = new gfx.Sphere(radii.scale, colors[3]);
gfx.addShapes(earth);

const moon = new gfx.Sphere(radii.scale * radii.moonScale / 8, colors[5]);
gfx.addShapes(moon);
moon.translate(moonDistance, 0, 0);

const moonOrbit = new Array(2).fill(0).map((f, i) => new gfx[i < 2 ? 'Ring' : 'Circle'](
	moonDistance + (-1) ** (i % 2) * 0.01,
	radii.scale / 10,
	colors[0],
	!i,
));
gfx.addShapes(...moonOrbit);
moonOrbit.forEach((c, i) => {
	// c.rotate(0, 36, 0);
});

/*
const cube = new Array(6).fill(0).map((f, i) => new gfx.Square(
	-100,
	-100,
	200,
	200,
	colors[i],
));

cube.forEach((face, i) => {
	const θ = new Array(3).fill(0);
	θ[i % 3] = 90;

	switch (i) {
		case 1:
		case 2:
		case 3:
			θ[1] += 180;
			break;
		case 2:
		case 5:
			θ[2] += 180;
	}
	face.rotate(...θ);

	const translation = new Array(3).fill(0);
	translation[(i + 2) % 3] = (-1) ** (i % 2) * 100;
	face.translate(...translation);
});
gfx.addShapes(...cube);
const cone = new Array(2).fill(0).map((z, i) => new gfx.Cone(250, 90, colors[i * 3], !i));
cone.forEach((c, i) => {
	c.rotate(0, 0, 0);
	c.translate(0, 0, (-1) ** (i % 2) * 10);
});
gfx.addShapes(...cone);
/**/

/*
const halo = new Array(2).fill(0).map((z, i) => new gfx.Ring(250 + (-1) ** (i % 2) * 0.01, 10, [
	Number.parseInt('2e', 16) / ff,
	Number.parseInt('8b', 16) / ff,
	Number.parseInt('57', 16) / ff,
	1.0,
], !i));
gfx.addShapes(...halo);
/**/

/*
const halo = new Array(2).fill(0).map(() => new gfx.Circle(250, 10, [
	Number.parseInt('2e', 16) / ff,
	Number.parseInt('8b', 16) / ff,
	Number.parseInt('57', 16) / ff,
	1.0,
]));
halo[0].translate(0, 0, 0.01);
halo[1].translate(0, 0, -0.01);
halo[1].rotate(0, 180, 0);
gfx.addShapes(...halo);

[0, 1, 2].forEach((i) => {
	const halo = new Array(2).fill(0).map(() => new gfx.Disc(250, [
		Number.parseInt('2e', 16) / ff,
		Number.parseInt('8b', 16) / ff,
		Number.parseInt('57', 16) / ff,
		1.0,
	]));

	switch (i) {
		case 0:
			halo[0].translate(0, 0, 0.01);
			halo[1].translate(0, 0, -0.01);
			halo[1].rotate(0, 180, 0);
			break;
		case 1:
			halo[0].translate(0.01, 0, 0);
			halo[1].translate(-0.01, 0, 0);
			halo[0].rotate(0, 90, 0);
			halo[1].rotate(0, 270, 0);
			break;
		case 2:
			halo[0].translate(0, 0.01, 0);
			halo[1].translate(0, -0.01, 0);
			halo[0].rotate(0, 0, 90);
			halo[1].rotate(0, 0, 270);
			break;
	}

	gfx.addShapes(...halo);
});
/**/

(() => {
	const canvas = document.querySelector('canvas');

	// If we don't have a GL context, give up now
	if (!canvas.getContext('webgl')) {
		console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	WebGL.init(canvas);

	// Draw the scene repeatedly
	requestAnimationFrame(gfx.draw);
})();
});
