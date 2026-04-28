# ML Pipeline

Python pipeline for assembling the dataset, training the call-type classifier
head on top of frozen Perch 2.0 or BirdNET 2.4 embeddings, and exporting to
TFLite int8 for on-device inference.

## Layout

```
ml/
├── notebooks/   → Jupyter / Colab notebooks for exploration & training experiments
├── scripts/     → reproducible Python scripts (data pull, label, train, export)
├── models/      → trained classifier heads + exported .tflite (gitignored)
└── requirements.txt
```

## Phase-by-phase scripts (to implement)

| Phase | Script | Output |
|---|---|---|
| 1a | `scripts/pull_xeno_canto.py` | `data/raw/{amecro,fiscro,...}/*.{mp3,wav}` + per-recording metadata JSON |
| 1b | `scripts/segment_for_labeling.py` | `data/segments/*.wav` (3-second windows) + a labeling-ready CSV |
| 1c | (manual labeling in Audacity / Raven Lite) | `data/labels.csv` |
| 1d | `scripts/embed.py` | `data/embeddings.npz` (Perch 2.0 or BirdNET embeddings) |
| 1e | `scripts/train_head.py` | `ml/models/head.pkl` (sklearn) or `ml/models/head.pt` (torch) |
| 2  | `scripts/export_tflite.py` | `ml/models/crowsetta-v0.1.tflite` |
| 2  | `scripts/calibrate.py` | `ml/models/calibration.json` (temperature or isotonic params) |
| 2  | `scripts/evaluate.py` | per-class confusion matrix + held-out metrics |

## Setup

```bash
cd ml/
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Notes

- Use Perch 2.0 from Hugging Face (`cgeorgiaw/Perch`) or BirdNET-Lite from `birdnet_analyzer`. Pick the winner empirically in Phase 1.
- See [`../research/PLANNING.md`](../research/PLANNING.md) for the full architecture rationale.
- See [`../research/TAXONOMY.md`](../research/TAXONOMY.md) for the seven classes.
- See [`../research/DATASETS.md`](../research/DATASETS.md) for the data assembly recipe.
