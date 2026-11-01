'use strict';
// Rules shared by the game and focused tests. All quantities use half hearts.
const Rules = {
  stage(floor) {
    const stage = Math.min(2, Math.floor((floor-1)/2));
    return [
      {name:'BASEMENT', number:(floor-1)%2+1, boss:'boss', enemies:['chaser','spitter']},
      {name:'CAVES', number:(floor-1)%2+1, boss:'mason', enemies:['chaser','spitter','burrower']},
      {name:'DEPTHS', number:(floor-1)%2+1, boss:floor===6?'watcher':'warden', enemies:['chaser','spitter','burrower','fan']}
    ][stage];
  },
  addShield(player, kind) {
    if (player.maxHp + player.shields.reduce((n,h)=>n+h.hp,0) >= 24) return false;
    player.shields.push({kind, hp: Math.min(2, 24-player.maxHp-player.shields.reduce((n,h)=>n+h.hp,0))});
    return true;
  },
  damage(player, amount) {
    let explosions=0;
    while(amount>0 && player.shields.length) {
      const h=player.shields[player.shields.length-1], taken=Math.min(amount,h.hp);
      h.hp-=taken; amount-=taken;
      if(!h.hp) { if(h.kind==='black') explosions++; player.shields.pop(); }
    }
    player.hp=Math.max(0,player.hp-amount);
    return explosions;
  },
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
    if (item === 'health') { const gain=Math.min(2,24-player.maxHp-(player.shields||[]).reduce((n,h)=>n+h.hp,0)); player.maxHp += gain; player.hp += gain; }
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
