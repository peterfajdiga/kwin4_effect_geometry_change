"use strict";

class GeometryChangeEffect {
    constructor() {
        effect.configChanged.connect(this.loadConfig.bind(this));
        effect.animationEnded.connect(this.restoreForceBlurState.bind(this));

        effects.windowAdded.connect(this.manage.bind(this));
        for (const window of effects.stackingOrder) {
            this.manage(window);
        }

        this.loadConfig();
    }

    loadConfig() {
        const duration = effect.readConfig("Duration", 250);
        this.duration = animationTime(duration);
        this.excludedWindowClasses = effect.readConfig("ExcludedWindowClasses", "krunner,yakuake").split(",");
    }

    manage(window) {
        window.geometryChangeCreatedTime = Date.now();
        window.windowFrameGeometryChanged.connect(
            this.onWindowFrameGeometryChanged.bind(this),
        );
        window.windowStartUserMovedResized.connect(
            this.onWindowStartUserMovedResized.bind(this),
        );
        window.windowFinishUserMovedResized.connect(
            this.onWindowFinishUserMovedResized.bind(this),
        );
    }

    restoreForceBlurState(window) {
        window.geometryChangeAnimationInstances--;
        if (window.geometryChangeAnimationInstances === 0) {
            window.setData(Effect.WindowForceBlurRole, null);
        }
    }

    isWindowClassExluded(windowClass) {
        for (const c of windowClass.split(" ")) {
            if (this.excludedWindowClasses.includes(c)) {
                return true;
            }
        }
        return false;
    }

    onWindowFrameGeometryChanged(window, oldGeometry) {
        if (!window.onCurrentDesktop) {
            return;
        }

        if (window.move || window.resize || this.userResizing || window.minimized || !window.managed) {
            return;
        }

        if (!(window.normalWindow || window.dialog || window.modal)) {
            return;
        }

        if (this.isWindowClassExluded(window.windowClass)) {
            return;
        }

        const windowAgeMs = Date.now() - window.geometryChangeCreatedTime;
        if(windowAgeMs < 10) {
            // Some windows are moved or resized immediately after being created. We don't want to animate that.
            return;
        }

        const newGeometry = window.geometry;
        const xDelta = newGeometry.x - oldGeometry.x;
        const yDelta = newGeometry.y - oldGeometry.y;
        const widthDelta = newGeometry.width - oldGeometry.width;
        const heightDelta = newGeometry.height - oldGeometry.height;
        const widthRatio = oldGeometry.width / newGeometry.width;
        const heightRatio = oldGeometry.height / newGeometry.height;

        const animations = [
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
        ];

        if (window.geometryChangeAnimationInstances === undefined) {
            window.geometryChangeAnimationInstances = 0;
        }
        window.geometryChangeAnimationInstances += animations.length;
        window.setData(Effect.WindowForceBlurRole, true);

        animate({
            window: window,
            duration: this.duration,
            curve: QEasingCurve.OutExpo,
            animations: animations,
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
