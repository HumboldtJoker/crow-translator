# Call-Type Taxonomy

> The seven classes Crowsetta's call-type classifier maps to, plus an Other/Subsong
> bucket. **Frozen until model training is complete** — changing class definitions
> mid-project invalidates earlier hand-labels.

This taxonomy is distilled from the *Birds of the World* American Crow account
(Verbeek, Caffrey, Clark, McGowan & Pyle 2024), the *Birds of the World* Fish
Crow account (McGowan 2020), Mates et&nbsp;al. (2015), Pendergraft & Marzluff
(2019), and Richards & Thompson (1978). It is the cleanest defensible
seven-way split given currently published research; finer-grained categories
(e.g., the "structured caw" subtypes McGowan describes informally) are not
attempted because public training labels are too sparse.

---

## 01. Territorial Caw

- **AKA:** "Long-distance caw," "advertising caw"
- **Form:** Bouts of 2–5 caws (range 1–9 per Thompson 1968), audible across a roughly 0.5–1.0 km territory (Brown 1985; Parr 1997)
- **Function:** Long-distance signaling. Territorial advertisement and family-group cohesion.
- **Typical context:** Delivered from a perch (often the highest available — utility pole, dead branch). Repeated across the day.
- **Diagnostic features:** Stereotyped bout structure; consistent pitch and pacing within a bout; isolated from other crow vocalizations.
- **Citations:** Verbeek et al. 2024 · Brown 1985 · Parr 1997 · Thompson 1968

## 02. Alarm / Mobbing Caw

- **AKA:** "Inflected alarm caw"
- **Form:** Rapid, persistent caws structurally distinct from territorial caws (different inflection, often more variable amplitude and frequency contour)
- **Function:** Alerting conspecifics to a perceived threat — hawk, owl, cat, unfamiliar person — and recruiting them to mob.
- **Typical context:** Persists for many minutes. Often delivered while the bird is mobile (tracking the threat), and often joined by additional crows.
- **Diagnostic features:** Inflection pattern departs from the territorial-caw stereotype; rate is faster; bout duration far longer.
- **Citations:** Verbeek et al. 2024 · Mates et al. 2015 · Marzluff field obs.

## 03. Assembly Call

- **Form:** Clustered bouts, structurally identified by Richards & Thompson (1978) using acoustic-manipulation experiments
- **Function:** Recruitment of conspecifics — bringing them in to mob a predator or to a roost.
- **Typical context:** Distinct from diffuse alarm calling; functions to bring birds in rather than sustain mobbing once gathered.
- **Diagnostic features:** Per Richards & Thompson, identifiable structural properties separate it from territorial and alarm caws.
- **Citations:** Richards & Thompson 1978 (*Behaviour* 64:184–203) · Verbeek et al. 2024

## 04. Scold

- **Form:** Harsh, sustained, directed
- **Function:** Often confused with the alarm caw but typically directed at a specific target (a perched raptor, a predator on the ground, a person near a nest).
- **Typical context:** Tends to persist in shorter, more focused bursts than diffuse alarm calling. The caller's body posture and gaze track the target.
- **Diagnostic features:** Note that scolding and alarm/mobbing calls overlap acoustically; the most reliable distinguisher is contextual (sustained focus on a fixed target). The classifier may need to combine the two into a single class if hand-labeling proves unreliable.
- **Citations:** Verbeek et al. 2024 · McGowan corr.

## 05. Beg / Juvenile

- **Form:** Developmental sequence — nestling churrs, fledgling "chee-aps," "wa-eeks," squeaks, and noisy gargling sounds
- **Function:** Begging for food; juvenile contact with parents.
- **Typical context:** Limited to nestling and fledgling stages. Once independent, the young bird's caw matures toward adult form.
- **Diagnostic features:** **Acoustically similar to adult Fish Crow calls — a known false-positive risk.** A continental American Crow with juvenile begging present should be flagged with an explicit "could be Fish Crow" caveat in the deeper-dive layer.
- **Citations:** Kilham 1989 · Verbeek et al. 2024

## 06. Rattle / Knock

- **Form:** A rapid, mechanical sound roughly described as a wooden rattle. Non-caw.
- **Function:** Pair-bonding; family-group cohesion; courtship.
- **Typical context:** Most often given by females (Birds of the World 2024). Highly diagnostic when present.
- **Diagnostic features:** Visually obvious in a spectrogram — a regular rapid pulse train rather than the broadband bursts characteristic of caws.
- **Citations:** Verbeek et al. 2024 · Marzluff field obs.

## 07. Food / Short Call

- **Form:** Brief vocalizations, demonstrably shorter in the presence of food than in its absence (Pendergraft & Marzluff 2019)
- **Function:** Information-rich signaling near food; the precise function is incompletely understood.
- **Typical context:** Foraging birds, often near a food source or recruiting around one.
- **Diagnostic features:** Short duration; context-specific.
- **Honest caveat:** Pendergraft & Marzluff explicitly noted that **playback of these short calls produces only a minor effect on listener behavior** — i.e., the calls likely encode complex situational information that we don't yet decode. The classifier's "Food / Short Call" output should be presented as "Brief food-context call (interpretation uncertain)" in the consumer UI, not as "they're saying there's food."
- **Citations:** Pendergraft & Marzluff 2019 · Pendergraft et al. 2021 (FDG-PET, PMC8637333)

## + Other / Subsong

- **Form:** Anything not in the above seven. Includes the quiet "subsong" of mixed coos, caws, and grating notes given at rest, and the 13+ additional acoustically distinct call types in McGowan's broader repertoire description.
- **Function:** Heterogeneous. Most are too rare in public corpora to label or classify reliably.
- **Behavior:** The classifier routes high-uncertainty predictions and out-of-distribution inputs through this class, which then triggers the **unknown-call observation flow** (camera, GPS, sensors, structured tags) in Phase 5.
- **Citations:** McGowan · Cornell Bird Academy · Verbeek et al. 2024

---

## Per-class accuracy expectations

| Class | Public training data availability | Expected MVP top-1 accuracy |
|---|---|---|
| 01 Territorial Caw | High — most common XC tag | 75–88% |
| 02 Alarm / Mobbing | Moderate — some XC tags | 65–80% |
| 03 Assembly Call | Low — rare in public corpora | 40–60% (may need to merge with 02) |
| 04 Scold | Low — overlaps with 02 | 50–70% (may need to merge with 02) |
| 05 Beg / Juvenile | Moderate — some XC tags | 65–80% (Fish Crow false positives) |
| 06 Rattle / Knock | Moderate — distinctive enough to find | 70–85% |
| 07 Food / Short Call | Low — sparse in public corpora | 40–60% |
| + Other / Subsong | High (negative-mined) | n/a — used as unknown gate |

If Phase-1 hand-labeling shows fewer than ~50 examples in any non-merged
class, **merge it** into a related class for the MVP rather than ship a class
with overfit performance. Document the merge decision in the model card.

---

## Hand-labeling protocol

1. Use Audacity or Cornell's Raven Lite. Both are free.
2. Window length: **3 seconds**, matching BirdNET's standard input window. For calls shorter than 3 seconds, pad with surrounding ambient audio.
3. Label only segments whose call-type identity is **unambiguous** — when in doubt, mark "skip" rather than guess.
4. For each segment, record: `recording_id` (XC or ML asset ID), `start_s`, `end_s`, `class`, `region` (East / Pacific / Other), `caller_age_class` (Adult / Juvenile / Unknown), `quality` (Clean / Background-Other-Bird / Background-Noise), `labeler_initials`, `confidence` (1–3).
5. **Reserve a held-out validation set of 50–100 segments** before training begins. These are never seen during model selection. Include a geographic holdout (e.g., train on East-coast clips, validate on West-coast Pacific-vocal-type clips).
6. Cross-reference McGowan's Cornell crow audio identification packet ([birds.cornell.edu/crows](https://www.birds.cornell.edu/crows/)) for canonical examples of each call type when in doubt.

Recommended labeling schema: a single `labels.csv` per directory of clips,
with the columns above. Easy to load into pandas; easy to diff in PRs.
