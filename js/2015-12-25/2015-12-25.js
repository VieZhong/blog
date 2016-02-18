function controlScreen() {
	if (interval) {
		document.getElementById("control").innerText = "Begin";
		clearInterval(interval);
		interval = null;
	} else {
		document.getElementById("control").innerText = "Pause";
		interval = setInterval(function() {
			pScreen.update();
			pScreen.drawBalls()
		}, 30);
	}
}

var protectedScreen = function(context, cwidth, cheight) {
	this.ctx = context;
	this.cw = cwidth;
	this.ch = cheight;

	this.ballGroup = [];

	this.addBallGroup = function() {
		var colorGroup = [
			[255, 0, 0],
			[255, 255, 0],
			[255, 0, 255],
			[0, 255, 0],
			[0, 255, 255],
			[0, 0, 255],
			[255, 0, 0]
		];

		for (var i = 0; i < 14; i++) {
			var l = 35 + 45 * Math.random();
			var ball = {
				r: l,
				x: Math.random() * (this.cw - 2 * l) + l,
				y: Math.random() * (this.ch - 2 * l) + l,
				vx: 2 + Math.floor(Math.random() * 3),
				vy: 2 + Math.floor(Math.random() * 3),
				color: colorGroup[Math.floor(Math.random() * 7)]
			}
			this.ballGroup.push(ball);
		}
	}

	this.init = function() {
		this.addBallGroup();
	}

	this.drawBall = function(x, y, r, color) {

		var linearGradient = this.ctx.createLinearGradient(x - r, y - r, x + r, y + r);
		linearGradient.addColorStop(0, "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.8)");
		linearGradient.addColorStop(0.15, "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.6)");
		linearGradient.addColorStop(0.3, "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.5)");
		linearGradient.addColorStop(0.4, "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.3)");
		linearGradient.addColorStop(0.6, "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.3)");
		linearGradient.addColorStop(0.8, "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.5)");
		linearGradient.addColorStop(1, "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.6)");

		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, Math.PI * 2);
		this.ctx.strokeStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.5)";
		this.ctx.stroke();
		this.ctx.clip();
		this.ctx.fillStyle = linearGradient;
		this.ctx.fill();
		this.ctx.restore();
	}

	this.drawBalls = function() {
		this.ctx.clearRect(0, 0, this.cw, this.ch);

		for (var i = this.ballGroup.length - 1; i >= 0; i--) {
			this.drawBall(this.ballGroup[i].x, this.ballGroup[i].y, this.ballGroup[i].r, this.ballGroup[i].color);
		}
	}

	this.update = function() {
		for (var i = this.ballGroup.length - 1; i >= 0; i--) {
			var ball = this.ballGroup[i];

			//left
			if (ball.x - ball.r < -ball.vx) {
				ball.vx = -ball.vx;
			}
			//right
			if (this.cw - ball.x - ball.r < ball.vx) {
				ball.vx = -ball.vx;
			}
			//top
			if (ball.y - ball.r < -ball.vy) {
				ball.vy = -ball.vy;
			}
			//bottom
			if (this.ch - ball.y - ball.r < ball.vy) {
				ball.vy = -ball.vy;
			}

			ball.x += ball.vx;
			ball.y += ball.vy;
		}
	}

}

var screenCanvas = document.getElementById("screenCanvas");
screenCanvas.width = window.innerWidth  > 1366 ? 640 : window.innerWidth  < 991 ? window.innerWidth * 0.61 : window.innerWidth * 0.45 ;
screenCanvas.height = 480;

var screenContext = screenCanvas.getContext("2d");

var pScreen = new protectedScreen(screenContext, screenCanvas.width, screenCanvas.height);
pScreen.init();

var interval = setInterval(function() {
	pScreen.update();
	pScreen.drawBalls()
}, 30);

window.onresize = function(){
	screenCanvas.width = window.innerWidth  > 1366 ? 640 : window.innerWidth  < 991 ? window.innerWidth * 0.61 : window.innerWidth * 0.45 ;
};