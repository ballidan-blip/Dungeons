# Unity WebGL + installable PWA feasibility plan

## Goal

Use this Unity project as the playable version of The Systemic Depths for now. Keep the Unity project and its scenes, animations, lighting and gameplay as the source of truth. Export a browser build and wrap it as an installable Progressive Web App (PWA). Do not replace the game with the Phaser prototype.

## Current findings

- Unity editor version: **2022.3.39f1** (`ProjectSettings/ProjectVersion.txt`).
- Render pipeline: **Universal Render Pipeline 14.0.11** (`Packages/manifest.json`). Cinemachine 2.10.5, TextMeshPro, Timeline, UGUI, Visual Scripting and R3 are also listed.
- `ProjectSettings/EditorBuildSettings.asset` marks `Assets/Scenes/Game 1.unity` enabled; `Assets/Scenes/Game.unity` and `Assets/Scenes/SampleScene.unity` are disabled.
- **Critical scene-file blocker:** fetching `Assets/Scenes/Game 1.unity` from GitHub returns an empty content string, even though its `.meta` file exists and build settings enable it. This may be an empty/zero-byte scene or a repository/API issue; it is not safe to assume it is buildable until checked in a local checkout or Unity Editor. `Assets/Scenes/Game.unity` contains serialized scene data, but it is currently disabled for builds. Do not silently switch the build to it without confirming it is the intended playable scene.
- The repository README describes the assets as messy and calls SPECTRE a working title.
- The project was previously identified as a fork of `ICD-ICD/BEACON`. Do not assume inherited code/assets can be redistributed until licensing is checked.
- No WebGL build artifact or working hosted browser build has been verified.

## Implementation sequence

1. **Resolve the scene blocker first.** Open a local checkout in Unity 2022.3.39f1. Check whether `Assets/Scenes/Game 1.unity` is truly empty, inspect Console errors, and identify which scene contains the intended playable character, camera, UI and gameplay. Preserve a backup before correcting build-scene settings.
2. **Make a desktop WebGL build.** Select only the confirmed playable scene in Build Settings and export WebGL. Resolve compile errors, unsupported APIs, missing assets and URP issues before adding the PWA layer.
3. **Add mobile input.** If gameplay expects keyboard/mouse, add touch controls in Unity (virtual joystick plus contextual action buttons); support touch UI, responsive framing, and pause/resume when the browser tab is backgrounded.
4. **Tune browser performance.** Start with conservative URP quality, limited real-time shadows and a capped render resolution. Inspect scripts/plugins for native-only APIs, filesystem assumptions, threads, unsupported graphics features and external dependencies. Measure initial download, memory and load time on the target phone.
5. **Wrap the exported build as a PWA.** Add responsive `index.html`, loading/progress UI, `manifest.webmanifest`, app icons, HTTPS hosting and a versioned service worker. Cache the shell and the exact build files deliberately; avoid cache-all rules and never mix stale `.data`, JavaScript and WebAssembly files across releases.
6. **Deploy together.** GitHub Pages can serve static output, but Unity compression and MIME behaviour must be verified. If response headers are difficult to configure, use static hosting that supports them.
7. **Test on a real phone** over HTTPS: first/repeat load, add-to-home-screen, portrait/landscape, touch controls, suspend/resume, audio, scene transitions, cache invalidation and update flow.

## Build runner requirements

A GitHub source connection cannot run the Unity Editor by itself. Building in CI requires a compatible Unity runner, the exact editor version, WebGL module, dependency access and a properly configured Unity licence. Do not add a workflow that claims success without these prerequisites. If the local Unity Editor is available, the fastest first proof is a local WebGL build; CI automation can follow once the scene and build settings are known-good.

## Acceptance criteria

- The actual Unity game—not a screenshot or mock—loads over HTTPS in a mobile browser.
- The player can move and interact using touch controls.
- No fatal WebGL console errors or missing scene/assets.
- Add-to-home-screen and standalone launch work on supported browsers.
- Offline launch is only claimed if all required game files are cached and the tested game supports offline operation.
- New releases update without stale cached Unity files.
- Tested on the target phone and one desktop browser.

## Status

This is a source-repository audit and implementation plan. No Unity Editor build, WebGL export, mobile-device test or deployment has been performed. The next concrete action is to validate/fix the enabled scene in a local Unity Editor; the WebGL/PWA work depends on that result.
