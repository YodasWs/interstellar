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
		if (!(color instanceof Array)) {
			throw new TypeError('Color must be an array of length 3 or 4');
		}
		if (color.length === 3) {
			color.push(1);
		}
		if (color.length !== 4) {
			throw new TypeError('Color must be an array of length 3 or 4');
		}

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
			}
			return this;
		},

		rotate(...θ) {
			this.rotation = matrix.rotation(...θ);
			this.renderedPoints = [];
		},

		rotateTo(...point) {
			this.rotation = matrix.rotateTo(...point);
			this.renderedPoints = [];
		},

		rotateAbout(θ, ...vector) {
			this.rotation = matrix.rotateAbout(θ, ...vector);
			this.renderedPoints = [];
		},

		translate(x, y, z) {
			this.translation = [x, y, z];
			this.renderedPoints = [];
		},
	};

	function Square({
		x,
		y,
		width,
		height,
		color,
	}) {
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

	function Circle({
		r,
		thickness,
		color,
		n = 80,
	}) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_STRIP;

		let i = 0;
		for (let θ=0; θ<360; θ+=360/n) {
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

	function Disc({
		r,
		color,
		n = 80,
	}) {
		Shape.call(this, color);
		this.points = [[0,0,0]];
		this.indices = [0];
		this.normals = [[0,0,1]];

		this.drawType = gl.TRIANGLE_FAN;

		let inward = true;

		let i = 0;
		for (let θ=0; θ<360; θ+=360/n) {
			this.points.push([
				r * Math.cos(θ * Math.PI / 180),
				r * Math.sin(θ * Math.PI / 180),
				0,
			]);
			this.normals.push([
				-1 * Math.cos(θ * Math.PI / 180 + (inward ? 0 : Math.PI)),
				-1 * Math.sin(θ * Math.PI / 180 + (inward ? 0 : Math.PI)),
				0.5,
			]);
			this.indices.push(++i);
		}
		this.indices.push(1);
	}
	Disc.prototype = {
		__proto__: Shape.prototype,
		constructor: Disc,
	};

	function Ring({
		r,
		thickness,
		color,
		n = 80,
		inward = false,
	}) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_STRIP;

		let i = 0;
		for (let θ=0; θ<360; θ+=360/n) {
			for (let k=0; k<2; k++) {
				this.points.push([
					r * Math.cos(θ * Math.PI / 180),
					r * Math.sin(θ * Math.PI / 180),
					(-1) ** (k % 2) * thickness,
				]);
				this.indices.push(i++);
				this.normals.push([
					Math.cos(θ * Math.PI / 180 + (inward ? 0 : Math.PI)),
					Math.sin(θ * Math.PI / 180 + (inward ? 0 : Math.PI)),
					0,
				]);
			}
		}
		this.indices.push(0, 1);
	}
	Ring.prototype = {
		__proto__: Shape.prototype,
		constructor: Ring,
	};

	function Cone({
		r,
		height,
		color,
		inward = false,
		n = 80,
	}) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_FAN;
		this.points = [[0, 0, height]];
		this.normals = [[0, 0, inward ? 1 : -1]];
		this.indices = [0];

		let i = 0;
		for (let θ=0; θ<360; θ+=360/n) {
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

	function Sphere({
		r,
		color,
		n = 55,
	}) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_STRIP;
		this.indices = [];
		this.normals = [];
		this.points = [];

		let i = 0;
		for (let α=0; α<=180; α+=180/n) {
			let j = 0;
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
	}
	Sphere.prototype = {
		__proto__: Shape.prototype,
		constructor: Sphere,
	};

	function Tube({
		r,
		l,
		color,
		n = 55,
		inward = false,
	}) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_STRIP;
		this.indices = [];
		this.normals = [];
		this.points = [];

		let i = 0;
		for (let α=0; α<=360; α+=360/n) {
			this.points.push([
				r * Math.sin(α * Math.PI / 180),
				r * Math.cos(α * Math.PI / 180),
				0,
			]);
			this.points.push([
				r * Math.sin(α * Math.PI / 180),
				r * Math.cos(α * Math.PI / 180),
				l,
			]);
			[0, 1].forEach(() => {
				this.normals.push([
					(inward ? -1 : 1) * Math.sin(α * Math.PI / 180),
					(inward ? -1 : 1) * Math.cos(α * Math.PI / 180),
					0,
				]);
			});
			this.indices.push(i++, i++);
		}
		this.indices.push(0, 1);
	}
	Tube.prototype = {
		__proto__: Shape.prototype,
		constructor: Tube,
	};

	return {
		Circle,
		Sphere,
		Square,
		Cone,
		Disc,
		Ring,
		Tube,

		addShapes(...shape) {
			shapes.push(...shape)
		},

		draw(now) {
			WebGL.rotateCamera(
				45,
				(now / 50) % 360,
				0,
			);
			const bufferData = [];
			shapes.forEach((shape) => {
				bufferData.push(shape.render());
			});

			WebGL.drawScene(bufferData);
			requestAnimationFrame(gfx.draw);
		},
	};
})();

WebGL.setAmbientLight([0.5, 0.5, 0.5]);
WebGL.setSpotlightColor([1.0, 1.0, 1.0]);
WebGL.rotateSpotlight(0, 90, 0);

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

const multiplier = 40;
const center = [];
const pole = [];

const galaxy = require('./galaxy.json');
galaxy.forEach((point, i) => {
	const [α, δ, d] = point.α && point.δ ? [
		(point.α[0] + point.α[1] / 60 + point.α[2] / 60 / 60) / 12 * Math.PI,
		(point.δ[0] + point.δ[1] / 60 + point.δ[2] / 60 / 60) / 180 * Math.PI,
		point.d * multiplier,
	] : [null, null, null];

	switch (point.type) {
		case 'star': {
			const star = new gfx.Sphere({
				r: 5,
				color: [
					ff / ff,
					ff / ff,
					0 / ff,
				],
				n: 3,
			});
			star.translate(
				d * Math.cos(δ) * Math.cos(α),
				d * Math.cos(δ) * Math.sin(α),
				d * Math.sin(δ),
			);
			gfx.addShapes(star);
			return;
		}

		case 'center': {
			const ray = new gfx.Tube({
				r: 1,
				l: point.d,
				color: [0, 1, 0, 1],
				n: 4,
			});
			center.push(
				(point.α[0] + point.α[1] / 60 + point.α[2] / 60 / 60) / 12 * 180,
				point.δ[0] + point.δ[1] / 60 + point.δ[2] / 60 / 60,
				0,
			);
			ray.rotate(...center);
			gfx.addShapes(ray);
			return;
		}

		case 'pole': {
			const ray = new gfx.Tube({
				r: 1,
				l: point.d,
				color: [1, 1, 0, 1],
				n: 4,
			});
			pole.push(
				(point.α[0] + point.α[1] / 60 + point.α[2] / 60 / 60) / 12 * 180,
				point.δ[0] + point.δ[1] / 60 + point.δ[2] / 60 / 60,
				0,
			);
			ray.rotate(...pole);
			gfx.addShapes(ray);
			return;
		}

	}
});

const planeColor = [
	0.0,//Number.parseInt('2e', 16) / ff,
	0.0,//Number.parseInt('8b', 16) / ff,
	0.0,//Number.parseInt('57', 16) / ff,
	0.9,
];
const max = 20;

const halo = new gfx.Disc({
	r: max * multiplier,
	color: planeColor,
	n: 40,
});
gfx.addShapes(halo);

const ring = new gfx.Ring({
	r: max * multiplier + 1,
	thickness: 10,
	color: planeColor,
	inward: false,
	n: 80,
});
gfx.addShapes(ring);

// Vector to Center
const c = matrix.flatten(matrix.multiply(
	matrix.rotation(...center),
	matrix.form2dCol([0, 0, 1]),
));
// Vector to Pole
const p = matrix.flatten(matrix.multiply(
	matrix.rotation(...pole),
	matrix.form2dCol([0, 0, 1]),
));
// Cross Product of Center × Pole, this is on Galactic Plane
const cp = matrix.crossProduct(c, p);
// Cross Product of Center × cp, this is Normal to Galactic Plane
const n = matrix.crossProduct(c, cp);
// Rotate onto Galactic Plane
halo.rotateTo(...n);
ring.rotateTo(...n);

(() => {
	const canvas = document.querySelector('canvas');

	// If we don't have a GL context, give up now
	if (!canvas.getContext('webgl')) {
		console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	WebGL.init(canvas, [0, 0, 0, 1]);

	// Draw the scene repeatedly
	requestAnimationFrame(gfx.draw);
})();
});
