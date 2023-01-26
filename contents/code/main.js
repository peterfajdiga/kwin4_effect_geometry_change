"use strict";

class GeometryChangeEffect {
    constructor() {
        effect.configChanged.connect(this.loadConfig.bind(this));
        effects.windowFrameGeometryChanged.connect(
            this.onWindowFrameGeometryChanged.bind(this),
        );
        effects.windowStartUserMovedResized.connect(
            this.onWindowStartUserMovedResized.bind(this),
        );
        effects.windowFinishUserMovedResized.connect(
            this.onWindowFinishUserMovedResized.bind(this),
        );

        this.loadConfig();
    }

    loadConfig() {
        this.duration = animationTime(317);
    }

    onWindowFrameGeometryChanged(window, oldGeometry) {
        if (!window.onCurrentDesktop) {
            return;
        }

        if (window.move || window.resize || this.userResizing || window.minimized) {
            return;
        }

        if (!(window.normalWindow || window.dialog || window.modal)) {
            return;
        }

        if (window.windowClass === "krunner krunner") {
            return;
        }

        const newGeometry = window.geometry;
        const xDelta = newGeometry.x - oldGeometry.x;
        const yDelta = newGeometry.y - oldGeometry.y;
        const widthDelta = newGeometry.width - oldGeometry.width;
        const heightDelta = newGeometry.height - oldGeometry.height;
        const widthRatio = oldGeometry.width / newGeometry.width;
        const heightRatio = oldGeometry.height / newGeometry.height;

        animate({
            window: window,
            duration: this.duration,
            curve: QEasingCurve.OutExpo,
            animations: [
                {
                    type: Effect.Translation,
                    from: {
                        value1: -xDelta - widthDelta / 2,
                        value2: -yDelta - heightDelta / 2,
                    },
                    to: {
                        value1: 0,
                        value2: 0,
                    },
                },
                {
                    type: Effect.Scale,
                    from: {
                        value1: widthRatio,
                        value2: heightRatio,
                    },
                    to: {
                        value1: 1,
                        value2: 1,
                    },
                },
            ],
        });
    }

    onWindowStartUserMovedResized(window) {
        this.userResizing = true;
    }

    onWindowFinishUserMovedResized(window) {
        this.userResizing = false;
    }
}

new GeometryChangeEffect();
