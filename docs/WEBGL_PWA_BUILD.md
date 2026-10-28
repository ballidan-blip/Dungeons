# Unity WebGL + PWA build workflow

This repository now contains a custom responsive WebGL template and a manual/automatic GitHub Actions build workflow.

## What is included

- `Assets/WebGLTemplates/DungeonsPWA/`: responsive Unity WebGL page, PWA manifest, SVG app icon, and conservative service worker.
- `.github/workflows/unity-webgl.yml`: validates enabled scenes, selects the custom template for the CI run, builds using Unity 2022.3.39f1, and uploads the result as the `dungeons-webgl-pwa` workflow artifact.
- The service worker caches only the app shell. It deliberately does not cache Unity's version-coupled data/framework/WASM files, so offline gameplay is not claimed.

## Required GitHub Actions configuration

Before a build can pass the Unity license step, configure repository Actions secrets supported by GameCI:

- `UNITY_LICENSE`: Unity Personal/Pro/Enterprise license content accepted by GameCI.
- `UNITY_EMAIL` and `UNITY_PASSWORD`: only if required by the license activation flow for the account/license type.

Do not commit license files, passwords, or activation credentials.

## Run a build

1. Open the repository's **Actions** tab.
2. Select **Unity WebGL build**.
3. Choose **Run workflow** on the branch being tested.
4. Inspect the first failed step. The scene validation step intentionally stops if an enabled build scene is absent or empty.
5. When all steps pass, download the `dungeons-webgl-pwa` artifact from the run.

## Current known risk

`ProjectSettings/EditorBuildSettings.asset` enables `Assets/Scenes/Game 1.unity`. The GitHub Contents API returns an empty blob for that path (same blob SHA in the fork and parent repository), so the workflow checks the actual checkout's file size and fails explicitly if it is empty. Do not switch to `Game.unity` just to make the build pass; first verify that it is the intended playable scene.

## Deployment is a separate step

The workflow uploads an artifact only; it does not publish to a public website. Before deployment, test the artifact, confirm Unity's compression/MIME requirements for the chosen host, and test on a real phone. GitHub Pages may require Unity's decompression fallback or a host with configurable response headers depending on the WebGL compression setting.
