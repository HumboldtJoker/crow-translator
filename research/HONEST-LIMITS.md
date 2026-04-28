# Honest Limits

> What this project does **not** claim. Stated explicitly so it is harder for
> anyone — including us — to forget. Mirror this content into every public
> communication: site, app About screen, README, demo presentation.

---

## We do not translate crow calls

No published model, including the most recent bioacoustic foundation models
(Perch 2.0, BirdNET 2.4, BEANS), produces a meaning-level decoding of crow
vocalizations. The defensible scientific claim is **call-type classification
with calibrated confidence and contextual interpretation grounded in
peer-reviewed research**. The app's UI is built around that distinction.

When the app says "Most likely: scolding call," it means the acoustic
features of this clip resemble examples humans have labeled as "scolding"
in our training set — not that the crow has communicated the proposition
"there is a threat" to a listener.

---

## The same call type can carry different meanings

Mates et al. (2015, *Bioacoustics* 24:63–80) showed that American Crow caws
simultaneously encode caller sex, individual identity, and behavioural
context. Pendergraft & Marzluff (2019, *Animal Behaviour* 150:39–57) showed
that even with controlled food-presence experiments, the predicted
call→behavior mapping is loose; playback of measurably-shorter-near-food
calls produces only minor effects on listeners.

Our seven-class taxonomy is a useful **approximation**, not a ground truth.
The same acoustic call type may be deployed in different contexts that we
cannot disambiguate from audio alone.

---

## "Three caws means danger" is folk-belief, not science

Pop-science narratives that map specific caw counts to specific meanings are
not supported in the peer-reviewed literature. Bout length varies 1–9 caws
(Thompson 1968) without an established meaning-by-count mapping. Crowsetta
deliberately does not output anything of this shape, even when prompted.

---

## Public training data is sparse and biased

Our model is only as good as our manual labels. Public crow corpora are
species-labeled, not call-type-labeled. Hand-labeling 500–1,000 segments is
the bottleneck, and the resulting class balance is uneven — the rarer
categories (Assembly, Food/Short, Subsong) are under-represented and will
have weaker per-class accuracy.

If hand-labeling produces fewer than ~50 examples in any non-merged class
during Phase 1, that class is **merged** into a related class for the MVP
rather than shipped with overfit performance.

---

## Generalization across regions, individuals, and recording conditions is limited

- Pacific-coast and continental American Crow vocalizations differ acoustically. A model trained primarily on Eastern recordings under-performs on Western recordings, and vice versa. We mitigate by including both regions in training and validating on a geographic holdout.
- Juvenile American Crow begging calls are acoustically similar to adult Fish Crow calls — a known false-positive risk we cannot fully resolve.
- Different Android devices have different microphone DSP defaults. Using the `UNPROCESSED` audio source mitigates but does not eliminate this. We test on at least two physically different devices before claiming generalization.
- Field recording conditions vary enormously (wind, traffic, distance to bird, foliage occlusion). Confidence calibration is most reliable on clean, close recordings.

---

## Individual-bird ID is research-grade

Mates et al. (2015) demonstrated that the per-individual signal is present
in caws of marked Ithaca crows. The published ML community has not solved it
for free-living unbanded crows. If the project pursues individual ID at all,
it is framed in the UI as **"sounds most like Bird #3 from your local
roost"** with explicit cosine-similarity surfaced — never as a definitive
identification.

---

## User-supplied behavioral labels are candidates, not ground truth

The unknown-call observation flow captures user-supplied labels and
behavioral context. These are valuable as candidate data but are noisy:
users may misidentify a behavior, miscount crows, or apply tags
inconsistently. Any future shared dataset built from this flow must treat
these labels as candidates, with researcher-verified subsets forming the
training increment. The `quality_flags` block in the observation schema
exists for this reason.

---

## What this MVP can credibly claim

- **High accuracy** for "is this a North American crow" detection.
- **High accuracy** for American Crow vs. Fish Crow distinction within their overlapping range.
- **Calibrated 65–85% top-1 accuracy** for the dominant call categories (Territorial Caw, Alarm/Mobbing, Begging, Rattle).
- **40–60% top-1 accuracy** for the rarer categories (Assembly, Food/Short, Subsong) — explicitly flagged as low confidence in the UI.
- **Context-appropriate behavioral interpretations** grounded in published research, with citations linked in the deeper-dive layer.

## What this MVP cannot credibly claim

- "Translates what a crow is saying."
- "Identifies the individual crow." (unless individual-ID stretch goal is implemented and validated)
- "Decodes crow language."
- "Real-time detection of complex behavioral states."
- "Works equally well across all regions, individuals, and recording conditions."

---

## Why this document exists

The crow-research community — McGowan, Marzluff, Pendergraft, Swift — has
been remarkably consistent in pushing back against pop-science Doolittle
narratives while genuinely advancing what is known. An app that mirrors
that posture — confident about call-type categories, transparent about
uncertainty, generous about citations, and careful about behavioral
interpretation — would itself be a small contribution to public scientific
literacy about crows, which is a fittingly high bar for a class project.

If you are reviewing a PR that softens any of the above limits, decline it.
We kill our darlings in this lab.
