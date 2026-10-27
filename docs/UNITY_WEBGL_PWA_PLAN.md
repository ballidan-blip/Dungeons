# Unity WebGL + installable PWA feasibility plan

## Goal

Use this Unity project as the playable version of The Systemic Depths for now. Keep the Unity project and its scenes, animations, lighting and gameplay as the source of truth. Export a browser build and wrap it as an installable Progressive Web App (PWA). Do not replace the game with the Phaser prototype.

## What the repository currently tells us

- Unity editor version: **2022.3.39f1** (`ProjectSettings/ProjectVersion.txt`).
- Render pipeline package: **Universal Render Pipeline 14.0.11** (`Packages/manifest.json`).
- Cinemachine 2.10.5, TextMeshPro, Timeline, UGUI, Visual Scripting and R3 are listed in the package manifest.
- `ProjectSettings/EditorBuildSettings.asset` currently marks `Assets/Scenes/Game 1.unity` enabled, while `Assets/Scenes/Game.unity` and `Assets/Scenes/SampleScene.unity` are disabled.
- The repository README calls the project messy and describes SPECTRE as a working title.
- The project was previously identified as a fork of `ICD-ICD/BEACON`. Do not assume that all inherited assets or code can be redistributed until licensing is checked.
- No WebGL build artifact or working hosted browser build has been verified in this audit.

## Recommended architecture

1. **Keep Unity as the game engine.** Make the smallest changes needed for WebGL and touch input. Do not port the Unity game to Phaser just to get a browser version.
2. **Create a dedicated WebGL build profile.** Use a Unity WebGL build target, choose the intended playable scene explicitly, and test the build locally before publishing.
3. **Make a mobile-friendly Unity player.** Add on-screen touch controls if the current character controller expects keyboard/mouse input; support touch interaction for menus and combat; use a responsive canvas and safe mobile aspect ratio; handle pause/resume when the tab is backgrounded.
4. **Tune for browser constraints.** Start with URP and conservative quality, capped rendering resolution and limited real-time shadows. Inspect scripts/plugins for native-only APIs, filesystem assumptions, threads, unsupported graphics features and external dependencies. Measure download size, memory and load time on a phone.
5. **Add a small PWA shell** around the exported build: responsive `index.html`, loading/progress UI, `manifest.webmanifest`, icons, HTTPS hosting and a service worker with deliberate versioned caching. Avoid cache-all rules: large `.data` and WebAssembly files can consume substantial storage, and stale build files must not mix with a new release.
6. **Deploy the wrapper and WebGL output together** to static hosting. GitHub Pages may work, but Unity compression and MIME behaviour must be configured and verified. If response headers are difficult to control, use a static host that supports them.
7. **Test on the actual target phone** over HTTPS: first and repeat load, install/add-to-home-screen, portrait/landscape, touch controls, suspend/resume, sound, scene transitions and cache updates.

## Immediate checks before exporting

- Open the enabled `Game 1.unity` scene in Unity 2022.3.39f1 and confirm it is a real, loadable scene. The GitHub file fetch returned no scene text for this path, so its validity has **not** been established here.
- Inspect the enabled scene's player, camera, input system, UI, prefabs and script references.
- Check `ProjectSettings/ProjectSettings.asset` for active input handling, scripting backend, WebGL memory/compression settings and colour space.
- Check the selected URP asset and quality settings for WebGL-compatible rendering.
- Check project and asset licences before publishing a public build.
- Build WebGL from Unity itself or a controlled CI runner with the correct Unity version and licence. A GitHub connection alone cannot produce a trustworthy build unless a suitable Unity build runner is configured.

## Acceptance criteria for “working PWA”

- The actual Unity game—not a screenshot or mock—loads over HTTPS in a mobile browser.
- The player can move and interact using touch controls.
- No fatal WebGL console errors or missing scene/assets.
- A user can add it to the home screen and launch in standalone mode on supported browsers.
- Repeat launch works; offline launch is only claimed if all required game files are cached and the tested game supports offline operation.
- A new release updates without stale cached Unity files.
- Tested on the target phone and one desktop browser.

## Important limitation

This document is an implementation plan based on source-repository inspection. No Unity editor build, WebGL export, mobile-device test, or deployment was performed as part of this audit. Do not describe the game as browser-ready until those checks pass.
