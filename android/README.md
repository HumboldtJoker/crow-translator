# Android App

Kotlin + Jetpack Compose app that captures audio, runs the exported TFLite
classifier on-device, and surfaces the dual-layer UI (consumer card +
deeper-dive pane) plus the unknown-call observation flow.

## Status

**Scaffold-only.** No code in this directory yet — Phase 3 of the build plan
([`../research/PLANNING.md`](../research/PLANNING.md), weeks 5–7) populates
this folder with an Android Studio project.

## Stack (planned)

- **Kotlin** + **Jetpack Compose** + **Material 3**
- **TensorFlow Lite** (or **MediaPipe Audio Classifier task**) for inference
- **AudioRecord** with `MediaRecorder.AudioSource.UNPROCESSED`, 48 kHz mono 16-bit PCM, 3-second rolling window
- **CameraX** + **FusedLocationProvider** + **SensorManager** + **Open-Meteo** for the Phase 5 observation capture flow
- **Room** (SQLite) for local observation storage; opt-in cloud sync stub
- **Min SDK:** API 30 (Android 11) so we can reliably use `UNPROCESSED`

## Reference architecture

Read **whoBIRD** ([github.com/woheller69/whoBIRD-TFlite](https://github.com/woheller69/whoBIRD-TFlite))
as a working open-source pattern of microphone → 3-second buffer → TFLite
inference → result UI. License-compatible to study; do not lift the UI
verbatim.

## Required permissions (runtime)

- `RECORD_AUDIO` — required, primary feature
- `ACCESS_COARSE_LOCATION` — optional, for the observation capture flow
- `ACCESS_FINE_LOCATION` — optional, user choice
- `CAMERA` — optional, for photo/video capture in observations

Always provide audio-only fallback paths; never crash on permission denial.

## Model bundling

- The exported TFLite from `../ml/models/crowsetta-v0.1.tflite` ships in `app/src/main/assets/`
- Calibration parameters from `../ml/models/calibration.json` ship alongside
- Class label list from `../research/TAXONOMY.md` is mirrored as a small JSON resource
