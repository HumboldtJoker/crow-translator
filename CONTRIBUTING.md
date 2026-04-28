# Contributing to Crowsetta

Thank you for your interest. This is a class project / open-source MVP run
by one person, so contribution capacity is bounded and contributions are
weighed against the project's editorial posture (see
[`research/HONEST-LIMITS.md`](./research/HONEST-LIMITS.md)).

## What's most welcome

- **Hand-labeled call-type segments.** The bottleneck of the whole project
  is labeled audio. If you have field recordings of North American crows
  with confident call-type identification, opening an issue or a PR with
  a `data/labels.csv`-shaped contribution is the highest-leverage thing
  you can do.
- **Bug reports for the Android app**, once it exists.
- **Documentation fixes**, especially typos or scientific corrections.
- **Citations to relevant peer-reviewed work** that should appear in the
  Sources section of the site.

## What's deliberately out of scope

- **Pop-science crow-language interpretation.** Please don't open PRs
  adding "this caw means X" mappings unless there is published peer-reviewed
  work supporting the claim. See `HONEST-LIMITS.md`.
- **Commercial features.** This is a non-commercial project; bundled
  BirdNET weights inherit CC-BY-NC-SA. Don't propose features that imply
  Play Store monetization.
- **Coverage outside North America.** The taxonomy and corpora are
  scoped to North American crows. Other species are out of scope.

## How to propose a change

1. Open an issue first for non-trivial changes. State the problem before
   the solution.
2. For code: keep PRs small and focused. One concern per PR.
3. For research / writing: cite sources. This project is allergic to
   un-sourced claims, even friendly ones.
4. The maintainer responds when they can. This is a class project, not a
   funded effort.

## Hand-labeling protocol

If you're contributing labeled segments, please follow the protocol in
[`research/TAXONOMY.md`](./research/TAXONOMY.md) §"Hand-labeling protocol"
exactly. Inconsistent labels are worse than no labels.

## A note on tone

The project's voice is rigorous and honest, sometimes blunt. Code review
and issue comments should match: direct, citation-grounded, and willing to
say "I don't know." Disagreement is welcome; vibes-based pushback isn't.

## License

By contributing, you agree your contributions are licensed under the
project's MIT license (for code) or CC-BY 4.0 (for documentation and labels).
