# Below the Floorboards

A small, original browser game inspired by the base game *The Binding of Isaac: Rebirth*. Explore a generated set of connected rooms, fight in four directions, collect supplies and upgrades, defeat a boss, and descend again. The art is drawn in code and does not use assets from the original game.

## Play locally

Run `python3 -m http.server 8000 --bind 127.0.0.1` in this directory, then visit <http://127.0.0.1:8000/>. A keyboard is required. WASD moves; the arrow keys fire; E places a bomb; Space uses the healing item when charged; P pauses. Clear a room to open its doors and charge the item. Enter the hatch after a boss to descend. The top-right miniature map shows discovered and adjacent rooms. The top-left heart display represents health in half-heart units internally.

## Research and scope

Rebirth is a top-down, randomly generated action-RPG shooter where items alter abilities and combinations, and each run has a new dungeon. The [official Steam description](https://store.steampowered.com/app/250900/) describes its large pool of items, bosses, enemies, seeded runs, challenges, co-op and unlocks; the [PlayStation announcement](https://blog.playstation.com/?p=139455) discusses the remake. The game here follows the basic loop, not the full rules or content.

This is **not a mechanically exact reproduction**. Layout generation, enemy behavior, collision, projectile physics, values, health and damage are approximations. It has only two ordinary enemy types, one boss, a small random set of stat upgrades, a healing active item, basic pickups and indefinitely repeated floors. Coins and keys are displayed but have no spending use. Bombs damage enemies, rocks and the player. It does not implement locked treasure rooms, shops, secret rooms, cards, pills, multiple health types, item synergies, character selection, seeded runs, persistent unlocks, endings, challenges, controller support, co-op, or the original game's full roster, room layouts, progression and balancing. The treasure room is always free to enter. Pickups and upgrades are approximations, not replicas of named original items. There is no touch control or sound. The game does not save runs.

The game is self-contained and uses a 2D canvas because the source gameplay is top-down. No build step or third-party runtime library is required. A Google Fonts stylesheet is optional; local fallbacks work offline.

## License

MIT; see [LICENSE](LICENSE). This fan project is unaffiliated with the creators or publisher of The Binding of Isaac.
