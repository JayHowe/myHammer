class MyHammer {
    constructor(obj, options) {
        this.eventQueue = [];
        this._start_time = 0;
        this._timer = null;
        this.obj = obj;
        obj.addEventListener('touchstart', this._start.bind(this), false);
        obj.addEventListener('touchmove', this._move.bind(this), false);
        obj.addEventListener('touchend', this._end.bind(this), false);

        this.type = '';
        this.isPinch=false;
        this.lastScale=1;

        this.lastRotate=0;
        this.rotate=0;
    }

    _trigger_event(name, Obj) {
        this.eventQueue.forEach(item => {
            if (item.name == name) {
                item.fn(Obj);
            }
        });
    }

    _start(ev) {
        this._start_time = Date.now();

        clearTimeout(this._timer);
        this._timer = setTimeout(function() {
            this._trigger_event('press', this);
            this.type = 'press';
        }.bind(this), 250);

        this._x1 = ev.targetTouches[0].clientX;
        this._y1 = ev.targetTouches[0].clientY;

        if (ev.targetTouches.length >= 2) {
            this._x2 = ev.targetTouches[1].clientX;
            this._y2 = ev.targetTouches[1].clientY;

            this.dis1=Math.sqrt(Math.pow(Math.abs(this._x1-this._x2),2)+Math.pow(Math.abs(this._y1-this._y2),2));
            this._trigger_event('pinchStart', this);


            let a=(this._x2-this._x1);
          	let b=(this._y2-this._y1);

          	this.ang1=Math.atan2(b,a)*180/Math.PI;
            this._trigger_event('rotateStart', this);
        	this.lastRotate=this.rotate;

        }

        this.moveX = 0;
        this.moveY = 0;

        this._dir = null;
        this.swipeName = '';

    }
    _move(ev) {
        ev.preventDefault();
        this.moveX = ev.targetTouches[0].clientX;
        this.moveY = ev.targetTouches[0].clientY;
        let now = Date.now();

        // dirction
        if (!this._dir) {
            if (Math.abs(this.moveX - this._x1) > 5) {
                this._dir = 'x';
            } else if (Math.abs(this.moveY - this._x1) > 5) {
                this._dir = 'y';
            }
        } else {
            // pan
            if (Math.abs(this.moveX - this._x1) > 10 || Math.abs(this.moveY - this._y1) > 10) {
                this._trigger_event('pan', this);

                if (this._dir == 'x') {
                    if (this.moveX > this._x1 && (this.moveX - this._x1) > 10) {
                        this._trigger_event('panRight', this);
                    } else if (this.moveX < this._x1 && (this._x1 - this.moveX) > 10) {
                        this._trigger_event('panLeft', this);
                    }

                } else if (this._dir == 'y') {
                    if (this.moveY > this._y1 && (this.moveY - this._y1) > 10) {
                        this._trigger_event('panDown', this);
                    } else if (this.moveY < this._y1 && (this._y1 - this.moveY) > 10) {
                        this._trigger_event('panUp', this);
                    }
                }
            }
        }

        if (ev.targetTouches.length >= 2) {
        	//pinch
        	this.scaleChange=this.scale;
        	let disX2 = ev.targetTouches[1].clientX;
        	let disY2 = ev.targetTouches[1].clientY;
            this.dis2=Math.sqrt(parseInt(Math.pow(Math.abs(this.moveX-disX2),2))+parseInt(Math.pow(Math.abs(this.moveY-disY2),2)));
            if(this.dis2/this.dis1 != 1) {
            	this.isPinch=true;

            	this._trigger_event('pinch',this);

            	if(this.dis2/this.dis1 > 1) {
            		this._trigger_event('pinchOut',this);
            		this.scale=(this.lastScale+(this.dis2/this.dis1-1)) >=2 ? 2 : (this.lastScale-(1-this.dis2/this.dis1));
            	}else {
            		this._trigger_event('pinchIn',this);
            		this.scale=(this.lastScale-(1-this.dis2/this.dis1)) <=0.5 ? 0.5 : (this.lastScale-(1-this.dis2/this.dis1));

            	}
            }
          	//rotate
          	let a=(disX2-this.moveX);
          	let b=(disY2-this.moveY);
          	this.ang2=Math.atan2(b,a)*180/Math.PI;

          	if(this.ang2-this.ang1 != 0) {
          		this.rotate=this.lastRotate+(this.ang2-this.ang1);
          		this._trigger_event('rotate',this);
          	}

          	// test data
            this.test=`total:${this.lastScale+(this.scaleChange-1)},
            		   lastScale:${this.lastScale},
            		   dis2:${this.dis2},
            		   dis1:${this.dis1},
            		   rotate:${this.rotate}
            		   `;
        }
    }
    _end() {
        let now = Date.now();

        // tap
        if (now - this._start_time <= 250) {
            // console.log('触发tap了');
            clearTimeout(this._timer);
            this._trigger_event('tap', this);
            this.type = 'tap';
        }

        // swipe
        if (this._dir == 'x') {
            if (this.moveX > this._x1 && (this.moveX - this._x1) / (now - this._start_time) > 0.3) {
                this.swipeName = 'swipeRight';
            } else if (this.moveX < this._x1 && (this._x1 - this.moveX) / (now - this._start_time) > 0.3) {
                this.swipeName = 'swipeLeft';
            }

        } else if (this._dir == 'y') {
            if (this.moveY > this._y1 && (this.moveY - this._y1) / (now - this._start_time) > 0.3) {
                this.swipeName = 'swipeDown';
            } else if (this.moveY < this._y1 && (this._y1 - this.moveY) / (now - this._start_time) > 0.3) {
                this.swipeName = 'swipeUp';
            }
        }
        if (this.swipeName != '') {
            this._trigger_event('swipe', this);
            this._trigger_event(this.swipeName, this);
            this.type = this.swipeName;
        }

        if(this.isPinch) {
        	this.isPinch=false;
            this._trigger_event('pinchEnd', this);
            this.lastScale=this.scale;
        }

        if(this.lastRotate != 0) {
            this._trigger_event('rotateEnd', this);
        }

        this.obj.removeEventListener('touchstart', this._start, false);
        this.obj.removeEventListener('touchmove', this._move, false);
        this.obj.removeEventListener('touchend', this._end, false);

    }

    on(name, fn) {
        this.eventQueue.push({ name, fn });
        return this;
    }
}