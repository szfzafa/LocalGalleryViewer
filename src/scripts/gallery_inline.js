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
