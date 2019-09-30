const Matrix = (function() {
	const x = 0, y = 1, z = 2;
	const EPSILON = 0.000001;

	function Matrix() {
	}

	Matrix.prototype = {
		...Matrix.prototype,

		flatten: m => m.reduce((f, r) => f.concat(r), []),
		form2dCol: v => v.map(p => [p]),
		form2dRow: v => [v],

		create: (n, m) => new Array(n).fill(0).map(r => new Array(m).fill(0)),

		identity(n) {
			const iden = this.create(n, n);
			iden.forEach((r, i) => r[i] = 1);
			return iden;
		},

		transpose(m) {
			const t = this.create(m[0].length, m.length);
			m.forEach((r, i) => {
				r.forEach((c, j) => {
					t[j][i] = c;
				});
			});
			return t;
		},

		add(m1, m2) {
			if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
				console.error('Error! Matrices must be same size!');
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
				console.error('Error! Matrices are incorrect size!');
				return;
			}

			if (!(m2[0] instanceof Array)) {
				m2 = this.form2dCol(m2);
			}

			// Matrix multiplication!
			const product = this.create(m1.length, m2[0].length);
			m1.forEach((row, i) => {
				m2[0].forEach((a, j) => {
					product[i][j] = m2.reduce((sum, c, k) => sum + m1[i][k] * m2[k][j], 0);
				});
			});
			return product;
		},

		isometric() {
			return this.axonometric(
				Math.asin(Math.tan(30 * Math.PI / 180)) * 180 / Math.PI,
				45,
				0,
			);
		},

		axonometric(θx, θy, θz, size = 3) {
			const θ = [θx, θy, θz].map(a => a * Math.PI / 180);
			const X = this.identity(size);
			const Y = this.identity(size);
			const Z = this.identity(size);
			X[1][1] = Math.cos(θ[x]);
			X[1][2] = Math.sin(θ[x]);
			X[2][1] = -Math.sin(θ[x]);
			X[2][2] = Math.cos(θ[x]);
			Y[0][0] = Math.cos(θ[y]);
			Y[0][2] = -Math.sin(θ[y]);
			Y[2][0] = Math.sin(θ[y]);
			Y[2][2] = Math.cos(θ[y]);
			Z[0][0] = Math.cos(θ[z]);
			Z[0][1] = Math.sin(θ[z]);
			Z[1][0] = -Math.sin(θ[z]);
			Z[1][1] = Math.cos(θ[z]);
			return this.multiply(
				this.multiply(X, Y),
				Z,
			);
		},

		crossProduct(v1, v2) {
			if (v1[0] instanceof Array) v1 = this.flatten(v1);
			if (v2[0] instanceof Array) v2 = this.flatten(v2);
			return [
				v1[y] * v2[z] - v1[z] * v2[y],
				v1[z] * v2[x] - v1[x] * v2[z],
				v1[x] * v2[y] - v1[y] * v2[x],
			];
		},

		dotProduct(v1, v2) {
			if (v1[0] instanceof Array) v1 = this.flatten(v1);
			if (v2[0] instanceof Array) v2 = this.flatten(v2);
			if (v1.length !== v2.length) {
				console.error('Error! Vectors must be same size!');
				return;
			}
			return v1.reduce((sum, c, i) => sum + v1[i] * v2[i], 0);
		},

		rotation(...θ) {
			θ = θ.map(a => a * Math.PI / 180);
			const X = [
				[1, 0, 0],
				[0, Math.cos(θ[z]), Math.sin(θ[z])],
				[0, -Math.sin(θ[z]), Math.cos(θ[z])],
			];
			const Y = [
				[Math.cos(θ[y]), 0, Math.sin(θ[y])],
				[0, 1, 0],
				[-Math.sin(θ[y]), 0, Math.cos(θ[y])],
			];
			const Z = [
				[Math.cos(θ[x]), Math.sin(θ[x]), 0],
				[-Math.sin(θ[x]), Math.cos(θ[x]), 0],
				[0, 0, 1],
			];
			return this.multiply(
				this.multiply(Z, Y),
				X,
			);
		},

		// Rotate about a vector http://ksuweb.kennesaw.edu/~plaval/math4490/rotgen.pdf
		rotateAbout(θ, ux, uy, uz, size = 3) {
			θ *= Math.PI / 180;
			const u = [ux, uy, uz];
			const t = 1 - Math.cos(θ);
			const c = Math.cos(θ);
			const s = Math.sin(θ);
			const r = this.identity(size);
			r[0][0] = t * u[x] * u[x] + c;
			r[0][1] = t * u[x] * u[y] - s * u[z];
			r[0][2] = t * u[x] * u[z] + s * u[y];
			r[1][0] = t * u[y] * u[x] + s * u[z];
			r[1][1] = t * u[y] * u[y] + c;
			r[1][2] = t * u[y] * u[z] - s * u[x];
			r[2][0] = t * u[z] * u[x] - s * u[y];
			r[2][1] = t * u[z] * u[y] + s * u[x];
			r[2][2] = t * u[z] * u[z] + c;
			return r;
			return [
				[
					t * u[x] * u[x] + c,
					t * u[x] * u[y] - s * u[z],
					t * u[x] * u[z] + s * u[y],
				],
				[
					t * u[y] * u[x] + s * u[z],
					t * u[y] * u[y] + c,
					t * u[y] * u[z] - s * u[x],
				],
				[
					t * u[z] * u[x] - s * u[y],
					t * u[z] * u[y] + s * u[x],
					t * u[z] * u[z] + c,
				],
			];
		},

		// Rotate onto given vector
		rotateTo(px, py, pz, size = 3) {
			const point = this.toUnitVector([px, py, pz]);
			const v = this.crossProduct(
				[0, 0, 1],
				point,
			);
			const s = Math.hypot(...v);
			const c = this.dotProduct(
				[0, 0, 1],
				point,
			);
			const vx = [
				[0, -v[z], v[y]],
				[v[z], 0, -v[x]],
				[-v[y], v[x], 0],
			];
			const r = this.add(
				this.identity(3),
				this.add(
					vx,
					this.multiply(
						this.multiply(
							vx,
							vx,
						),
						(1 - c) / (s ** 2),
					),
				),
			);

			switch (size) {
				case 3:
					return r;
				case 4:
					return [
						[...r[0], 0],
						[...r[1], 0],
						[...r[2], 0],
						[0, 0, 0, 1],
					];
				default:
					return matrix.identity(size);
			}
		},

		toUnitVector(u) {
			if (u[0] instanceof Array) u = this.flatten(u);
			const h = Math.hypot(...u);
			if (!h) return new Array(u.length).fill(0);
			return this.multiply(u, 1 / h);
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

		lookAt(eye, center, up) {
			const zAxis = this.toUnitVector(
				this.add(
					center,
					this.multiply(
						eye,
						-1,
					),
				),
			);

			if (Math.hypot(zAxis) < EPSILON) {
				console.error('Eye and Center cannot be the same point!');
				return {
					x: [1, 0, 0],
					y: [0, 1, 0],
					z: [0, 0, 1],
					rotation: this.identity(4),
				};
			}

			const xAxis = this.toUnitVector(
				this.crossProduct(
					up,
					zAxis,
				),
			);

			const yAxis = this.toUnitVector(
				this.crossProduct(
					zAxis,
					xAxis,
				),
			);

			return {
				x: xAxis,
				y: yAxis,
				z: zAxis,
				rotation: this.transpose([
					[...xAxis, -this.dotProduct(xAxis, eye)],
					[...yAxis, -this.dotProduct(yAxis, eye)],
					[...zAxis, -this.dotProduct(zAxis, eye)],
					[0, 0, 0, 1],
				]),
			};
		},
	};

	return Matrix;
})();
module.exports = new Matrix();
