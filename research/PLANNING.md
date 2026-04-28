# Crowsetta — Project Planning

> Master planning document for an Android app that classifies North American
> crow vocalizations into behaviorally meaningful categories.

This file is the index. Detailed material lives in:

- [`TAXONOMY.md`](./TAXONOMY.md) — the seven call types we classify, with citations
- [`DATASETS.md`](./DATASETS.md) — corpus inventory, licensing, assembly recipe
- [`HONEST-LIMITS.md`](./HONEST-LIMITS.md) — what this project does NOT claim

---

## Scope

| Dimension | Decision |
|---|---|
| **Species coverage** | North American crows only — primary American Crow (*Corvus brachyrhynchos*); secondary Fish Crow (*Corvus ossifragus*). Northwestern Crow lumped into American Crow per the 2020 AOS taxonomy update; treat as a regional acoustic variant. |
| **Geographic scope** | Address documented Pacific-vs-continental acoustic differences in American Crow as a regional variant, not a separate class. No further dialect granularity claimed. |
| **Outcome target** | **Stretch goal:** individual-bird ID + multi-call sequence parsing with behavioral context inference. **MVP fallback (acceptable):** is-it-a-crow + classify into 5–8 call categories with calibrated confidence. |
| **UX layering** | Consumer-friendly primary surface (one card, plain-English meaning, calibrated confidence). Optional "Deeper Dive" pane (spectrogram, top-5 probabilities, citations). |
| **Bonus feature** | When call confidence is below the unknown-call threshold, prompt user to record sensor-rich behavioral context (camera, GPS, accelerometer, weather, structured tags) into a versioned JSON observation log. |
| **Inference location** | On-device TFLite (default). Optional opt-in cloud sync for unknown-call observations is a stretch / post-MVP architectural hook. |
| **Class project scale** | 12–14 week semester. Polished and presentable, not production-grade. Starting from zero — no code, no model, no recordings. |

---

## Core architecture decision

A **pretrained bioacoustic embedding model** carries the heavy lifting; a
**small classifier head**, trained on ~500–1,000 hand-labeled crow segments,
maps embeddings to the seven call-type classes. All inference runs on-device.

```
Audio capture → Embedding → Classifier head → Calibration → UI
  AudioRecord    Perch 2.0   2-layer MLP        T-scaling    + deeper-dive
  UNPROCESSED    or BirdNET   7 classes         on held-out
  48 kHz mono    frozen
```

**Why pretrained embeddings.** Ghani, Denton, Kahl & Klinck (2023, *Scientific Reports*) showed that global birdsong embeddings transfer to fine-grained call-type and dialect classification with remarkably small task-specific training sets. The first model trained from scratch on 1,000 crow segments would learn species ID and not much else; the same 1,000 segments fine-tune a small head on a frozen Perch trunk into a usable call-type classifier.

**Embedding backbone choice (Week 3 decision).** Two candidates:

- **BirdNET 2.4 / BirdNET-Lite** — already TFLite-ready, well-documented training pipeline (`birdnet_analyzer.train --i train_data/ --o checkpoints/`), license CC-BY-NC-SA 4.0 (fine for class project, not for commercial Play Store). Path of least resistance.
- **Perch 2.0** (van Merriënboer, Dumoulin, Hamer, Harrell, Burns & Denton, 2025; arXiv:2508.04665) — better embeddings on call-type and dialect tasks per the model card's own evaluations; weights on Hugging Face (`cgeorgiaw/Perch`) and Kaggle Models. ~12M-parameter EfficientNet-B3 trunk. More permissive license. Slightly more integration work to ship on Android.

Recommended approach: train both in Phase 1, benchmark on the held-out validation set, pick the winner.

---

## Build phases

| Phase | Weeks | Output |
|---|---|---|
| 1. Data assembly + baseline classifier | 1–3 | Hand-labeled ~500–1,000 segments. BirdNET-Analyzer custom head + Perch 2.0 + logistic regression baselines. Pick winner. |
| 2. Model export | 4 | TFLite int8. Held-out validation including geographic holdout. Calibration parameters. |
| 3. Android skeleton | 5–7 | Kotlin · Jetpack Compose · TFLite Interpreter. "Press button → see top-3 with calibrated confidence" loop. |
| 4. Dual-layer UI | 8–9 | Consumer card + Deeper Dive pane (spectrogram, top-5 bars, citations). |
| 5. Observation capture | 10–11 | CameraX, FusedLocationProvider, SensorManager, Open-Meteo. Versioned JSON schema. Local-only by default. |
| 6. Calibration + demo | 12 | Threshold tuning. Project report. Demo recordings. |
| Stretch (post-MVP) | — | Sequence parsing (BiGRU over per-caw embeddings); individual ID (contrastive head, "matches your local roost"). |

Honest assessment: the species + 7-call-type classifier with calibrated
confidence is achievable. Multi-call sequence parsing and individual ID are
research-grade and unlikely in one semester. See [`HONEST-LIMITS.md`](./HONEST-LIMITS.md).

---

## Confidence calibration UX

Calibrate the model's softmax output into approximate probabilities using
**temperature scaling** (Guo et al. 2017) or **isotonic regression** on the
held-out set. Then map calibrated probability to a 5-step confidence label:

| Calibrated probability | Display | Behavior |
|---|---|---|
| ≥ 0.70 | **Most likely:** *X* | High-confidence styling. Top-1 only. |
| 0.45–0.70 | **Possibly:** *X* | Show second-best alternative below. |
| 0.25–0.45 | **Uncertain — could be X or Y** | Both top-2 visible. Suggest recording more audio. |
| < 0.25, or top-2 within 0.05 | **Unknown** | Trigger behavioral observation flow. |

Tune thresholds on the held-out set so precision at "Most likely" is ≥ 80%.

Reference: Wood et al. (2024), "Guidelines for appropriate use of BirdNET scores and other detector outputs," *Journal of Ornithology* — explicitly warns that raw BirdNET softmax outputs **are not probabilities** and require species-specific calibration.

---

## Observation schema (Phase 5)

Every "unknown call" event captures a versioned JSON record:

```
observation_id, created_at, app_version, model_version
audio: { primary_clip_uri, sample_rate_hz, duration_s, format,
         predicted_top5: [{label, probability}], triggered_unknown,
         embedding (optional Perch/BirdNET vector) }
location (if granted): { precision: fine|coarse|withheld,
                         lat, lon, accuracy_m, altitude_m }
environment: { ambient_db, ambient_audio_tags (YAMNet),
               weather (Open-Meteo), sun_position, day_night }
sensors: { accel_summary: {motion_class}, heading_deg, light_lux }
media: { photo_uris, video_uri }
user_input: { free_text, structured_tags, number_of_crows,
              perceived_target, caller_age_class }
quality_flags: { user_confident, visual_id_confirmed }
```

Structured-tag set drawn from McGowan/Marzluff descriptive vocabulary:
*perched · in flight · ground foraging · mobbing · near nest · near food
source · near roost · alone · with mate · with family group · with mixed
flock · near person · near predator · vocalizing toward sky · vocalizing
toward ground · urban · suburban · rural · forest · coast · agricultural*.

---

## Starter checklist

**Pending decisions** (decide as the project unfolds):
- BirdNET vs. Perch — decide Week 3 from baseline benchmark
- Final taxonomy: 7-class default (recommended) vs. simpler 5-class for higher per-class accuracy — decide after Phase 1
- Real-time streaming vs. record-then-analyze — start record-then-analyze
- Sequence parsing and individual ID — explicitly stretch
- Whether to publish manual call-type labels as a public dataset (recommended; this is the project's most defensible scientific contribution)

**Accounts** (all free unless noted):
- GitHub · Cornell Lab account (for eBird + Macaulay Library) · eBird API key · Xeno-canto account + v3 API key · Kaggle (for BirdCLEF) · Hugging Face (for Perch weights) · optional Google Play Console ($25) · optional Firebase

**Hardware**:
- Android dev device, API 30+. Two devices of different OEMs strongly recommended for cross-mic testing.
- Laptop / Colab Pro for training. Logistic regression on embeddings runs fine on Colab Free.
- **Optional**: external USB-C lavalier or shotgun mic ($80–250) for higher-quality field recording.

**Approximate cost**: $0–60 baseline. ~$200–350 with paid extras (Bird Academy course, Colab Pro, Play Console, external mic).

---

## Source material (partial — see site for full bibliography)

**The science:**
- Verbeek, Caffrey, Clark, McGowan & Pyle (2024) — *Birds of the World* American Crow account, v1.2
- McGowan (2020) — *Birds of the World* Fish Crow account
- Mates, Tarter, Ha, Clark & McGowan (2015) — caws encode sex, identity, behavioural context, *Bioacoustics* 24:63–80 (PMC4237024)
- Pendergraft & Marzluff (2019) — fussing over food, *Animal Behaviour* 150:39–57
- Pendergraft, Marzluff, Cross, Shimizu & Templeton (2021) — FDG-PET corvid brain activity (PMC8637333)
- Richards & Thompson (1978) — assembly call structural properties, *Behaviour* 64:184–203
- Stowell, Morfi & Gill (2018) — corvid individual ID, arXiv:1603.07236
- Kaeli Swift — *corvidresearch.blog*

**The models:**
- Perch 2.0: van Merriënboer et al. (2025), arXiv:2508.04665
- BirdNET / BirdNET-Lite: Kahl, Wood, Eibl & Klinck, Cornell K. Lisa Yang Center / Chemnitz
- Ghani, Denton, Kahl & Klinck (2023), "Global birdsong embeddings enable superior transfer learning for bioacoustic classification," *Scientific Reports* 13 (PMC10739890; arXiv:2307.06292)
- whoBIRD — open-source Android reference architecture (github.com/woheller69/whoBIRD-TFlite)

**The audio corpora:** Macaulay Library · Xeno-canto · BirdCLEF (Kahl et al., LifeCLEF 2021–2023) · iNaturalist · FSD50K / AudioSet (negative mining)

**Key researchers and labs:** Kevin J. McGowan (Cornell) · John M. Marzluff (UW) · Loma Pendergraft (Marzluff lab) · Anne B. Clark (Binghamton) · Kaeli Swift · Carolee Caffrey · Holger Klinck / Stefan Kahl (BirdNET) · Tom Denton / Vincent Dumoulin (Perch).
