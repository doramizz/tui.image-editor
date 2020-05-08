/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Free drawing module, Set brush
 */
import fabric from 'fabric';
import Component from '../interface/component';
import consts from '../consts';
import {extend} from 'tui-code-snippet';

const {eventNames} = consts;
/**
 * Measure Baseline
 * @class Line
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
class MeasureLine extends Component {
    constructor(graphics) {
        super(consts.componentNames.MEASURE_LINE, graphics);

        /**
         * Brush width
         * @type {number}
         * @private
         */
        this._width = 20;
        this._textWidth = 550;
        this._textHeight = 100;
        this._textPadding = 20;

        /**
         * fabric.Color instance for brush color
         * @type {fabric.Color}
         * @private
         */
        // this._oColor = new fabric.Color('#ff7070');
        this._oColor = new fabric.Color('rgba(0, 255, 0, 0.5)');
        this._pColor = new fabric.Color('rgba(0, 255, 0, 1)');
        /**
         * Listeners
         * @type {object.<string, function>}
         * @private
         */

        this._lines = [];

        this._listeners = {
            mousedown: this._onFabricMouseDown.bind(this),
            mousemove: this._onFabricMouseMove.bind(this),
            mouseup: this._onFabricMouseUp.bind(this)
        };

        const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="64px" height="64px"><path fill="#00000042" d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"/><path fill="#e0e0e0" d="M285,256l72.5-84.2c7.9-9.2,6.9-23-2.3-31c-9.2-7.9-23-6.9-30.9,2.3L256,222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3c-9.2,7.9-10.2,21.8-2.3,31L227,256l-72.5,84.2c-7.9,9.2-6.9,23,2.3,31c4.1,3.6,9.2,5.3,14.3,5.3c6.2,0,12.3-2.6,16.6-7.6l68.2-79.2l68.2,79.2c4.3,5,10.5,7.6,16.6,7.6c5.1,0,10.2-1.7,14.3-5.3c9.2-7.9,10.2-21.8,2.3-31L285,256z"/></svg>';

        fabric.loadSVGFromString(svg, object => {
            this._icon = fabric.util.groupSVGElements(object, {
                left: this._textWidth - this._width,
                top: 0,
                originX: 'right',
                originY: 'center',
                height: this._textHeight,
                type: 'measure_deleteIcon'
            });
        });
    }

    /**
     * Start drawing line mode
     * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
     */
    start() {
        const canvas = this.getCanvas();

        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;

        this._line = null;
        this._start = null;
        this._end = null;
        this._text = null;

        canvas.forEachObject(obj => {
            obj.set({
                evented: false
            });
        });

        canvas.on({
            'mouse:down': this._listeners.mousedown
        });
    }

    end() {
        const canvas = this.getCanvas();

        canvas.defaultCursor = 'default';
        canvas.selection = false;

        canvas.forEachObject(obj => {
            obj.set({
                evented: true
            });
        });

        canvas.off('mouse:down', this._listeners.mousedown);
    }

    setInit() {
        this.end();
        this._lines = [];
    }

    /**
     * Mousedown event handler in fabric canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
     * @private
     */
    _onFabricMouseDown(fEvent) {
        const canvas = this.getCanvas();
        const pointer = canvas.getPointer(fEvent.e);

        if (this._line) {
            return;
        }

        const commOpts = {
            evented: false,
            originX: 'center',
            originY: 'center',
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockRotation: true,
            hasBorders: false,
            hasControls: false,
            type: 'measure_line'
        };

        this._start = new fabric.Circle(extend(commOpts, {
            left: pointer.x,
            top: pointer.y,
            radius: this._width * 1.5,
            fill: this._pColor.toRgba()
        }));

        this._end = new fabric.Circle(extend(commOpts, {
            left: pointer.x,
            top: pointer.y,
            radius: this._width * 1.5,
            fill: this._pColor.toRgba()
        }));

        const startPoint = this._start.getCenterPoint();
        const points = [startPoint.x, startPoint.y, startPoint.x, startPoint.y];

        this._line = new fabric.Line(points, extend(commOpts, {
            stroke: this._oColor.toRgba(),
            strokeWidth: this._width,
            hasBorders: true,
            borderColor: 'rgba(255,255,255,0.5)',
            borderScaleFactor: '5'
        }));

        const bg = new fabric.Rect({
            fill: 'rgba(255,255,255,0.5)',
            originY: 'center',
            rx: this._textPadding,
            ry: this._textPadding,
            width: this._textWidth,
            height: this._textHeight + (this._textPadding * 2)
        });

        const text = new fabric.Text('  0mm', {
            fontSize: this._textHeight,
            originY: 'center',
            fill: 'black',
            left: this._textPadding,
            fontFamily: 'Noto Sans KR'
        });

        this._icon.clone(cloned => {
            this._text = new fabric.Group([bg, text, cloned], extend(commOpts, {
                left: pointer.x + (this._width * 2),
                top: pointer.y,
                originX: 'left',
                subTargetCheck: true,
                hoverCursor: 'auto',
                lockMovementX: true,
                lockMovementY: true
            }));

            this._line.start = this._start;
            this._line.end = this._end;
            this._line.text = this._text;
            this._start.line = this._line;
            this._end.line = this._line;
            this._text.line = this._line;

            canvas.add(this._text, this._line, this._start, this._end);

            canvas.on({
                'mouse:move': this._listeners.mousemove,
                'mouse:up': this._listeners.mouseup
            });
        });
    }

    /**
     * Mousemove event handler in fabric canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
     * @private
     */
    _onFabricMouseMove(fEvent) {
        const canvas = this.getCanvas();
        const pointer = canvas.getPointer(fEvent.e);
        const startPointer = {
            x: this._start.left,
            y: this._start.top
        };

        this._moveCircle(this._start, this._end, startPointer, pointer);
    }

    /**
     * Mouseup event handler in fabric canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
     * @private
     */
    _onFabricMouseUp() {
        const canvas = this.getCanvas();
        const param1 = this.graphics.createObjectProperties(this._line);
        const param2 = this.graphics.createObjectProperties(this._start);
        const param3 = this.graphics.createObjectProperties(this._end);
        const param4 = this.graphics.createObjectProperties(this._text);

        this.fire(eventNames.ADD_OBJECT, param1);
        this.fire(eventNames.ADD_OBJECT, param2);
        this.fire(eventNames.ADD_OBJECT, param3);
        this.fire(eventNames.ADD_OBJECT_AFTER, param4);

        const self = this;

        this._start.on({
            moving(fEvent) {
                const pointer = canvas.getPointer(fEvent.e);
                const {target} = fEvent;

                const endPointer = {
                    x: target.line.end.left,
                    y: target.line.end.top
                };

                self._moveCircle(target, target.line.end, pointer, endPointer);
            }
        });
        this._end.on({
            moving(fEvent) {
                const pointer = canvas.getPointer(fEvent.e);
                const {target} = fEvent;
                const startPointer = {
                    x: target.line.start.left,
                    y: target.line.start.top
                };

                self._moveCircle(target.line.start, target, startPointer, pointer);
            }
        });

        this._line.on({
            moving(fEvent) {
                const line = fEvent.target;

                const oldCenterX = (line.x1 + line.x2) / 2;
                const oldCenterY = (line.y1 + line.y2) / 2;
                const deltaX = line.left - oldCenterX;
                const deltaY = line.top - oldCenterY;

                const startPointer = {
                    x: line.x1 + deltaX,
                    y: line.y1 + deltaY
                };
                const endPointer = {
                    x: line.x2 + deltaX,
                    y: line.y2 + deltaY
                };

                self._moveCircle(line.start, line.end, startPointer, endPointer);
            },
            moved() {
                canvas.discardActiveObject();
                canvas.renderAll();
            }
        });

        this._text.on({
            mouseup(fEvent) {
                const subTarget = fEvent.subTargets && fEvent.subTargets[0];
                const {target} = fEvent;
                if (subTarget && subTarget.type === 'measure_deleteIcon') {
                    canvas.remove(target.line.start, target.line.end, target.line.text, target.line);
                    canvas.renderAll();
                }
            },
            // mouseover(fEvent) {
            //     const subTarget = fEvent.subTargets && fEvent.subTargets[0];
            //     const {target} = fEvent;
            //     let hoverCursor = 'auto';
            //     if (subTarget && subTarget.type === 'measure_deleteIcon') {
            //         hoverCursor = 'default';
            //     }
            //     target.set({
            //         hoverCursor
            //     });
            //     canvas.renderAll();
            // },
            mousemove(fEvent) {
                const subTarget = fEvent.subTargets && fEvent.subTargets[0];
                const {target} = fEvent;

                if (subTarget && subTarget.type === 'measure_deleteIcon') {
                    subTarget.item(0).set({
                        fill: '#00000061'
                    });
                } else {
                    target.item(2).item(0).set({
                        fill: '#00000042'
                    });
                }
                canvas.renderAll();
            }
        });

        this._lines.push(this._line);
        this._line = null;
        this._start = null;
        this._end = null;
        this._text = null;

        canvas.off({
            'mouse:move': this._listeners.mousemove,
            'mouse:up': this._listeners.mouseup
        });

        this.end();
    }

    _moveCircle(start, end, startPoint, endPoint) {
        const canvas = this.getCanvas();
        const angle = (Math.atan2((endPoint.y - startPoint.y), (endPoint.x - startPoint.x)) * 180) / Math.PI;

        start.set({
            left: startPoint.x,
            top: startPoint.y,
            angle: angle - 90
        });

        end.set({
            left: endPoint.x,
            top: endPoint.y,
            angle: angle + 90
        });

        start.line.set({
            x1: startPoint.x,
            y1: startPoint.y,
            x2: endPoint.x,
            y2: endPoint.y,
            angle: 0
        });

        const {length} = this.graphics.getMeasureBaselinePoints();
        const text = this.calcLineLength(length, startPoint, endPoint);

        start.line.text.set({
            left: endPoint.x + (this._width * 2),
            top: endPoint.y
        });
        // start.line.text.item(0).set({
        //     width: this._textWidth
        // });
        start.line.text.item(1).set({
            text
        });

        start.setCoords();
        end.setCoords();
        start.line.setCoords();
        start.line.text.setCoords();
        canvas.renderAll();
    }

    _moveLine(start, end, startPoint, endPoint) {
        const canvas = this.getCanvas();
        start.set({
            left: startPoint.x,
            top: startPoint.y
        });

        end.set({
            left: endPoint.x,
            top: endPoint.y
        });

        start.line.set({
            x1: startPoint.x,
            y1: startPoint.y,
            x2: endPoint.x,
            y2: endPoint.y
        });

        start.line.text.set({
            left: endPoint.x + (this._width * 2),
            top: endPoint.y
        });

        start.setCoords();
        end.setCoords();
        start.line.setCoords();
        start.line.text.setCoords();
        canvas.renderAll();
    }

    recalcMeasurelines(baselineLength) {
        this._lines.forEach(line => {
            const {x1, x2, y1, y2} = line;
            const text = this.calcLineLength(baselineLength, {
                x: x1,
                y: y1
            }, {
                x: x2,
                y: y2
            });

            line.text.item(1).set({
                text
            });
        });
    }

    calcLineLength(baselineLength, start, end) {
        const lineLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) + (this._width * 3);
        const text = `${(lineLength.toFixed(2) / baselineLength.toFixed(2) * 10).toFixed(2)}mm`;

        return text;
    }
}

module.exports = MeasureLine;
