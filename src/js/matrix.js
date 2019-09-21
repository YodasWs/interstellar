const Matrix = (function() {
	const form2dCol = v => v.map(p => [p]);
	const form2dRow = v => [v];
	const x = 0, y = 1, z = 2;
	const EPSILON = 0.000001;

	function Matrix(camera = [0, 0, 1]) {
		this.camera = camera;
	}

	const create = (n, m) => new Array(n).fill(0).map(r => new Array(m).fill(0));

	const basicOperations = {
		flatten: m => m.reduce((f, r) => f.concat(r), []),

		identity(n) {
			const iden = create(n, n);
			iden.forEach((r, i) => r[i] = 1);
			return iden;
		},

		transpose(m) {
			const t = create(m[0].length, m.length);
			m.forEach((r, i) => {
				r.forEach((c, j) => {
					t[j][i] = c;
				});
			});
			return t;
		},

		add(m1, m2) {
			if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
				console.log('Error! Matrices must be same size!');
				return;
			}

			if (typeof m1[0] === 'number') {
				return m1.map((c, i) => c + m2[i]);
			}

			return m1.map((row, i) => row.map((cell, j) => cell + m2[i][j]));
		},

		multiply(m1, m2) {
			// Scalar multiplication
			if (typeof m2 === 'number') {
				if (typeof m1[0] === 'number')
					return m1.map(c => c * m2);
				return m1.map(r => r.map(c => c * m2));
			}

			if (m1[0].length !== m2.length) {
				console.log('Error! Matrices are incorrect size!');
				return;
			}

			// Matrix multiplication!
			const product = create(m1.length, m2[0].length);
			m1.forEach((row, i) => {
				m2[0].forEach((a, j) => {
					product[i][j] = m2.reduce((sum, c, k) => sum + m1[i][k] * m2[k][j], 0);
				});
			});
			return product;
		},
	};

	const axonometric = (...θ) => {
		θ = θ.map(a => a * Math.PI / 180);
		const X = [
			[1, 0, 0],
			[0, Math.cos(θ[x]), Math.sin(θ[x])],
			[0, -Math.sin(θ[x]), Math.cos(θ[x])],
		];
		const Y = [
			[Math.cos(θ[y]), 0, -Math.sin(θ[y])],
			[0, 1, 0],
			[Math.sin(θ[y]), 0, Math.cos(θ[y])],
		];
		const Z = [
			[Math.cos(θ[z]), Math.sin(θ[z]), 0],
			[-Math.sin(θ[z]), Math.cos(θ[z]), 0],
			[0, 0, 1],
		];
		return basicOperations.multiply(
			basicOperations.multiply(X, Y),
			Z,
		);
	};

	const isometric = axonometric(
		Math.asin(Math.tan(30 * Math.PI / 180)) * 180 / Math.PI,
		45,
		0,
	);

	Matrix.prototype = {
		...Matrix.prototype,
		...basicOperations,
		create,
		isometric,
		axonometric,
		form2dCol,
		form2dRow,

		projection(point) {
			const d = basicOperations.flatten(
				basicOperations.multiply(
					axonometric(
						Number.parseInt(document.getElementById('radx').value, 10),
						Number.parseInt(document.getElementById('rady').value, 10),
						Number.parseInt(document.getElementById('radz').value, 10),
					),
					form2dCol(point),
				),
			);
			return [
				[d[x] / this.camera[z] + this.camera[x]],
				[d[y] / this.camera[z] + this.camera[y]],
				[d[z] / this.camera[z] + this.camera[z]],
			];
		},

		crossProduct(v1, v2) {
			if (v1[0] instanceof Array) v1 = basicOperations.flatten(v1);
			if (v2[0] instanceof Array) v2 = basicOperations.flatten(v2);
			return [
				v1[y] * v2[z] - v1[z] * v2[y],
				v1[z] * v2[x] - v1[x] * v2[z],
				v1[x] * v2[y] - v1[y] * v2[x],
			];
		},

		inverseTranspose(m) {
			if (m.length === 4) {
				m = this.flatten(m);
			}

			if (m.length !== 16) {
				console.error('We only do inverse on 4×4 matrices!');
				return this.identity(4);
			}

			// Invert Matrix, from Mat4, https://vorg.github.io/pex/docs/pex-geom/Mat4.html
			const x00 = m[0 * 4 + 0];
			const x01 = m[0 * 4 + 1];
			const x02 = m[0 * 4 + 2];
			const x03 = m[0 * 4 + 3];
			const x04 = m[1 * 4 + 0];
			const x05 = m[1 * 4 + 1];
			const x06 = m[1 * 4 + 2];
			const x07 = m[1 * 4 + 3];
			const x08 = m[2 * 4 + 0];
			const x09 = m[2 * 4 + 1];
			const x10 = m[2 * 4 + 2];
			const x11 = m[2 * 4 + 3];
			const x12 = m[3 * 4 + 0];
			const x13 = m[3 * 4 + 1];
			const x14 = m[3 * 4 + 2];
			const x15 = m[3 * 4 + 3];
			const a0 = x00 * x05 - x01 * x04;
			const a1 = x00 * x06 - x02 * x04;
			const a2 = x00 * x07 - x03 * x04;
			const a3 = x01 * x06 - x02 * x05;
			const a4 = x01 * x07 - x03 * x05;
			const a5 = x02 * x07 - x03 * x06;
			const b0 = x08 * x13 - x09 * x12;
			const b1 = x08 * x14 - x10 * x12;
			const b2 = x08 * x15 - x11 * x12;
			const b3 = x09 * x14 - x10 * x13;
			const b4 = x09 * x15 - x11 * x13;
			const b5 = x10 * x15 - x11 * x14;
			const invdet = 1 / (a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0);

			return [
				[
					(+x05 * b5 - x06 * b4 + x07 * b3) * invdet,
					(-x04 * b5 + x06 * b2 - x07 * b1) * invdet,
					(+x04 * b4 - x05 * b2 + x07 * b0) * invdet,
					(-x04 * b3 + x05 * b1 - x06 * b0) * invdet,
				],
				[
					(-x01 * b5 + x02 * b4 - x03 * b3) * invdet,
					(+x00 * b5 - x02 * b2 + x03 * b1) * invdet,
					(-x00 * b4 + x01 * b2 - x03 * b0) * invdet,
					(+x00 * b3 - x01 * b1 + x02 * b0) * invdet,
				],
				[
					(+x13 * a5 - x14 * a4 + x15 * a3) * invdet,
					(-x12 * a5 + x14 * a2 - x15 * a1) * invdet,
					(+x12 * a4 - x13 * a2 + x15 * a0) * invdet,
					(-x12 * a3 + x13 * a1 - x14 * a0) * invdet,
				],
				[
					(-x09 * a5 + x10 * a4 - x11 * a3) * invdet,
					(+x08 * a5 - x10 * a2 + x11 * a1) * invdet,
					(-x08 * a4 + x09 * a2 - x11 * a0) * invdet,
					(+x08 * a3 - x09 * a1 + x10 * a0) * invdet,
				],
			];
		},

		// Move and point camera, from glMatrix, https://github.com/toji/gl-matrix/blob/master/src/mat4.js
		lookAt(eye, center, up) {
			let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
			const eyex = eye[x];
			const eyey = eye[y];
			const eyez = eye[z];
			const centerx = center[x];
			const centery = center[y];
			const centerz = center[z];

			if (Math.abs(eyex - centerx) < EPSILON &&
				Math.abs(eyey - centery) < EPSILON &&
				Math.abs(eyez - centerz) < EPSILON) {
				return basicOperations.identity(4);
			}

			z0 = eyex - centerx;
			z1 = eyey - centery;
			z2 = eyez - centerz;
			len = Math.hypot(z0, z1, z2);
			z0 /= len;
			z1 /= len;
			z2 /= len;

			const upx = up[x];
			const upy = up[y];
			const upz = up[z];

			x0 = upy * z2 - upz * z1;
			x1 = upz * z0 - upx * z2;
			x2 = upx * z1 - upy * z0;
			len = Math.hypot(x0, x1, x2);
			if (!len) {
				x0 = 0;
				x1 = 0;
				x2 = 0;
			} else {
				x0 /= len;
				x1 /= len;
				x2 /= len;
			}

			y0 = z1 * x2 - z2 * x1;
			y1 = z2 * x0 - z0 * x2;
			y2 = z0 * x1 - z1 * x0;

			len = Math.hypot(y0, y1, y2);
			if (!len) {
				y0 = 0;
				y1 = 0;
				y2 = 0;
			} else {
				y0 /= len;
				y1 /= len;
				y2 /= len;
			}

			return [
				[x0, y0, z0, 0],
				[x1, y1, z1, 0],
				[x2, y2, z2, 0],
				[
					-(x0 * eyex + x1 * eyey + x2 * eyez),
					-(y0 * eyex + y1 * eyey + y2 * eyez),
					-(z0 * eyex + z1 * eyey + z2 * eyez),
					1,
				],
			];
		},
	};

	return Matrix;
})();
module.exports = new Matrix();
