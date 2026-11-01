'use strict';
// Rules shared by the game and focused tests. All quantities use half hearts.
const Rules = {
  unlock(room, player) {
    if (!room.locked) return true;
    if (player.keys < 1) return false;
    player.keys--; room.locked = false; return true;
  },
  buy(drop, player) {
    if (!drop.price) return true;
    if (player.coins < drop.price) return false;
    player.coins -= drop.price; return true;
  },
  apply(item, player) {
    if (item === 'damage') player.damage += 1.5;
    if (item === 'rate') player.rate = Math.max(.12, player.rate - .045);
    if (item === 'speed') player.speed += 25;
    if (item === 'range') player.range += 100;
    if (item === 'health') { player.maxHp += 2; player.hp += 2; }
    if (item === 'double') player.double = true;
    if (item === 'pierce') player.pierce = true;
    if (item === 'burst') player.burst = true;
  },
  projectiles(player, dx, dy) {
    const angles = player.double ? [-.13, .13] : [0];
    return angles.map(a => ({dx: dx * Math.cos(a) - dy * Math.sin(a), dy: dx * Math.sin(a) + dy * Math.cos(a), damage: player.damage, pierce: player.pierce, burst: player.burst}));
  }
};
if (typeof module !== 'undefined') module.exports = Rules;
