
var p1x, p1y;
var source1;
var source2;

var lines = [];
var lineSegments = [];

var drawing;
var startSim = false;
var width = 600;
var height = 400;
var frameR = 100;
var baseColor;
var baseBlue;
var otherBlue;
var particlesPos = [];
function setup() {
    createCanvas(600, 400);
    pixelDensity(1);
    background(200);
    frameRate(100);
    noSmooth();
    baseColor = color(200, 200, 200, 255);
    baseBlue = color(0, 0, 255, 255);
    otherBlue = color(0, 0, 254, 255);
    source1 = new WaterSource(Math.round(width / 3), 0, 400);
    source2 = new WaterSource(Math.round(width / 3 * 2), 0, 400);
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            particlesPos.push([]);
        }
    }
}

function draw() {
    
    background(200);
   
    source1.update();
    source2.update();
    source1.draw();
    source2.draw();
    stroke(0);
    if (lines.length > 1) {
        var start = 0, end;
        strokeWeight(1);
        noFill();
        for (var t = 0; t < lineSegments.length; t++) {
            end = lineSegments[t];

            beginShape();
            for (var i = start; i < end; i++) {
                vertex(lines[i].x, lines[i].y);
            }
            endShape();
            start = end;
        }
        strokeWeight(1);
        if (lines.length > 0 && drawing) {
            line(lines[lines.length - 1].x, lines[lines.length - 1].y, mouseX, mouseY);
        }
        addLine();
    }
}

function addLine() {
    if (lines.length > 1) {
        var start = 0, end;
        for (var t = 0; t < lineSegments.length; t++) {
            var v = [];
            end = lineSegments[t];
            noFill();
            for (var i = start; i < end; i++) {
                v.push(createVector(lines[i].x, lines[i].y));
            }
            start = end;
            for (var i = 0; i < v.length - 1; i++) {
                var vx = v[i+1].x - v[i].x;
                var vy = v[i + 1].y - v[i].y;
                var l = Math.sqrt(vx * vx + vy * vy);
                var ps = getLinePoints(v[i].x, v[i].y, v[i + 1].x, v[i+1].y, 2 + l)
                for (var j = 0; j < ps.length; j++) {
                    if (Math.round(ps[j].x) >= 0 && Math.round(ps[j].x) < width && Math.round(ps[j].y) >= 0 && Math.round(ps[j].y) < height) {
                        particlesPos[Math.round(ps[j].x)][Math.round(ps[j].y)] = new Wall();
                    }
                }
            }
        }
    }
}
function getLinePoints(x1, y1, x2, y2, res) {
    //get vector between points
    var vx = x2 - x1;
    var vy = y2 - y1;
    //console.log(vx, vy);
    var points = [];
    for (var i = 0; i <= 1; i += 1 / res) {
        points.push(createVector(x1 + vx * i, y1 + vy * i));
    }
    //console.log(points);
    return points;
}

function mousePressed() {
    if (drawing) {
        p1x = mouseX;
        p1y = mouseY;
        lines.push(createVector(p1x, p1y));
        lineSegments[lineSegments.length - 1] = lines.length;
    }
}

function keyPressed() {
    if (keyCode === SHIFT) {
        drawing = true;
        lineSegments.push(lines.length);
    }
    else if (keyCode === ENTER) {
        source1.enable = !source1.enable;
        source2.enable = !source2.enable;
    }
}

function keyReleased() {
    if (keyCode === SHIFT) {
        drawing = false;
        lineSegments[lineSegments.length - 1] = lines.length;
    }
}


class WaterSource {
    constructor(x, y, rate) {
        this.x = x;
        this.y = y;
        this.rate = rate;
        this.enable = false;

        this.pps = 1 / this.rate * frameR;
        this.nextSpawnFrame = 0;

        this.particles = [];

        this.update = function () {
                //loadPixels();

            if (this.enable) {
                if (frameCount >= this.nextSpawnFrame) {
                    if (this.pps < 1) {
                        for (var i = 0; i < this.rate / frameR; i++) {
                            this.spawn();
                        }
                    } else {
                        this.spawn();
                    }

                    this.nextSpawnFrame += this.pps;
                }
            }
            for (var i = 0; i < this.particles.length; i++) {
                var p = this.particles[i];
                if (p.offFrames > frameR) {

                    if (p.disabledFrames == 0) {
                        p.disabled = false;
                        p.disabledFrames = Math.ceil(Math.log10(p.offFrames));
                    }
                    else {
                        p.disabled = true;
                    }
                }
                if (p.disabledFrames > 0) {
                    p.disabledFrames--;
                }
                if (!p.disabled) {
                    //var left = myGet(p.x - 1, p.y);
                    //var leftBottom = myGet(p.x - 1, p.y + 1);
                    //var bottom = myGet(p.x, p.y + 1);
                    //var rightBottom = myGet(p.x + 1, p.y + 1);
                    //var right = myGet(p.x + 1, p.y);

                    //left = color(left[0], left[1], left[2], left[3]);
                    //leftBottom = color(leftBottom[0], leftBottom[1], leftBottom[2], leftBottom[3]);
                    //bottom = color(bottom[0], bottom[1], bottom[2], bottom[3]);
                    //rightBottom = color(rightBottom[0], rightBottom[1], rightBottom[2], rightBottom[3]);
                    //right = color(right[0], right[1], right[2], right[3]);
                    
                    
                    p.update();
                }
            }
            //console.log(Math.round(frameRate()));
        };

        this.spawn = function () {
            var x = this.x + Math.round(Math.random() * 2 - 1) * 2;
            var y = this.y;
            if (true) {
                var p = new WaterParticle(x, y);
                this.particles.push(p);
                particlesPos[x][y] = p;
            }
        };

        this.draw = function () {
            //noFill();

            stroke(color(0, 0, 255));
            strokeWeight(2);
            loadPixels();
            for (var i = 0; i < this.particles.length; i++) {
                var p = this.particles[i];
                p.draw();
            }
            updatePixels();

            noStroke();
            fill(color(0, 0, 254));
            ellipse(this.x, this.y, 20, 20);
        };
    }
}
class WaterParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.disabled = false;
        this.side = null;
        this.offFrames = 0;
        this.disabledFrames = 0;
        this.lastBottom = null;
        this.point = null;
        this.oldX = 0;
        this.oldY = 0;
        this.pressureY;
        this.pressureX;
        this.update = function () {
            
            if (particlesPos[this.x][this.y + 1] != null || this.lastBottom != null && Math.random() > 0.75) {
                if (particlesPos[this.x - 1][this.y] == null && particlesPos[this.x + 1][this.y] == null) {
                    this.x += Math.round(Math.random()) == 0 ? -1 : 1;
                }
                else if (particlesPos[this.x - 1][this.y] == null) {
                    this.x -= 1;
                }
                else if (particlesPos[this.x + 1][this.y] == null) {
                    this.x += 1;
                }
            }
            else {

                this.y += 1;
            }
            this.lastBottom = particlesPos[this.x][this.y + 1];



            //var t = particlesPos[this.x - 1][this.y];
            //var b = particlesPos[this.x][this.y + 1];
            //var l = particlesPos[this.x - 1][this.y];
            //var r = particlesPos[this.x + 1][this.y];

            








            if (this.y > height - 3) {
                this.y = height - 2;
                this.disabled = true;
            }
            if (this.x < 5) {
                this.x = 5;
            }
            else if (this.x > width - 5) {
                this.x = width - 5;
            }
            if (this.oldX != this.x || this.oldY != this.y) {
                particlesPos[this.oldX][this.oldY] = null;
                particlesPos[this.x][this.y] = this;
                //console.log("new pos");
                this.offFrames = 0;
            }
            else {
                this.offFrames++;
            }
            this.oldX = this.x;
            this.oldY = this.y;
        };

        this.draw = function () {
            //if (this.oldX != this.x || this.oldY != this.y) {

                for (var i = 0; i <= 3; i++) {
                    var index = ind(this.x, this.y, width) * 4 + i; 
                    //var oldIndex = ind(this.oldX, this.oldY, width) * 4 + i;
                    if (i == 0) {
                        pixels[index] = 0;
                        //pixels[oldIndex] = baseColor.r;
                    } else if (i == 1) {
                        pixels[index] = 0;
                        //pixels[oldIndex] = baseColor.g;
                    } else if (i == 2) {
                        pixels[index] = 255;
                        //pixels[oldIndex] = baseColor.b;
                    } else if (i == 3) {
                        pixels[index] = 255;
                        //pixels[oldIndex] = baseColor.a;
                    }
                }
            //}

            //point(this.x, this.y);
        };
    }
}

function isSame(c1, c2) {
    if (c1.r == c2.r && c1.g == c2.g && c1.b == c2.b && c1.a == c2.a) {
        return true;
    }
    return false;
}

function myGet(x, y) {
    var p = [];
    for (var i = 0; i <= 3; i++) {
        var index = ind(x, y, width) * 4 + i;
        p.push(pixels[index])
    }
    return p;
}
function ind(x, y, width) {
    return Math.round(x + y * width);
}

class Wall {

}