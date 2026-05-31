DEVIL'S COINFLIP — REBUILD V10
==============================

Based on the V9 layout the user liked.

V10 changes:
- Starter area is now a small multi-room foyer:
  - Main Hall
  - Back Alley
  - Broken Slots
- Side doors work like small Isaac-style room transitions.
- Removed large NPC-area boxes that made the map feel like a UI mockup.
- Added more props/detail to the starter rooms.
- Added basic collision so you cannot walk through NPCs, torches, slots, door structures, crates, and side-door frames.
- Kept the V9 table/gameplay style.

Controls:
- WASD / Arrow keys: move
- E: interact / enter doors when close
- Space: flip at the table
- 1-5: hold coin slots
- 0: dev ending trigger at table
- ESC: settings/menu

Run:
Open index.html in a browser.


V18 art pass notes:
- Improved foyer / doors / ending presentation.
- Bundled refreshed local sprite assets in /assets for better visual readability.
- Asset inspiration sources for future swaps: Kenney free assets and OpenGameArt CC0/free packs.


V21 audio integration:
- Uploaded audio files are packed in assets/audio.
- menu_music plays in the menu/foyer/NPC exploration sections.
- inside_game plays after entering the Hell Doors and during the table/run.
- transition, chain_break, coin_toss, coin_land, Good_Combo, devil_laugh, and homeless_1-4 are wired into gameplay moments.


V22 audio mix changes:
- inside_game music pauses during Good_Combo and ending cinematics.
- devil_laugh is rate-limited to avoid overlap spam.
- coin_land plays once per roll, not once per coin.
- coin_land has a separate lower mix level.


V23 notes:
- Settings now resume previous screen instead of returning to menu/resetting flow.
- Added custom cursor/pointer assets from uploaded cursor zip.
- Added death, perk purchase, mouse click, and dealer/host mumble sounds.


V24 fixes:
- Replaced transition sound with transitionnew.mp3.
- Added reliable 32px cursor sprites and explicit canvas cursor switching.
- Prevented dealer/host/homeless mumbles from overlapping.
- Added interaction input locks to stop stacked door/dialog interactions.
