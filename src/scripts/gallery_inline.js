/**
 * LocalGalleryViewer
 * Copyright (c) 2026 szfzafa
 * AI-assisted development.
 * Licensed under Creative Commons Attribution 3.0 Unported (CC‑BY‑3.0)
 * https://creativecommons.org/licenses/by/3.0/
 */
document.addEventListener('DOMContentLoaded', function () {
    const btnSaveCfg = document.getElementById('btnSaveCfg');
    if(btnSaveCfg){
        btnSaveCfg.addEventListener("click", function () {
            const snap = readOptionsFromDom();
            snap.scaletofit = getRealScaletofit();
            saveUserOptions(snap);
            alert("✅幻灯片配置已保存并实时生效");
        });
    }
});
