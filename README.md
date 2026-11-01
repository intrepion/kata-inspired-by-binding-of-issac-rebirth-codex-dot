# Below the Floorboards

A small, original browser game inspired by the base game *The Binding of Isaac: Rebirth*. Explore a generated set of connected rooms, fight in four directions, collect supplies and upgrades, defeat a boss, and descend again. The art is drawn in code and does not use assets from the original game.

## Play locally

Run `python3 -m http.server 8000 --bind 127.0.0.1` in this directory, then visit <http://127.0.0.1:8000/>. A keyboard is required for gameplay. Leave the optional seed field blank for a fresh random run, or enter up to 20 characters to replay floor layouts and initially placed items. The HUD and pause screen show the current seed; after a run it appears on the start screen. Entered seeds are case-insensitive and disable new starting-profile unlocks, including Lantern. Later drops and combat depend on play and timing, and seeds are not compatible with Rebirth. Use the Game guide button for illustrated power-up, shop, room, card, pill, and heart explanations; it pauses a run while open. Press P for a compact pause reference with Resume and Full game guide buttons. WASD moves; the arrow keys fire; E places a bomb; Space uses your equipped active item when charged; Q consumes the held card or pill; P pauses. Only one card or pill can be held at once; walking over another swaps it with the held one. The pickup label identifies its effect. Clear a room to open its doors and charge the held item. Each treasure room has a fully charged Fury Tome (three charges, +2 tear damage until leaving the room) or Ashen Bell (four charges, 25 damage to exposed enemies). Touch one to swap it with your active item; the dropped item retains its charge. Battery pickups add one charge, can drop from cleared rooms or cost five coins in shops, and remain uncollected when the item is full. The route to each boss requires no keys, though combat rooms must still be cleared. Treasure doors are free on the first floor and cost a key afterward; shops always cost a key. Walk over priced goods to buy them with coins. Each floor also has an optional purple-marked curse room with two red chests. Crossing its door in either direction deals half a heart unless invulnerable; red-heart damage affects Bargain odds. Chests randomly contain two soul hearts, a bomb and key, three coins, or an enemy ambush. Each floor also has an optional orange-marked challenge room: touching its labeled chest grants a passive upgrade and locks the doors for three enemy waves. Completing all three charges the active item once; you can leave the chest unopened. Spectral tears pass through rocks, rebound tears bounce off walls twice, and returning tears reverse halfway through their lifetime. Little Wisp fires fixed-damage tears while you shoot, and Orbit Guard circles you and blocks enemy projectiles. These familiars do not inherit player tear upgrades, and duplicate copies have no additional effect. The tear modifiers combine with double shot, piercing, splash, and homing; homing stops after a tear reverses. A tear hits each enemy at most once. Enter the hatch after a boss to descend. After defeating the final boss on Depths II, enter the glowing exit to win and unlock the optional Lantern start. Select it before a later run to begin with one soul heart and +25 movement speed. Defeating the Caves II boss unlocks Scout: two red hearts, movement speed 215, two keys, three coins and one bomb. Defeating the Basement II boss without red-health damage on that floor unlocks Vanguard: four red hearts, movement speed 165, one key and no starting bomb or coins. Choose at most one unlocked start for a run. Unlocks are stored in browser local storage; if unavailable they last only for the current page session. The top-right miniature map shows discovered and adjacent rooms. The top-left heart display represents health in half-heart units internally.

## Research and scope

Rebirth is a top-down, randomly generated action-RPG shooter where items alter abilities and combinations, and each run has a new dungeon. The [official Steam description](https://store.steampowered.com/app/250900/) describes its large pool of items, bosses, enemies, seeded runs, challenges, co-op and unlocks; the [PlayStation announcement](https://blog.playstation.com/?p=139455) discusses the remake. The game here follows the basic loop, not the full rules or content.

This is **not a mechanically exact reproduction**. Layout generation, enemy behavior, collision, projectile physics, values, health and damage are approximations. It has five ordinary enemy types, four original bosses, a small random set of stat and projectile upgrades, three swappable active items with room-based charges, two familiar-style passive upgrades, basic pickups, one simple shop, one secret room, one curse room, and one challenge room per floor, and six floors. Curse rooms always spawn and have simplified door damage and four equally likely red-chest outcomes; these are not exact Rebirth layouts, odds, or item pools. Active items, charge costs, item placement, familiars and effects are simplified approximations. The challenge room always appears, has no health-entry requirement, and uses three waves of ordinary enemies; its placement, rewards, and rules approximate Rebirth rather than reproduce it. A run proceeds through Basement I–II, Caves I–II, and Depths I–II; enemy counts rise through the third floor and then level off, while boss health increases each floor. Caves add burrowers that cannot attack or be damaged while underground, plus chargers that pause and then rush in a straight line; Depths add enemies that fire three-shot spreads. Bosses use radial, aimed spread, or alternating attacks; the final boss alternates a twelve-shot radial burst and a three-shot aimed spread. Cards are The Fool, The Lovers, and Death; pills are Full Health, Health Up, Health Down, and Speed Up. Keys unlock shops and later treasure rooms; coins buy shop goods. After bosses on floors 2–5, a Bargain portal is guaranteed if no red-heart damage was taken on that floor; otherwise it has a 25% chance. The room offers Blood Power (+3 damage for one red-heart container) and Homing tears (two containers). The game refuses a purchase that would leave no health; protective hearts can keep the player alive but are not currency. This simplified system does not implement Rebirth’s exact chances, item pools, soul-heart pricing, lethal deals, or exact Angel Room rules. Homing steers tears toward nearby exposed enemies and combines with double shot, piercing, splash, and damage. Spectral, rebound, and returning modifiers are available in treasure rooms and shops; their timing, bounce count, and combinations are original approximations rather than exact Rebirth item behavior. Projectile upgrades combine, but their effects and values are original approximations rather than the original item catalog. Bombs damage enemies, rocks and the player, and can reveal hidden passages when placed near the center of the correct wall. Cleared ordinary rooms can drop free chests or gold chests that cost one key, with random pickup or upgrade rewards. A deeper secret room can also appear next to exactly one ordinary or starting room, favoring a position near the boss; it contains a soul heart and gold chest. This room is omitted if no suitable position exists. Chest contents and odds are simplified approximations. Each floor has one secret room, normally adjacent to as many ordinary rooms as the generated layout allows. Soul and black hearts protect red health first; depleting a black heart damages all room enemies. The health display caps containers plus protective hearts at 12 hearts. It does not reproduce original super-secret room placement or most special room types, most cards and pills, other health types, the original item catalog and its full synergy rules, the original Rebirth characters and their unlock conditions, Rebirth-compatible seeds, original endings, challenges, controller support, co-op, or the original game's full roster, room layouts, progression and balancing. Pickups and upgrades are approximations. Pill effects are shown immediately instead of being unidentified until used, their values and generation are simplified, and Health Down cannot remove the last red container. Secret-room placement, contents, and door rules are simplified; black-heart damage and the health cap are approximations of the base rules rather than a complete implementation. There is no touch control or sound. The game does not save runs; the Lantern, Scout, and Vanguard unlocks are stored when browser storage works.

The game is self-contained and uses a 2D canvas because the source gameplay is top-down. No build step or third-party runtime library is required. The chapter order is inspired by [Rebirth’s chapters](https://bindingofisaacrebirth.wiki.gg/wiki/Chapters); the enemies, bosses, six-floor ending, Lantern unlock, layouts, and combat values are original approximations; the original game has additional chapters, endings, unlocks, and branching progression. A Google Fonts stylesheet is optional; local fallbacks work offline.

## License

MIT; see [LICENSE](LICENSE). This fan project is unaffiliated with the creators or publisher of The Binding of Isaac.

Run focused rules tests with `node --test core.test.js`. With the local server running, visit `http://127.0.0.1:8000/tests/integration.html` for fixture-assisted browser checks covering secret-door bombing, heart depletion, selected consumables, the shop, projectile interaction, boss rewards and descent, chapter encounters, victory, the Lantern effect, death, and restart. The fixture adjusts game state and boss health; it is not an unaided playthrough.

Bargain design was informed by the community-maintained [Devil Room reference](https://bindingofisaacrebirth.wiki.gg/wiki/Devil_Room); its rules also describe later expansions. Gameplay reference details were checked against the community-maintained [rooms, including challenge and curse rooms](https://bindingofisaacrebirth.wiki.gg/wiki/Rooms), [hearts](https://bindingofisaacrebirth.wiki.gg/wiki/Hearts), and [cards](https://bindingofisaacrebirth.wiki.gg/wiki/Card) references, which cover later expansions as well as Rebirth. Only the selected effects described above are implemented here.

Run `http://127.0.0.1:8001/tests/seeds.html` on a separate loopback server for fixture-assisted seed, floor-layout and unlock-restriction checks.

To test the two new profile unlocks in isolation, serve this directory on a separate loopback port and open `http://127.0.0.1:8001/tests/profile-persistence.html`. This fixture clears boss encounters, reloads the page, restores previous unlock values, and simulates denied storage. Scout and Vanguard are original starting profiles inspired by Rebirth’s selectable characters; their stats and unlock conditions are not copies.

To test victory persistence in isolation, serve this directory on a separate loopback port, for example `python3 -m http.server 8001 --bind 127.0.0.1`, then open `http://127.0.0.1:8001/tests/persistence.html`. This fixture changes boss health, reloads the page, and restores the origin’s previous unlock value. It also simulates denied storage.

## Sanctuary choices

After entering a Bargain and leaving without buying, later eligible boss portals
have a 50% chance to lead to a blue Sanctuary instead. Taking any heart-container
deal permanently disables Sanctuaries for that run. An unaffordable purchase does
not count, and skipping a portal without entering does not qualify. Portal
appearance still uses the existing floor 2–5 rule: guaranteed without red-health
damage, otherwise 25%. The first offered room is always a Bargain.

A Sanctuary offers **one** free relic: **Dawn Halo** adds a filled red-heart
container (capacity permitting) and +1 damage; **Vigil Seal** grants two soul
hearts (capacity permitting) and Orbit Guard. Touching one removes both choices.
Leaving without choosing preserves the offer. Both rewards obey the 12-heart
cap; duplicate Orbit Guards do not stack. The return portal remains available.
These are original Angel Room-inspired choices, not exact Rebirth rules or items.
The illustrated guide includes both relics and explains the run-long tradeoff.

Run all focused tests with `node --test core.test.js guide.test.js runtime.test.js`.
The runtime suite uses a mock DOM to exercise production gameplay fixtures; it
does not test browser rendering, native focus, or storage persistence.
With the loopback server running, open
<http://127.0.0.1:8000/tests/sanctuary.html> for fixture-assisted coverage of
eligibility, successful and refused deals, free choice, re-entry, descent and reset.

## Champion encounters

Starting on Basement II, each ordinary combat room rolls a 25% chance for
one champion (never more than one). Its colored ring and letter identify the
variant without relying on color alone:

| Mark | Variant | Health | Movement | Guaranteed death reward |
| --- | --- | --- | --- | --- |
| I / silver | Iron | 1.8× | 20% slower | One soul heart |
| S / yellow | Swift | 1.2× | 50% faster | One key |
| V / orange | Volatile | 1.3× | Normal | One bomb; fires six hostile tears on death |

Health is rounded up. Variants are equally likely within the champion roll.
They retain their base attack patterns and normal half-heart contact damage;
movement multipliers also apply to charger rushes and underground burrowers.
Bosses, challenge waves and curse ambushes are excluded. Guaranteed drops are
additional to the ordinary room-clear reward. Volatile death shots remain
dangerous after room clearance, so do not rush straight onto the reward.
These are original Rebirth-inspired variants, not exact champion rules.
Seeded encounters repeat when room visit order and random-consuming actions match.

The illustrated guide explains all three variants. The fixture at
<http://127.0.0.1:8000/tests/champions.html> covers generated eligibility,
movement, guaranteed rewards, death bursts and repeat-collection protection.
It also runs in the mock-DOM `runtime.test.js` suite, which is not browser QA.
