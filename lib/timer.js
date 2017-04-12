// 被暂停时不是整秒
// 手机站滑动时，倒计时静止
// 把毫秒转换成数组[day, hour, minute, second, millisecond]
// level 0-秒，1-分，2-时，3-天，默认是分
function calculateTime(time, level, isCountdown) {
    level = level || 0
    var times = []
    var i
    var len
    if(time <= 0) {
        for (i = 0, len = level + 2; i < len; i++) {
            times.push(0)
        }
        return times
    }
    var ms = time % 1000;
    time = Math[isCountdown ? 'ceil' : 'floor'](time / 1000); // 倒计时是ceil，跑秒是floor
    var scales = [86400, 3600, 60]
    scales = scales.slice(scales.length - level)
    for (i = 0, len = scales.length; i < len; i++) {
        times.push(Math.floor(time / scales[i]));
        time %= scales[i];
    }
    times.push(time);
    times.push(ms); // 毫秒
    return times;
}
export function Countdown(time, fn, level, step) {
    var ms
    if(time instanceof Date) {  // 结束时间
        this.endTime = time
        ms = time.getTime() - new Date().getTime()
    } else if(typeof time === "number") { // 倒计时毫秒值
        ms = this.time = this.totalTime = time
    }
    this.fn = fn
    this.level = level || 0
    this.step = step || 1000
    this.running = false
    this.fn(calculateTime(ms, this.level, true), ms < 0 ? true : undefined)  // 初始化
}
Countdown.prototype.start = function () {
    if(this.ended) {
        return
    }
    var now = new Date()
    var ms
    if(this.endTime) {
        ms = this.endTime.getTime() - now.getTime()
    } else {
        ms = this.time
    }
    var step
    var offset
    if(this.timestamp && this.offset) { // 暂停后补偿进来
        offset = step = this.step
        this.offset = undefined
    } else if(this.offset) {  // 暂停后进来
        offset = step = this.offset
    } else {
        step = this.step
        if(this.timestamp) {
            offset = now.getTime() - this.timestamp.getTime()
            if(Math.abs(offset - this.step) < 20) {  // 如果setTimeout函数精确的话offset会等于this.step，允许20ms的误差
                offset = this.step
            }
        } else {
            offset = this.step
        }
    }
    this.timestamp = now
    var times
    var isEnd
    var that = this
    if(ms <= 0) {
        times = [0, 0, 0, 0, 0]
        this.ended = true
    } else if(ms <= step) { // 能考虑到这个更好
        times = calculateTime(ms, this.level, true)
        this.timer = setTimeout(function () {
            that.start()
        }, ms)
        if(typeof this.time !== 'undefined') {
            this.time = 0
        }
        this.running = true
    } else {
        times = calculateTime(ms, this.level, true)
        this.timer = setTimeout(function () {
            that.start()
        }, step)
        if(typeof this.time !== 'undefined') {
            this.time -= offset
        }
        this.running = true
    }
    this.fn(times, this.ended)
}
Countdown.prototype.stop = function () {
    if(this.ended) {
        return
    }
    this.offset = this.step - (new Date().getTime() - this.timestamp.getTime()) // 被暂停计划不是整个step
    var ms
    if(typeof this.time !== 'undefined') {
        this.time += this.offset
        ms = this.time
    } else {
        ms = this.endTime.getTime() - new Date().getTime()
    }
    clearTimeout(this.timer)
    this.running = false
    this.timestamp = undefined
    this.fn(calculateTime(ms, this.level, true), ms < 0 ? true : undefined)
}
Countdown.prototype.toggle = function () {
    if(this.running) {
        this.stop()
    } else {
        this.start()
    }
}
Countdown.prototype.reset = function (time) {
    clearTimeout(this.timer)
    this.ended = undefined
    this.running = false
    this.offset = undefined
    this.timestamp = undefined
    var ms
    if(time instanceof Date) {  // 结束时间
        this.endTime = time
        ms = this.endTime.getTime() - new Date().getTime()
    } else if(typeof time === "number") { // 倒计时毫秒值
        ms = this.time = this.totalTime = time
    } else {
        ms = this.time = this.totalTime
    }
    this.fn(calculateTime(ms, this.level, true), ms < 0 ? true : undefined)
}

export function CountSecond(fn, level, step) {
    this.fn = fn
    this.level = level || 1
    this.step = step || 10
    this.time = 0
    this.running = false
    this.fn(calculateTime(this.time, this.level))
}
CountSecond.prototype.start = function () {
    this.running = true
    var startTime = new Date()
    startTime.setMilliseconds(startTime.getMilliseconds() - this.time)
    this.fn(calculateTime(this.time, this.level))
    var that = this
    this.timer = setInterval(function () {
        that.time = new Date().getTime() - startTime.getTime()
        that.fn(calculateTime(that.time, that.level))
    }, this.step);
}
CountSecond.prototype.stop = function () {
    this.running = false
    clearInterval(this.timer)
    this.fn(calculateTime(this.time, this.level))
}
CountSecond.prototype.toggle = function () {
    if(this.running) {
        this.stop()
    } else {
        this.start()
    }
}
CountSecond.prototype.reset = function () {
    this.stop()
    this.time = 0
    this.fn(calculateTime(this.time, this.level))
}

