/**
 * ScreenshotExporter — handles PNG screenshot download.
 */
export class ScreenshotExporter {
    /**
     * @param {Function} getCurrentPresetId - Returns current preset id string
     */
    constructor(getCurrentPresetId) {
        this.getCurrentPresetId = getCurrentPresetId;
    }

    takeScreenshot() {
        const canvas = document.getElementById('scene-canvas');
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `lighting-${this.getCurrentPresetId() || 'studio'}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}
