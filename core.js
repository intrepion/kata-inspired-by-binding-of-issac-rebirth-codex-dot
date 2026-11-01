'use strict';
// Rules shared by the game and focused tests. All quantities use half hearts.
const Rules = {
  // Three separated rocks leave broad horizontal and vertical corridors.
  roomGeometry(count, entry, random=Math.random) {
    const anchors=[{x:260,y:210},{x:700,y:210},{x:260,y:430},{x:700,y:430}];
    const shuffle=a=>{for(let i=a.length-1;i>0;i--){let j=Math.min(i,Math.floor(random()*(i+1)));[a[i],a[j]]=[a[j],a[i]];}return a;};
    let rocks=shuffle(anchors.slice()).slice(0,3).map(p=>({x:p.x+(random()-.5)*30,y:p.y+(random()-.5)*30,hp:1}));
    const safe=(p,points,min)=>points.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>=min);
    // Finite randomized attempts followed by a deterministic grid; no rejection loop can hang.
    function place(obstacles) {
      let positions=[];
      for(let i=0;i<count;i++){
        let candidates=[];
        for(let j=0;j<40;j++)candidates.push({x:250+random()*460,y:200+random()*240});
        for(let y=160;y<=480;y+=40)for(let x=160;x<=800;x+=40)candidates.push({x,y});
        let p=candidates.find(p=>safe(p,obstacles,58)&&safe(p,positions,40)&&Math.hypot(p.x-entry.x,p.y-entry.y)>=55);
        if(!p)return null;
        positions.push(p);
      }
      return positions;
    }
    let enemies=place(rocks);
    if(!enemies){rocks=[];enemies=place(rocks);}
    // A future room that asks for more entities than fit is cleared rather than softlocked.
    return {rocks,enemies:enemies||[]};
  },
  pickupPosition(x,y,player,rocks) {
    const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
    const valid=p=>rocks.every(r=>Math.hypot(p.x-r.x,p.y-r.y)>=40);
    let wanted={x:clamp(x,120,840),y:clamp(y,135,505)};
    if(valid(wanted))return wanted;
    // The player occupies a reachable position, so it is a safe fallback for a pickup.
    return {x:player.x,y:player.y};
  },
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
