// import util from '../util';
// import Colorpicker from './tools/colorpicker';
// import Range from './tools/range';
import Submenu from './submenuBase';
import templateHtml from './template/submenu/measure';
// import {measureIconPath} from '../consts';
// const DRAW_OPACITY = 0.7;

/**
 * Measure ui class
 * @class
 * @ignore
 */
class Measure extends Submenu {
    constructor(subMenuElement, {locale, iconStyle, menuBarPosition, usageStatistics}) {
        super(subMenuElement, {
            locale,
            name: 'measure',
            iconStyle,
            menuBarPosition,
            templateHtml,
            usageStatistics
        });

        this._els = {
            baselineButton: this.selector('.tie-measure-baseline-button .tui-image-editor-button'),
            measureButton: this.selector('.tie-measure-line-button .tui-image-editor-button')
            // lineSelectButton: this.selector('.tie-ruler-select-button'),
            // drawColorpicker: new Colorpicker(
            //     this.selector('.tie-ruler-color'), '#00a9ff', this.toggleDirection, this.usageStatistics
            // ),
            // drawRange: new Range(this.selector('.tie-ruler-range'), defaultDrawRangeValus),
            // drawRangeValue: this.selector('.tie-ruler-range-value')
        };

        // this.baselineInitialized = false;
        // this.type = null;
        // this.color = this._els.drawColorpicker.color;
        // this.width = this._els.drawRange.value;
    }

    /**
     * Add event for draw
     * @param {Object} actions - actions for crop
     *   @param {Function} actions.setDrawMode - set draw mode
     */
    addEvent(actions) {
        this.actions = actions;

        this._els.baselineButton.addEventListener('click', this._drawBaselineHandler.bind(this));
        this._els.measureButton.addEventListener('click', this._addMeasureHandler.bind(this));

        // this._els.lineSelectButton.addEventListener('click', this._changeDrawType.bind(this));
        // this._els.drawColorpicker.on('change', this._changeDrawColor.bind(this));
        // this._els.drawRange.on('change', this._changeDrawRange.bind(this));
        // this._els.drawRangeValue.value = this._els.drawRange.value;
        // this._els.drawRangeValue.setAttribute('readonly', true);
    }

    /**
     * set draw mode - action runner
     */
    setDrawMode() {
        // this.actions.setDrawMode(this.type, {
        //     width: this.width,
        //     color: util.getRgb(this.color, DRAW_OPACITY)
        // });
    }

    /**
     * Clear icon type
     */
    clearIconType() {
        // this._els.addIconButton.classList.remove(this.iconType);
        // this.iconType = null;
    }

    // /**
    //  * Register default icon
    //  */
    // registDefaultIcon() {
    //     snippet.forEach(measureIconPath, (path, type) => {
    //         this.actions.registDefalutIcons(type, path);
    //     });
    // }

    /**
     * Returns the menu to its default state.
     */
    changeStandbyMode() {
        this.actions.stopDrawingMode();
        this.actions.changeSelectableAll(true);
    }

    changeStandbyModeLine() {
        this.actions.stopDrawingMode();
        this.actions.changeSelectableAll(true);
        this._els.measureButton.classList.remove('selected');
    }

    /**
     * Executed when the menu starts.
     */
    changeStartMode() {
        // this.type = 'free';
        // this._els.lineSelectButton.classList.add('free');
        // this.setDrawMode();
    }

    /**
     * Draw baseline event
     */
    _drawBaselineHandler() {
        this._els.baselineButton.classList.toggle('selected');

        if (this._els.baselineButton.classList.contains('selected')) {
            this.actions.setMeasureMode('baseline');
        } else {
            this.changeStandbyMode();
            this.actions.setMeasureBaselineToggle(false);
        }
    }

    baselineButtonToggle(flag) {
        if (flag) {
            this._els.baselineButton.classList.add('selected');
            this._els.measureButton.classList.add('selected');
        } else {
            this._els.baselineButton.classList.remove('selected');
            this._els.measureButton.classList.remove('selected');
        }
    }

    /**
     * Draw measureline event
     */
    _addMeasureHandler() {
        this._els.measureButton.classList.toggle('selected');

        if (this._els.measureButton.classList.contains('selected')) {
            this.actions.discardSelection();
            this.actions.changeSelectableAll(false);
            this.actions.setMeasureMode('measureline');
        } else {
            this.changeStandbyModeLine();
        }
    }
}

export default Measure;
