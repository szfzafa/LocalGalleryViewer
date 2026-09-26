let taskQueue = [];
let isRunning = false;

self.onmessage = function(e) {
    taskQueue.push(e.data);
    if (!isRunning) {
        processQueue();
    }
};

function processQueue() {
    if (taskQueue.length === 0) {
        isRunning = false;
        return;
    }
    isRunning = true;
    const task = taskQueue.shift();
    
    if (task.type === 'check') {
        checkAnimated(task.rel, task.file).then(result => {
            self.postMessage({
                type: 'checkResult',
                rel: task.rel,
                isAnimated: result.isAnimated,
                error: result.error
            });
            processQueue();
        });
    } else if (task.type === 'decode') {
        decodeBitmap(task.rel, task.file).then(result => {
            if (result.bitmap) {
                self.postMessage({
                    type: 'decodeResult',
                    rel: task.rel,
                    bitmap: result.bitmap,
                    error: false
                }, [result.bitmap]);
            } else {
                self.postMessage({
                    type: 'decodeResult',
                    rel: task.rel,
                    bitmap: null,
                    error: true
                });
            }
            processQueue();
        });
    } else if (task.type === 'clear') {
        taskQueue = [];
        isRunning = false;
    } else {
        processQueue();
    }
}

async function checkAnimated(rel, file) {
    try {
        const ext = file.name.split('.').pop().toLowerCase();
        const header = await file.slice(0, 32).arrayBuffer();
        const view = new Uint8Array(header);
        
        // GIF 动图检测
        if (ext === 'gif') {
            if (view[0] === 0x47 && view[1] === 0x49 && view[2] === 0x46 && view[3] === 0x38) {
                return { isAnimated: true, error: false };
            }
            return { isAnimated: false, error: false };
        }
        
        // PNG 动图检测（APNG）
        if (ext === 'png') {
            if (view[0] === 0x89 && view[1] === 0x50 && view[2] === 0x4E && view[3] === 0x47) {
                // 简单检测acTL块标识
                const fullBuffer = await file.arrayBuffer();
                const fullView = new Uint8Array(fullBuffer);
                for (let i = 8; i < fullView.length - 4; i++) {
                    if (fullView[i] === 0x61 && fullView[i+1] === 0x63 && fullView[i+2] === 0x54 && fullView[i+3] === 0x4C) {
                        return { isAnimated: true, error: false };
                    }
                }
            }
            return { isAnimated: false, error: false };
        }
        
        // WebP 动图检测
        if (ext === 'webp') {
            if (view[0] === 0x52 && view[1] === 0x49 && view[2] === 0x46 && view[3] === 0x46) {
                const fullBuffer = await file.arrayBuffer();
                const fullView = new Uint8Array(fullBuffer);
                for (let i = 12; i < fullView.length - 4; i++) {
                    if ((fullView[i] === 0x41 && fullView[i+1] === 0x4E && fullView[i+2] === 0x49 && fullView[i+3] === 0x4D)
                        || (fullView[i] === 0x41 && fullView[i+1] === 0x4E && fullView[i+2] === 0x4D && fullView[i+3] === 0x46)) {
                        return { isAnimated: true, error: false };
                    }
                }
            }
            return { isAnimated: false, error: false };
        }
        
        // AVIF 动图检测
        if (ext === 'avif') {
            // 简化检测：默认按静态处理，复杂序列检测按需扩展
            return { isAnimated: false, error: false };
        }
        
        // 其余格式默认静态
        return { isAnimated: false, error: false };
    } catch (e) {
        return { isAnimated: false, error: true };
    }
}

async function decodeBitmap(rel, file) {
    try {
        const bitmap = await createImageBitmap(file);
        return { bitmap: bitmap, error: false };
    } catch (e) {
        return { bitmap: null, error: true };
    }
}
