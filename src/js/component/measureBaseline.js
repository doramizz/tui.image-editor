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
class MeasureBaseline extends Component {
    constructor(graphics) {
        super(consts.componentNames.MEASURE_BASELINE, graphics);

        /**
         * Brush width
         * @type {number}
         * @private
         */
        this._width = 20;

        /**
         * fabric.Color instance for brush color
         * @type {fabric.Color}
         * @private
         */
        this._oColor = new fabric.Color('rgba(255, 112, 112, 0.8)');
        this._pColor = new fabric.Color('rgba(255, 112, 112, 1)');

        this._initialized = false;
        this._initialPosition = graphics.measureInitPosition;
        this._createBaselineObjects();
    }

    /**
     * Start drawing line mode
     * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
     */
    start() {
        const canvas = this.getCanvas();
        canvas.defaultCursor = 'default';

        canvas.forEachObject(obj => {
            obj.set({
                evented: true
            });
        });

        if (this._initialized) {
            this.setVisible(true);
        } else {
            this._initialized = true;
            this._createBaseline();
        }
    }

    /**
     * End drawing line mode
     */
    end() {
    }

    setInit(initialPosition = {}) {
        this._initialized = false;
        this._initialPosition = initialPosition;
    }

    setVisible(flag) {
        const canvas = this.getCanvas();
        this._start.set({
            visible: flag
        });
        this._end.set({
            visible: flag
        });
        this._line.set({
            visible: flag
        });
        // this._text.set({
        //     visible: flag
        // });
        canvas.renderAll();
    }

    _createBaselineObjects() {
        const canvas = this.getCanvas();
        const {width, height} = canvas;
        const xlen = 300;
        const ylen = 300;

        if (this._initialized) {
            if (this._initialPosition.width !== width ||
                this._initialPosition.height !== height) {
                this._initialPosition = {};
            }
        }

        const {x1 = (width / 2) - xlen,
            y1 = (height / 2) - ylen,
            x2 = (width / 2) + xlen,
            y2 = (height / 2) + ylen} = this._initialPosition;

        const opts = {
            originX: 'center',
            originY: 'center',
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockRotation: true,
            hasBorders: false,
            hasControls: false,
            type: 'measure_baseline'
        };
        this._start = new fabric.Triangle(extend({
            left: x1,
            top: y1,
            width: this._width * 3,
            height: this._width * 3,
            fill: this._pColor.toRgba(),
            padding: this._width * 2
        }, opts));

        this._end = new fabric.Triangle(extend({
            left: x2,
            top: y2,
            width: this._width * 3,
            height: this._width * 3,
            fill: this._pColor.toRgba(),
            padding: this._width * 2,
            angle: 180
        }, opts));

        const startPoint = this._start.getCenterPoint();
        const endPoint = this._end.getCenterPoint();
        const points = [startPoint.x, startPoint.y, endPoint.x, endPoint.y];

        this._line = new fabric.Line(points, extend(opts, {
            stroke: this._oColor.toRgba(),
            strokeWidth: this._width,
            hasBorders: true,
            borderColor: 'rgba(255,255,255,0.5)',
            borderScaleFactor: '5'
        }));

        this._line.start = this._start;
        this._line.end = this._end;

        canvas.add(this._line, this._start, this._end);
    }

    _createBaseline() {
        const canvas = this.getCanvas();

        this._createBaselineObjects();

        const startPoint = this._start.getCenterPoint();
        const endPoint = this._end.getCenterPoint();

        this._moveTriangle(startPoint, endPoint);

        const param1 = this.graphics.createObjectProperties(this._line);
        const param2 = this.graphics.createObjectProperties(this._start);
        const param3 = this.graphics.createObjectProperties(this._end);

        this.fire(eventNames.ADD_OBJECT, param1);
        this.fire(eventNames.ADD_OBJECT, param2);
        this.fire(eventNames.ADD_OBJECT, param3);

        const self = this;

        this._start.on({
            moving(fEvent) {
                const pointer = canvas.getPointer(fEvent.e);
                const endPointer = {
                    x: self._end.left,
                    y: self._end.top
                };

                self._moveTriangle(pointer, endPointer);
            },
            moved() {
                self.recalcMeasurelines();
            }
        });
        this._end.on({
            moving(fEvent) {
                const pointer = canvas.getPointer(fEvent.e);
                const startPointer = {
                    x: self._start.left,
                    y: self._start.top
                };

                self._moveTriangle(startPointer, pointer);
            },
            moved() {
                self.recalcMeasurelines();
            }
        });

        this._line.on({
            moving() {
                const line = self._line;
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

                self._moveTriangle(startPointer, endPointer);
            },
            moved() {
                self.recalcMeasurelines();
                canvas.discardActiveObject();
                canvas.renderAll();
            }
        });
    }

    recalcMeasurelines() {
        const {length} = this.getBaseline();
        this.graphics.recalcMeasurelines(length);
    }

    getBaseline() {
        const {x1, y1, x2, y2} = this._line;
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + (this._width * 3);
        const canvas = this.getCanvas();
        const {width, height} = canvas;

        let ret = {};

        if (this._initialized) {
            ret = {
                x1,
                y1,
                x2,
                y2,
                length,
                width,
                height
            };
        }

        return ret;
    }

    _moveTriangle(start, end) {
        const canvas = this.getCanvas();
        const angle = (Math.atan2((end.y - start.y), (end.x - start.x)) * 180) / Math.PI;

        this._start.set({
            left: start.x,
            top: start.y,
            angle: angle - 90
        });

        this._end.set({
            left: end.x,
            top: end.y,
            angle: angle + 90
        });

        this._line.set({
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y
        });

        this._start.setCoords();
        this._end.setCoords();
        this._line.setCoords();
        canvas.renderAll();
    }
}

module.exports = MeasureBaseline;
