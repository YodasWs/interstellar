yodasws.page('pageGalaxy').setRoute({
	template: 'pages/galaxy/galaxy.html',
	route: '/galaxy/',
}).on('load', () => {

const WebGL = require('./../../js/webgl.js');
const matrix = require('./../../js/matrix.js');

const gfx = (function() {
	const canvas = document.querySelector('canvas');
	const gl = canvas.getContext('webgl');
	if (!gl) {
		console.error('No canvas context!');
		return;
	}

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
			return this;
		},

		rotateTo(px, py, pz) {
			this.rotation = matrix.rotateTo(px, py, pz, 3);
			this.renderedPoints = [];
			return this;
		},

		rotateAbout(θ, vx, vy, vz) {
			this.rotation = matrix.rotateAbout(θ, vx, vy, vz, 3);
			this.renderedPoints = [];
			return this;
		},

		translate(x, y, z) {
			this.translation = [x, y, z];
			this.renderedPoints = [];
			return this;
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

		Object.defineProperties(this, {
			// TODO: Use set function to recalculate points
			n: {
				value: n,
			},
			// TODO: Use set function to recalculate points
			r: {
				value: r,
			},
		});

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
		m = 1,
		n = 55,
		inward = false,
	}) {
		Shape.call(this, color);

		this.drawType = gl.TRIANGLE_STRIP;
		this.indices = [];
		this.normals = [];
		this.points = [];

		let j=0;
		for (let d=0; d<=l; d+=l/m) {
			let i = 0;
			for (let α=0; α<=360; α+=360/n) {
				this.points.push([
					r * Math.sin(α * Math.PI / 180),
					r * Math.cos(α * Math.PI / 180),
					d,
				]);
				this.normals.push([
					(inward ? -1 : 1) * Math.sin(α * Math.PI / 180),
					(inward ? -1 : 1) * Math.cos(α * Math.PI / 180),
					0,
				]);
				this.indices.push(j+i, n+i, j+i, n+i+j);
				i++;
			}
			j++;
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

		removeShapes(...shape) {
			shape.forEach((s) => {
				const i = shapes.indexOf(s);
				if (i === -1) {
					console.log('Shape not found');
					return;
				}
				console.log('Removing shape');
				shapes.splice(i, 1);
			});
		},

		draw(now) {
			const diff = now - start;

			if (true) {
				WebGL.setCameraMatrix(
					matrix.multiply(
						matrix.rotateAbout((-diff / 50) % 360, ...lookAt[view].rotateAbout, 4),
						lookAt[view].rotation,
					),
				);
				if (diff > 2000 && diff <= 10000) {
					gfx.removeShapes(sol);
					sol = new gfx.Sphere({
						color: sol.color,
						n: sol.n,
						r: sol.r + 1,
					});
					gfx.addShapes(sol);
					WebGL.zoom(diff / 200);
				}
			} else {
				WebGL.lookAt(
					matrix.flatten(matrix.multiply(
						matrix.rotateAbout((-diff / 50) % 360, ...lookAt[view].y),
						lookAt[view].z,
					)), // camera position
					[0, 0, 0], // center
					lookAt[view].y, // up
				);
			}

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

const a0 = Number.parseInt('a0', 16);
const f0 = Number.parseInt('f0', 16);
const ff = Number.parseInt('ff', 16);

const colors = [
	[ff / ff, a0 / ff, ff / ff, 1], // magenta
	[a0 / ff, ff / ff, ff / ff, 1], // cyan
	[ff / ff, ff / ff, a0 / ff, 1], // yellow
	[a0 / ff, ff / ff, a0 / ff, 1], // green
	[ff / ff, a0 / ff, a0 / ff, 1], // red
	[a0 / ff, a0 / ff, ff / ff, 1], // blue
];

function map(value, from, to) {
	return (value - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0];
}

// Convert B-V Color Index to RGB
function bvToColor(bv) {
	// Make sure bv is within its bounds [-0.4, 2]
	if (bv < -0.4) {
		bv = -0.4;
	} else if (bv > 2) {
		bv = 2;
	}

	// Color Constants
	const x00 = Number.parseInt('00', 16);
	const x52 = Number.parseInt('52', 16);
	const x9b = Number.parseInt('9b', 16);
	const xb2 = Number.parseInt('b2', 16);
	const xff = Number.parseInt('ff', 16);

	let g = xff;
	const greenShift = [0.4, 0.70];
	if (bv <= greenShift[0]) {
		g = map(bv, [-0.4, greenShift[0]], [xb2, xff]);
	} else if (bv >= greenShift[1]) {
		g = map(bv, [greenShift[1], 2], [xff, x52]);
	}

	const redShift = 0.20;
	const blueShift = 0.1;

	const rgb = matrix.multiply([
		bv > redShift ? xff : map(bv, [-0.4, redShift], [x9b, xff]), // Red
		g, // Green
		bv < blueShift ? xff : map(bv, [blueShift, 2], [xff, x00]), // Blue
	], 1 / xff);
	return rgb;
}

const view = 'earth';
const lookAt = {
	galaxy: {
		rotate: [75, 0, 0],
		initEye: [0, 0, 1],
		center: [0, 0, 0],
	},
	earth: {
		rotate: [-45, 35, 0],
		camera: [1, 0, 0],
		upLine: [0, 0.00001, 1],
		rotateAbout: [0, 0, 1],
		initEye: [0, 0, 1],
		center: [0, 0, 0],
	},
};

const multiplier = 35;
const max = 20;
let sol;

const galaxy = require('./galaxy.json');
galaxy.forEach((point, i) => {
	const [α, δ] = point.α && point.δ ? [
		(point.α[0] + point.α[1] / 60 + point.α[2] / 60 / 60) / 12 * Math.PI,
		(point.δ[0] + point.δ[1] / 60 + point.δ[2] / 60 / 60) / 180 * Math.PI,
	] : [null, null, null];
	let d = point.d * multiplier;

	switch (point.type) {
		case 'star': {
			let r = 3;
			let color = [222 / ff, 184 / ff, 135 / ff]; // brown
			let n = point.d === 0 ? 5 : 3;
			if (point['b-v'] !== undefined) {
				if (typeof point['b-v'] === 'number') {
					color = bvToColor(point['b-v']);
					r = point.d === 0 ? 10 : 5;
				}
				if (point['b-v'] === 'red') {
					color = [1, 0, 0];
					r = 4;
				}
			}

			if (d / multiplier >= 16.5) {
				d = max * multiplier;
				n = 3;
				r = 2;
			}

			const star = new gfx.Sphere({
				color,
				n,
				r,
			});
			star.translate(
				d * Math.cos(δ) * Math.cos(α),
				d * Math.cos(δ) * Math.sin(α),
				d * Math.sin(δ),
			);
			sol = star;
			gfx.addShapes(star);
			return;
		}

		case 'center': {
			lookAt.galaxy.camera = [
				17 * multiplier * Math.cos(δ) * Math.cos(α),
				17 * multiplier * Math.cos(δ) * Math.sin(α),
				17 * multiplier * Math.sin(δ),
			];
			return;
		}

		case 'pole': {
			lookAt.galaxy.upLine = [
				17 * multiplier * Math.cos(δ) * Math.cos(α),
				17 * multiplier * Math.cos(δ) * Math.sin(α),
				17 * multiplier * Math.sin(δ),
			];
			return;
		}

	}
});

const planeColor = [
	0.0,//Number.parseInt('2e', 16) / ff,
	0.0,//Number.parseInt('8b', 16) / ff,
	0.0,//Number.parseInt('57', 16) / ff,
	0.75,
];

const halo = new gfx.Disc({
	r: max * multiplier,
	color: planeColor,
	n: 20,
});

const ring = new gfx.Ring({
	r: max * multiplier + 1,
	thickness: 10,
	color: planeColor,
	inward: false,
	n: 20,
});

// TODO: Translate everything to a new center point

Object.keys(lookAt).forEach((v) => {
	// Vector from Camera to Center
	lookAt[v].c = matrix.flatten(
		matrix.multiply(
			matrix.rotateTo(...lookAt[view].camera, 4),
			matrix.form2dCol([...lookAt[v].initEye, 1]),
		),
	).slice(0, 3);

	// Vector from Center pointing up-ish
	const p = matrix.flatten(
		matrix.multiply(
			matrix.rotateTo(...lookAt[v].upLine, 4),
			matrix.form2dCol([...lookAt[v].initEye, 1]),
		),
	).slice(0, 3);

	// Cross Product of c × p, this is on xy-Plane
	lookAt[v].cp = matrix.crossProduct(lookAt[v].c.slice(0, 3), p.slice(0, 3));
	// Cross Product of c × cp, this is Normal to xy-Plane
	lookAt[v].n = matrix.multiply(
		matrix.crossProduct(lookAt[v].c.slice(0, 3), lookAt[v].cp.slice(0, 3)),
		-1,
	);

	const u = matrix.multiply(
		matrix.rotateTo(...lookAt[v].c.slice(0, 3)),
		[0, 1, 0],
	);
	lookAt[v].rotation = matrix.multiply(
		matrix.axonometric(...lookAt[v].rotate, 4),
		matrix.multiply(
			matrix.rotateAbout(
				Math.acos(Math.abs(matrix.dotProduct(
					lookAt[v].n,
					u,
				)) / Math.hypot(...lookAt[v].n) / Math.hypot(...u)) * 180 / Math.PI,
				...lookAt[v].c.slice(0, 3),
				4,
			),
			matrix.rotateTo(...lookAt[v].c.slice(0, 3), 4),
		),
	);

	lookAt[v].x = matrix.multiply(
		lookAt[v].rotation,
		[1, 0, 0, 1],
	).splice(0, 3);
	lookAt[v].y = matrix.multiply(
		lookAt[v].rotation,
		[0, 1, 0, 1],
	).splice(0, 3);
	lookAt[v].z = matrix.multiply(
		lookAt[v].rotation,
		[0, 0, 1, 1],
	).splice(0, 3);

	switch (v) {
		case 'earth':
			// We set rotateAbout already
			break;
		default:
			lookAt[v].rotateAbout = lookAt[v].y;
	}
});

// Rotate onto Galactic Plane
halo.rotateTo(...lookAt[view].n);
ring.rotateTo(...lookAt[view].n);

[
	lookAt[view].c,
	lookAt[view].cp,
	lookAt[view].n,
].forEach((v, i) => {
	const ray = new gfx.Tube({
		r: 1,
		l: max * multiplier,
		color: new Array(4).fill(0).map((zero, j) => {
			if (i === j) return 1;
			if (j === 3) return 1;
			return 0;
		}),
		n: 4,
		m: 1,
	});
	ray.rotateTo(...v);
	gfx.addShapes(ray);
});

const globe = new gfx.Sphere({
	r: 20 * multiplier,
	color: [0, 0, 0, 0.05],
	n: 20,
});

gfx.addShapes(halo);
gfx.addShapes(ring);
// gfx.addShapes(globe);

const start = performance.now();

(() => {
	const canvas = document.querySelector('canvas');

	// If we don't have a GL context, give up now
	if (!canvas.getContext('webgl')) {
		console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	WebGL.zoom(10);

	WebGL.init(canvas, [0, 0, 0, 1]);

	WebGL.setCameraMatrix(lookAt[view].rotation);

	// Draw the scene repeatedly
	requestAnimationFrame(gfx.draw);
})();
});
