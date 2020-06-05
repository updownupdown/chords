## Piano Chords

This project is at a very early stage.

Bugs:

- add onload/buffer for Tone.Sampler to prevent error on page load
- make sound work on online build

Technical:

- review var/let/const
- use context?
- move common functions to utils.js?
- use typescript
- launch from github? (.io)

Features:

- after playing a series of notes, play all of them at once
- order to: legend and (?) at top, then staff (bass -8, bass, clef, clef + 8), piano, then at bottom, CoF on left, and on right, either chord or key area. maybe the bottom area has three columns (CoF/key/chord) that slide on top of each other when there isn't enough room, prioritizing the current one. OR have tabs and use arrow keys to tab between them quickly. tabs may be needed if there are a lot of them, as more is added (sine waves...)
- in key info, better show "functional harmony" with tonic, dominant, and subdominant, like on pianolit.com, but more interactive
- use staff to: show key signature, show live keys, show selected notes, selected chord/key
- when a key or chord is selected on the keyboard, once you select/unselect a key, it "disconnects" or discolors that selection, or deselects the key
- show sine waves of chord (relationship between selected notes)
- show info about single notes, maybe as another tab in the key/chord area
- show emoji qualities about chords: happy/sad/tense/satisfying/etc.
- selecting key should be double click/single click should just play, or at least have a toggle to change the behavior. same for selecting chord in wheel vs. playing and selecting?
- consider decoupling selected keys vs. highlighted keys for showing key scale, and chords. maybe selected is user only, with open to "select highlighted", "play highlighted" and "play selected". auto actions would not select keys, just highlight them. so selecting is for detecting chords only.
- quizzes to learn notes on staff, chords, keys, etc.
- chord finder/selector with series of dropdowns
- volume slider with mute
- add toggles for labels, keyboard shortcuts, simple/advanced info
- keyboard shortcut guide (esp. for delete, enter, key + space to select)
- make mobile responsive, with touch events
- add accessbility (aria)
- invert chords? transpose keys?
- app to record key strokes, edit staff and add notes and auto play, export/import to save/load compositions
- guitar tabs?
