/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview MeasureBaseline drawing class
 */
import DrawingMode from '../interface/drawingMode';
import consts from '../consts';

const {drawingModes} = consts;
const components = consts.componentNames;

/**
 * MeasureBaselineMode class
 * @class
 * @ignore
 */
class MeasureBaseline extends DrawingMode {
    constructor() {
        super(drawingModes.MEASURE_BASELINE);
    }

    /**
    * start this drawing mode
    * @param {Graphics} graphics - Graphics instance
    * @param {{width: ?number, color: ?string}} [options] - Brush width & color
    * @override
    */
    start(graphics, options) {
        const lineDrawing = graphics.getComponent(components.MEASURE_BASELINE);
        lineDrawing.start(options);
    }

    /**
     * stop this drawing mode
     * @param {Graphics} graphics - Graphics instance
     * @override
     */
    end(graphics) {
        const lineDrawing = graphics.getComponent(components.MEASURE_BASELINE);
        lineDrawing.end();
    }
}

module.exports = MeasureBaseline;
