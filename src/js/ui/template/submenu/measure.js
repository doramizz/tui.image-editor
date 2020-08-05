/**
 * @param {Locale} locale - Translate text
 * @param {Object} normal - iconStyle
 * @param {Object} active - iconStyle
 * @returns {string}
 */
export default ({locale, iconStyle: {normal, active}}) => (`
    <ul class="tui-image-editor-submenu-item">
        <li>
            <div>1. ${locale.localize('image.editor.msg.measure1')}(10mm)</div>
            <div class="tie-measure-baseline-button">
                <div class="tui-image-editor-button baseline">
                    <div>
                        <svg class="svg_ic-submenu">
                            <use xlink:href="${normal.path}#${normal.name}-ic-baseline" class="normal"/>
                            <use xlink:href="${active.path}#${active.name}-ic-baseline" class="active"/>
                        </svg>
                    </div>
                    <label>
                        ${locale.localize('Baseline')}
                    </label>
                </div>
            </div>
        </li>
        <li class="tui-image-editor-partition">
            <div></div>
        </li>
        <li>
            <div>2. ${locale.localize('image.editor.msg.measure2')}</div>
            <div class="tie-measure-line-button">
                <div class="tui-image-editor-button line">
                    <div>
                        <svg class="svg_ic-submenu">
                            <use xlink:href="${normal.path}#${normal.name}-ic-measure-line" class="normal"/>
                            <use xlink:href="${active.path}#${active.name}-ic-measure-line" class="active"/>
                        </svg>
                    </div>
                    <label>
                        ${locale.localize('Line')}
                    </label>
                </div>
            </div>
        </li>
    </ul>
`);
