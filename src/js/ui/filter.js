import snippet from 'tui-code-snippet';
import Colorpicker from './tools/colorpicker';
import Range from './tools/range';
import Submenu from './submenuBase';
import templateHtml from './template/submenu/filter';
import {toInteger, toCamelCase} from '../util';
import {defaultFilterRangeValus as FILTER_RANGE} from '../consts';

const PICKER_CONTROL_HEIGHT = '130px';
const BLEND_OPTIONS = ['add', 'diff', 'subtract', 'multiply', 'screen', 'lighten', 'darken'];
const FILTER_OPTIONS = [
    'grayscale',
    'invert',
    'sepia',
    'sepia2',
    'blur',
    'sharpen',
    'emboss',
    'remove-white',
    'brightness',
    'contrast',
    'saturation',
    'noise',
    'pixelate',
    'color-filter',
    'tint',
    'multiply',
    'blend'
];
const filterNameMap = {
    grayscale: 'grayscale',
    invert: 'invert',
    sepia: 'sepia',
    sepia2: 'vintage',
    blur: 'blur',
    sharpen: 'sharpen',
    emboss: 'emboss',
    removeWhite: 'removeColor',
    brightness: 'brightness',
    contrast: 'contrast',
    saturation: 'saturation',
    vintage: 'vintage',
    polaroid: 'polaroid',
    noise: 'noise',
    pixelate: 'pixelate',
    colorFilter: 'removeColor',
    tint: 'blendColor',
    multiply: 'blendColor',
    blend: 'blendColor',
    hue: 'hue',
    gamma: 'gamma'
};

/**
 * Filter ui class
 * @class
 * @ignore
 */
class Filter extends Submenu {
    constructor(subMenuElement, {locale, iconStyle, menuBarPosition, usageStatistics}) {
        super(subMenuElement, {
            locale,
            name: 'filter',
            iconStyle,
            menuBarPosition,
            templateHtml,
            usageStatistics
        });

        this.selectBoxShow = false;

        this.checkedMap = {};
        this._makeControlElement();
    }

    /**
     * Add event for filter
     * @param {Object} actions - actions for crop
     *   @param {Function} actions.applyFilter - apply filter option
     */
    addEvent({applyFilter}) {
        const changeRangeValue = this._changeRangeValue.bind(this, applyFilter);
        const changeRangeValueOnly = this._changeRangeValueOnly.bind(this);

        snippet.forEach(FILTER_OPTIONS, filter => {
            const filterCheckElement = this.selector(`.tie-${filter}`);
            const filterNameCamelCase = toCamelCase(filter);
            this.checkedMap[filterNameCamelCase] = filterCheckElement;

            filterCheckElement.addEventListener('change', () => changeRangeValue(filterNameCamelCase));
        });

        this._els.removewhiteDistanceRange.on('change', () => changeRangeValue('removeWhite'));
        this._els.colorfilterThresholeRange.on('change', () => changeRangeValue('colorFilter'));
        this._els.pixelateRange.on('change', () => changeRangeValue('pixelate'));
        this._els.noiseRange.on('change', () => changeRangeValue('noise'));
        this._els.brightnessRange.on('change', () => changeRangeValue('brightness'));
        this._els.brightnessRange.on('input', () => changeRangeValueOnly('brightness'));
        this._els.brightnessRangeValue.value = this._els.brightnessRange.value;
        this._els.brightnessRangeValue.setAttribute('readonly', true);
        this._els.contrastRange.on('change', () => changeRangeValue('contrast'));
        this._els.contrastRange.on('input', () => changeRangeValueOnly('contrast'));
        this._els.contrastRangeValue.value = this._els.contrastRange.value;
        this._els.contrastRangeValue.setAttribute('readonly', true);
        this._els.saturationRange.on('change', () => changeRangeValue('saturation'));
        this._els.saturationRange.on('input', () => changeRangeValueOnly('saturation'));
        this._els.saturationRangeValue.value = this._els.saturationRange.value;
        this._els.saturationRangeValue.setAttribute('readonly', true);
        this._els.blendType.addEventListener('change', () => changeRangeValue('blend'));
        this._els.filterBlendColor.on('change', () => changeRangeValue('blend'));
        this._els.filterMultiplyColor.on('change', () => changeRangeValue('multiply'));
        this._els.tintOpacity.on('change', () => changeRangeValue('tint'));
        this._els.filterTintColor.on('change', () => changeRangeValue('tint'));
        this._els.blendType.addEventListener('click', event => event.stopPropagation());
        this._els.filterMultiplyColor.on('changeShow', this.colorPickerChangeShow.bind(this));
        this._els.filterTintColor.on('changeShow', this.colorPickerChangeShow.bind(this));
        this._els.filterBlendColor.on('changeShow', this.colorPickerChangeShow.bind(this));
    }

    resetRangeValue() {
        this._els.brightnessRange.value = 0;
        this._els.brightnessRangeValue.value = 0;
        this._els.contrastRange.value = 0;
        this._els.contrastRangeValue.value = 0;
        this._els.saturationRange.value = 0;
        this._els.saturationRangeValue.value = 0;
    }

    /**
     * Add event for filter
     * @param {Function} applyFilter - actions for firter
     * @param {string} filter - filter name
     */
    _changeRangeValue(applyFilter, filter) {
        const apply = this.checkedMap[filter].checked;
        const type = filterNameMap[filter];

        const checkboxGroup = this.checkedMap[filter].closest('.tui-image-editor-checkbox-group');
        if (checkboxGroup) {
            if (apply) {
                checkboxGroup.classList.remove('tui-image-editor-disabled');
            } else {
                checkboxGroup.classList.add('tui-image-editor-disabled');
            }
        }
        this._getFilterOption(filter);
        applyFilter(apply, type, this._getFilterOption(filter));
    }

    _changeRangeValueOnly(filter) {
        this._getFilterOption(filter);
    }

    /**
     * Get filter option
     * @param {String} type - filter type
     * @returns {Object} filter option object
     * @private
     */
    _getFilterOption(type) { // eslint-disable-line
        const option = {};
        let value;
        switch (type) {
            case 'removeWhite':
                option.color = '#FFFFFF';
                option.useAlpha = false;
                option.distance = parseFloat(this._els.removewhiteDistanceRange.value);
                break;
            case 'colorFilter':
                option.color = '#FFFFFF';
                option.distance = parseFloat(this._els.colorfilterThresholeRange.value);
                break;
            case 'pixelate':
                option.blocksize = toInteger(this._els.pixelateRange.value);
                break;
            case 'noise':
                option.noise = toInteger(this._els.noiseRange.value);
                break;
            case 'brightness':
                value = parseFloat(this._els.brightnessRange.value);
                option.brightness = value;
                this._els.brightnessRangeValue.value = toInteger(value * 100);
                break;
            case 'contrast':
                value = parseFloat(this._els.contrastRange.value);
                option.contrast = value;
                this._els.contrastRangeValue.value = toInteger(value * 100);
                break;
            case 'saturation':
                value = parseFloat(this._els.saturationRange.value);
                option.saturation = value;
                this._els.saturationRangeValue.value = toInteger(value * 100);
                break;
            case 'blend':
                option.mode = 'add';
                option.color = this._els.filterBlendColor.color;
                option.mode = this._els.blendType.value;
                break;
            case 'multiply':
                option.mode = 'multiply';
                option.color = this._els.filterMultiplyColor.color;
                break;
            case 'tint':
                option.mode = 'tint';
                option.color = this._els.filterTintColor.color;
                option.alpha = this._els.tintOpacity.value;
                break;
            default:
                break;
        }

        return option;
    }

    /**
     * Make submenu range and colorpicker control
     * @private
     */
    _makeControlElement() {
        this._els = {
            removewhiteDistanceRange: new Range(
                this.selector('.tie-removewhite-distance-range'),
                FILTER_RANGE.removewhiteDistanceRange
            ),
            brightnessRange: new Range(
                this.selector('.tie-brightness-range'),
                FILTER_RANGE.brightnessRange
            ),
            brightnessRangeValue: this.selector('.tie-brightness-range-value'),
            contrastRange: new Range(
                this.selector('.tie-contrast-range'),
                FILTER_RANGE.contrastRange
            ),
            contrastRangeValue: this.selector('.tie-contrast-range-value'),
            saturationRange: new Range(
                this.selector('.tie-saturation-range'),
                FILTER_RANGE.saturationRange
            ),
            saturationRangeValue: this.selector('.tie-saturation-range-value'),
            noiseRange: new Range(
                this.selector('.tie-noise-range'),
                FILTER_RANGE.noiseRange
            ),
            pixelateRange: new Range(
                this.selector('.tie-pixelate-range'),
                FILTER_RANGE.pixelateRange
            ),
            colorfilterThresholeRange: new Range(
                this.selector('.tie-colorfilter-threshole-range'),
                FILTER_RANGE.colorfilterThresholeRange
            ),
            filterTintColor: new Colorpicker(
                this.selector('.tie-filter-tint-color'), '#03bd9e', this.toggleDirection, this.usageStatistics
            ),
            filterMultiplyColor: new Colorpicker(
                this.selector('.tie-filter-multiply-color'), '#515ce6', this.toggleDirection, this.usageStatistics
            ),
            filterBlendColor: new Colorpicker(
                this.selector('.tie-filter-blend-color'), '#ffbb3b', this.toggleDirection, this.usageStatistics
            )
        };

        this._els.tintOpacity = this._pickerWithRange(this._els.filterTintColor.pickerControl);
        this._els.blendType = this._pickerWithSelectbox(this._els.filterBlendColor.pickerControl);

        this.colorPickerControls.push(this._els.filterTintColor);
        this.colorPickerControls.push(this._els.filterMultiplyColor);
        this.colorPickerControls.push(this._els.filterBlendColor);
    }

    /**
     * Make submenu control for picker & range mixin
     * @param {HTMLElement} pickerControl - pickerControl dom element
     * @returns {Range}
     * @private
     */
    _pickerWithRange(pickerControl) {
        const rangeWrap = document.createElement('div');
        const rangelabel = document.createElement('label');
        const range = document.createElement('div');

        range.id = 'tie-filter-tint-opacity';
        rangelabel.innerHTML = 'Opacity';
        rangeWrap.appendChild(rangelabel);
        rangeWrap.appendChild(range);
        pickerControl.appendChild(rangeWrap);
        pickerControl.style.height = PICKER_CONTROL_HEIGHT;

        return new Range(range, FILTER_RANGE.tintOpacityRange);
    }

    /**
     * Make submenu control for picker & selectbox
     * @param {HTMLElement} pickerControl - pickerControl dom element
     * @returns {HTMLElement}
     * @private
     */
    _pickerWithSelectbox(pickerControl) {
        const selectlistWrap = document.createElement('div');
        const selectlist = document.createElement('select');
        const optionlist = document.createElement('ul');

        selectlistWrap.className = 'tui-image-editor-selectlist-wrap';
        optionlist.className = 'tui-image-editor-selectlist';

        selectlistWrap.appendChild(selectlist);
        selectlistWrap.appendChild(optionlist);

        this._makeSelectOptionList(selectlist);

        pickerControl.appendChild(selectlistWrap);
        pickerControl.style.height = PICKER_CONTROL_HEIGHT;

        this._drawSelectOptionList(selectlist, optionlist);
        this._pickerWithSelectboxForAddEvent(selectlist, optionlist);

        return selectlist;
    }

    /**
     * Make selectbox option list custom style
     * @param {HTMLElement} selectlist - selectbox element
     * @param {HTMLElement} optionlist - custom option list item element
     * @private
     */
    _drawSelectOptionList(selectlist, optionlist) {
        const options = selectlist.querySelectorAll('option');
        snippet.forEach(options, option => {
            const optionElement = document.createElement('li');
            optionElement.innerHTML = option.innerHTML;
            optionElement.setAttribute('data-item', option.value);
            optionlist.appendChild(optionElement);
        });
    }

    /**
     * custome selectbox custom event
     * @param {HTMLElement} selectlist - selectbox element
     * @param {HTMLElement} optionlist - custom option list item element
     * @private
     */
    _pickerWithSelectboxForAddEvent(selectlist, optionlist) {
        optionlist.addEventListener('click', event => {
            const optionValue = event.target.getAttribute('data-item');
            const fireEvent = document.createEvent('HTMLEvents');

            selectlist.querySelector(`[value="${optionValue}"]`).selected = true;
            fireEvent.initEvent('change', true, true);

            selectlist.dispatchEvent(fireEvent);

            this.selectBoxShow = false;
            optionlist.style.display = 'none';
        });

        selectlist.addEventListener('mousedown', event => {
            event.preventDefault();
            this.selectBoxShow = !this.selectBoxShow;
            optionlist.style.display = this.selectBoxShow ? 'block' : 'none';
            optionlist.setAttribute('data-selectitem', selectlist.value);
            optionlist.querySelector(`[data-item='${selectlist.value}']`).classList.add('active');
        });
    }

    /**
     * Make option list for select control
     * @param {HTMLElement} selectlist - blend option select list element
     * @private
     */
    _makeSelectOptionList(selectlist) {
        snippet.forEach(BLEND_OPTIONS, option => {
            const selectOption = document.createElement('option');
            selectOption.setAttribute('value', option);
            selectOption.innerHTML = option.replace(/^[a-z]/, $0 => $0.toUpperCase());
            selectlist.appendChild(selectOption);
        });
    }
}

export default Filter;
