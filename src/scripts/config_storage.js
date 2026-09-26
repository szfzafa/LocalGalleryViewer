/**
 * 公共配置持久化模块，gallery.html 使用
 * 注意：optscaletofit(scaletofit)：真值存在$.fn.superbgimage.options.scaletofit
 * syncScaleToFitUi：仅根据内存值同步UI，不执行业务跳转逻辑
 */

// !!! 必须和 super_init.js $.fn.superbgimage.options 出厂默认完全对齐
const DEFAULT_USER_OPT = {
    transition: "1",
    optspeed: "slow",
    optinterval: 5000,
    opttransout: true,
    optrandomtrans: false,
    optrandom: false,
    optclick: true,
    scaletofit: 2,
    initposition: "1",
    initdirection: "0",
    fpsinterval: 7,
    xspeed: 0.008,
    yspeed: 1.0
};

/** 读取本地存储，返回合并后的配置对象 */
function loadUserOptions() {
    let raw = localStorage.getItem("LocalGalleryViewer_options");
    let cfg = { ...DEFAULT_USER_OPT };
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            Object.assign(cfg, parsed);
        } catch (e) {
            // JSON损坏，使用出厂默认
        }
    }
    return cfg;
}

/** 将配置对象写入 localStorage持久层 */
function saveUserOptions(cfg) {
    localStorage.setItem("LocalGalleryViewer_options", JSON.stringify(cfg));
}

/**
 * 【独立工具：仅同步scale images to fit复选框UI，只读内存，不修改业务数据，不触发流转逻辑】
 * 映射：0→不勾选 不透明；1→勾选半透明；2→勾选完全不透明
 */
// function syncScaleToFitUi(){
    // if(!$.fn || !$.fn.superbgimage || !$.fn.superbgimage.options) return;
    // const val = Number($.fn.superbgimage.options.scaletofit);
    // const $cb = $('input[name="optscaletofit"]');
    // if($cb.length ===0) return;

    // if(val === 0){
        // $cb.prop('checked', false).css('opacity',1);
    // }else if(val ===1){
        // $cb.prop('checked', true).css('opacity',0.5);
    // }else if(val ===2){
        // $cb.prop('checked', true).css('opacity',1);
    // }
// }

/**
 * 将配置对象回填DOM表单 #options
 * ⚠️ 跳过 optscaletofit input！UI同步交给 syncScaleToFitUi()
 * @param {Object} cfg
 */
function fillOptionsToDom(cfg) {
    const root = document.querySelector("#options");
    if (!root) return;

    // select
    root.querySelector('select[name="transition"]').value = cfg.transition;
    root.querySelector('select[name="initposition"]').value = cfg.initposition;
    root.querySelector('select[name="initdirection"]').value = cfg.initdirection;

    // text input
    root.querySelector('input[name="optspeed"]').value = cfg.optspeed;
    root.querySelector('input[name="optinterval"]').value = cfg.optinterval;
    root.querySelector('input[name="fpsinterval"]').value = cfg.fpsinterval;
    root.querySelector('input[name="xspeed"]').value = cfg.xspeed;
    root.querySelector('input[name="yspeed"]').value = cfg.yspeed;

    // 普通二态checkbox
    root.querySelector('input[name="opttransout"]').checked = !!cfg.opttransout;
    root.querySelector('input[name="optrandomtrans"]').checked = !!cfg.optrandomtrans;
    root.querySelector('input[name="optrandom"]').checked = !!cfg.optrandom;
    root.querySelector('input[name="optclick"]').checked = !!cfg.optclick;

    // ======== scaletofit DOM完全跳过，由 syncScaleToFitUi 单独处理 ========
}

/**
 * 读取 #options DOM表单快照
 * ⚠️ scaletofit 不从DOM读取！调用方手动从 $.fn.superbgimage.options.scaletofit 赋值
 */
function readOptionsFromDom() {
    const root = document.querySelector("#options");
    if (!root) return { ...DEFAULT_USER_OPT };

    return {
        transition: root.querySelector('select[name="transition"]').value,
        optspeed: root.querySelector('input[name="optspeed"]').value,
        optinterval: Number(root.querySelector('input[name="optinterval"]').value),
        opttransout: root.querySelector('input[name="opttransout"]').checked,
        optrandomtrans: root.querySelector('input[name="optrandomtrans"]').checked,
        optrandom: root.querySelector('input[name="optrandom"]').checked,
        optclick: root.querySelector('input[name="optclick"]').checked,
        // optscaletofit不从DOM拿
        initposition: root.querySelector('select[name="initposition"]').value,
        initdirection: root.querySelector('select[name="initdirection"]').value,
        fpsinterval: Number(root.querySelector('input[name="fpsinterval"]').value),
        xspeed: Number(root.querySelector('input[name="xspeed"]').value),
        yspeed: Number(root.querySelector('input[name="yspeed"]').value)
    };
}
