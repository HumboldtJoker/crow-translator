# Audio Corpora & Dataset Assembly

> Where to get labeled North American crow audio, what each source's labels
> are good for, and a concrete recipe for assembling a working training
> dataset for the MVP classifier.

---

## Source-by-source

### Macaulay Library (Cornell Lab of Ornithology)

- **Scope:** thousands of American Crow recordings, hundreds of Fish Crow recordings. Region tags are reliable; call-type/context tags exist but are inconsistent.
- **Licensing:** Contributors retain copyright; ML cannot resell media. Free viewing/listening on the web. Bulk download for non-owners is generally not enabled. Cornell distinguishes (a) *research and some educational uses* (free, by request via the media-request team) from (b) *commercial uses and some educational uses* (license required).
- **Practical access:** Browse at `media.ebird.org`. For class-project bulk access, **email the Macaulay Library media team** with a project description, educational/non-commercial framing, and the specific assets needed; expect manual fulfillment.
- **Citation format:** `ML#NNNNNNN, Macaulay Library, Cornell Lab of Ornithology, recordist X.`

### Xeno-canto

- **Scope:** ~700+ American Crow and ~150+ Fish Crow recordings as of early 2026. Metadata: country, locality, recordist, quality (A–E), and a free-text `type` field — the **single most valuable label source for call types** outside of manual re-labeling. Type values include "call," "alarm call," "begging call," "rattle," "song."
- **Licensing:** Per-recording Creative Commons. Common variants: CC-BY-NC-SA 4.0, CC-BY-SA 4.0, CC-BY-NC-ND 4.0, occasional CC0. **Filter out `-ND`** for training because clipping is a derivative work.
- **API:** v3 RESTful JSON at `https://xeno-canto.org/api/3/recordings?query=...&key=YOUR_KEY`. Free key from your XC profile. Search syntax: `gen:`, `sp:`, `cnt:`, `loc:`, `q:`, `type:`. Example:
  ```
  query=gen:Corvus+sp:brachyrhynchos+cnt:United+States+q:>:C&per_page=500
  ```
- **Polite use:** XC asks heavy users to email the contact address for bulk transfers. A few thousand crow files via normal API usage is fine. The community wrapper `xeno-canto-py` (PyPI) handles concurrency cleanly.

### iNaturalist

- **Scope:** Audio is supported but a small fraction of bird observations. Crow audio observations exist but are limited and rarely have call-type labels.
- **Use:** Supplementary species-verification material; not primary training data.

### BirdCLEF / Kaggle

- **Datasets:** BirdCLEF 2021, 2022, 2023 (LifeCLEF; Kahl et al.) — derived primarily from Xeno-canto, downsampled to 32 kHz OGG, organized as `train_audio/<species_code>/*.ogg`. Includes `amecro` and `fiscro`. BirdCLEF 2024 was Western-Ghats-focused so prior years have richer NA coverage.
- **Licensing:** Locked behind each Kaggle competition page; sign in, accept rules, then competition-research-use terms apply.
- **Label granularity:** Species-only. Quality rating (0.0–5.0) and `secondary_labels` provided. **No call-type labels.**
- **Use:** Bulk species-positive examples plus negative-mining material (other species in soundscapes).

### AudioSet / FSD50K

- **AudioSet (Google):** "Crow" ontology label `/m/0h0rv`, ~tens of thousands of YouTube clips with weak labels. Quality varies; many are non-NA corvids, reverse-recorded, or noisy.
- **FSD50K:** Small "Crow" leaf class. Similar caveats.
- **ESC-50:** No dedicated crow class.
- **Use:** Negative mining ("is it a crow vs. is it not"), pretraining noise robustness. Not call-type labeling.
- **Note:** Perch 2.0 was trained on a corpus including Xeno-canto, iNaturalist, Animal Sound Archive, and FSD50K — its embeddings already "know about" crows.

### Specialized corvid datasets

The Mates et al. (2015) Ithaca caw dataset (1,674 hand-curated caws from
banded individuals) is **not publicly released**. Same for Pendergraft &
Marzluff datasets. **Recommendation:** politely email the relevant lab PIs
explaining the class-project scope; corvid researchers tend to be unusually
responsive and may share spectrograms or pointers.

### eBird audio

eBird audio is the contributor pipeline that *populates* Macaulay Library — same data, same license framework. Useful for filtering by location/date.

---

## Practical assembly recipe for the MVP

Total expected effort: **8–15 hours of manual re-labeling** on top of automated pulls.

### Step 1: Bulk species-positive audio (1–2 hours)

```bash
# Pseudocode — see ml/scripts/ when implemented
xeno-canto-py pull --gen Corvus --sp brachyrhynchos --cnt "United States" --q ">:C" --license "!nd" --out data/raw/amecro/
xeno-canto-py pull --gen Corvus --sp ossifragus    --cnt "United States" --q ">:C" --license "!nd" --out data/raw/fiscro/
# Augment with BirdCLEF 2022 + 2023 amecro/fiscro splits (manual Kaggle download)
cp -r ~/Downloads/birdclef-2022/train_audio/amecro/* data/raw/amecro/
cp -r ~/Downloads/birdclef-2023/train_audio/amecro/* data/raw/amecro/
# (same for fiscro)
```

Expected: ~600–900 American Crow clips, ~100–180 Fish Crow clips, mostly 5–60 seconds each.

### Step 2: Negative training audio (1 hour)

Pull a sample of co-occurring corvids (Common Raven `comrav`, Steller's Jay `stejay`, Blue Jay `blujay`) and a small random sample of other North American songbirds and urban noise (FSD50K human voices, traffic, dogs).

### Step 3: Manual call-type labeling — **the bottleneck** (8–15 hours)

Open each XC clip in Audacity or Raven Lite. Use the protocol in [`TAXONOMY.md`](./TAXONOMY.md). The XC `type` field gives a head start ("alarm call," "begging call," "rattle") but is sparse and inconsistent — expect to re-listen and confirm.

Output: a `labels.csv` with rows of `recording_id`, `start_s`, `end_s`, `class`, `region`, `caller_age_class`, `quality`, `labeler_initials`, `confidence`.

Target: **500–1,000 labeled 3-second segments** spread across the 7 classes.

### Step 4: Macaulay Library targeted supplement (2–3 hours)

Once your taxonomy is set and you've identified gaps, request a small targeted research package from ML for examples missing in XC (e.g., "Pacific vocal type" exemplars, juvenile begging exemplars, female rattle exemplars).

### Step 5: Held-out validation set

Reserve 50–100 fully-held-out manually-verified clips that are never seen during model selection. Include a geographic holdout: train on East-coast, validate on West-coast Pacific-vocal-type clips. This catches the regional-overfit failure mode early.

---

## Licensing summary for redistribution

If you eventually publish your manual call-type labels as a public artifact
(strongly recommended — it's the project's most defensible scientific
contribution):

- **Don't redistribute the audio itself**. Publish only your labels: `recording_id` + offsets + your call-type annotation.
- License **your labels** under **CC-BY 4.0** with full attribution to the original recordists.
- Cite each underlying recording's license in the label dataset's metadata. XC v3 includes the license field; ML assets carry the contributor's terms.
- This produces what is, to the best of available information, **the first openly-shared call-type-labeled American Crow dataset** — itself a publishable byproduct.
