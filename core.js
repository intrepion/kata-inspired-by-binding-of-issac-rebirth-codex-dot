'use strict';
// Rules shared by the game and focused tests. All quantities use half hearts.
const Rules = {
  activeItems: {
    patchwork:{name:'PATCHWORK HEART',charges:3},
    fury:{name:'FURY TOME',charges:3},
    bell:{name:'ASHEN BELL',charges:4}
  },
  floorRooms(makeRoom, random=Math.random) {
    const pick=a=>a[Math.floor(random()*a.length)];
    const rooms=[makeRoom('start',0,0)], occupied=new Set(['0,0']);
    while(rooms.length<12){
      const base=pick(rooms),d=pick([[1,0],[-1,0],[0,1],[0,-1]]),x=base.x+d[0],y=base.y+d[1],key=`${x},${y}`;
      if(Math.abs(x)>3||Math.abs(y)>3||occupied.has(key))continue;
      occupied.add(key);rooms.push(makeRoom('normal',x,y));
    }
    for(const a of rooms)for(const b of rooms){
      const dx=b.x-a.x,dy=b.y-a.y;
      if(Math.abs(dx)+Math.abs(dy)===1)a.doors[dx===1?'right':dx===-1?'left':dy===1?'down':'up']=b;
    }
    const special=this.specialRooms(rooms,makeRoom);
    return {rooms,...special};
  },
  attachChallenge(rooms, makeRoom) {
    return this.attachOptional(rooms,makeRoom,'challenge');
  },
  attachOptional(rooms, makeRoom, type) {
    const occupied=new Set(rooms.map(r=>`${r.x},${r.y}`));
    const queue=[rooms[0]], seen=new Set(queue);
    const directions=[['right',1,0,'left'],['left',-1,0,'right'],['down',0,1,'up'],['up',0,-1,'down']];
    for(let i=0;i<queue.length;i++){
      const anchor=queue[i];
      for(const [dir,dx,dy,opposite] of directions){
        const x=anchor.x+dx,y=anchor.y+dy;
        if(occupied.has(`${x},${y}`)||anchor.doors[dir])continue;
        const added=makeRoom(type,x,y);
        anchor.doors[dir]=added;added.doors[opposite]=anchor;rooms.push(added);
        return added;
      }
      for(const next of Object.values(anchor.doors))if(['start','normal','boss'].includes(next.type)&&!seen.has(next)){seen.add(next);queue.push(next);}
    }
    throw new Error('Could not place optional room');
  },
  redChest(random=Math.random) {
    return [['soul','soul'],['bomb','key'],['coin','coin','coin'],['ambush']][Math.min(3,Math.floor(random()*4))];
  },
  chestContents(golden,random=Math.random) {
    const pool=golden?[['coin','coin','coin'],['bomb','key','soul'],['upgrade'],['soul','soul']]:[['coin','coin'],['bomb'],['key'],['heart']];
    return pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
  },
  superSecretCandidates(rooms,boss) {
    const occupied=new Set(rooms.map(r=>`${r.x},${r.y}`)),choices=[];
    for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++){
      if(occupied.has(`${x},${y}`))continue;
      const near=rooms.filter(r=>Math.abs(r.x-x)+Math.abs(r.y-y)===1);
      if(near.length===1&&['start','normal'].includes(near[0].type))choices.push({x,y,neighbor:near[0],distance:Math.abs(x-boss.x)+Math.abs(y-boss.y)});
    }
    if(!choices.length)return [];
    const closest=Math.min(...choices.map(c=>c.distance));
    return choices.filter(c=>c.distance===closest);
  },
  specialRooms(rooms, makeRoom) {
    const start=rooms[0];
    const leaves=rooms.slice(1).filter(r=>Object.keys(r.doors).length===1)
      .sort((a,b)=>Math.abs(b.x)+Math.abs(b.y)-Math.abs(a.x)-Math.abs(a.y));
    const boss=leaves[0]||rooms[rooms.length-1];
    const parent=new Map([[start,null]]), queue=[start];
    for(let i=0;i<queue.length&&!parent.has(boss);i++) for(const next of Object.values(queue[i].doors)) {
      if(!parent.has(next)){parent.set(next,queue[i]);queue.push(next);}
    }
    if(!parent.has(boss)) throw new Error('Floor graph is disconnected');
    const route=new Set();
    for(let r=boss;r;r=parent.get(r)) route.add(r);
    const options=[...leaves,...rooms.slice(1)].filter((r,i,a)=>!route.has(r)&&a.indexOf(r)===i);
    // Rare narrow layouts need extra optional rooms rather than locks on the boss route.
    const directions=[['right',1,0,'left'],['left',-1,0,'right'],['down',0,1,'up'],['up',0,-1,'down']];
    while(options.length<2){
      const occupied=new Set(rooms.map(r=>`${r.x},${r.y}`));
      let added=false;
      for(const anchor of [...route]){
        for(const [dir,dx,dy,opposite] of directions){
          const x=anchor.x+dx,y=anchor.y+dy;
          if(occupied.has(`${x},${y}`)||anchor.doors[dir]) continue;
          const extra=makeRoom('normal',x,y);anchor.doors[dir]=extra;extra.doors[opposite]=anchor;
          rooms.push(extra);options.push(extra);added=true;break;
        }
        if(added)break;
      }
      if(!added) throw new Error('Could not place optional room');
    }
    return {boss,treasure:options[0],shop:options[1]};
  },
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
      {name:'CAVES', number:(floor-1)%2+1, boss:'mason', enemies:['chaser','spitter','burrower','charger']},
      {name:'DEPTHS', number:(floor-1)%2+1, boss:floor===6?'watcher':'warden', enemies:['chaser','spitter','burrower','fan','charger']}
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
  dealChance(floor, redDamage) {
    return floor<2 || floor>=6 ? 0 : redDamage ? .25 : 1;
  },
  payHeartContainers(player, hearts) {
    const cost=hearts*2, remaining=player.maxHp-cost;
    if(remaining<0) return false;
    const red=Math.min(player.hp,remaining);
    if(red<=0 && !player.shields.some(h=>h.hp>0)) return false;
    player.maxHp=remaining;player.hp=red;return true;
  },
  buy(drop, player) {
    if (!drop.price) return true;
    if (player.coins < drop.price) return false;
    player.coins -= drop.price; return true;
  },
  apply(item, player) {
    if (item === 'damage') player.damage += 1.5;
    if (item === 'blood') player.damage += 3;
    if (item === 'homing') player.homing = true;
    if (item === 'rate') player.rate = Math.max(.12, player.rate - .045);
    if (item === 'speed') player.speed += 25;
    if (item === 'range') player.range += 100;
    if (item === 'health') { const gain=Math.min(2,24-player.maxHp-(player.shields||[]).reduce((n,h)=>n+h.hp,0)); player.maxHp += gain; player.hp += gain; }
    if (item === 'double') player.double = true;
    if (item === 'pierce') player.pierce = true;
    if (item === 'burst') player.burst = true;
    if (item === 'spectral') player.spectral = true;
    if (item === 'bounce') player.bounce = true;
    if (item === 'return') player.returning = true;
    if (item === 'wisp') player.wisp = true;
    if (item === 'orbit') player.orbit = true;
  },
  projectiles(player, dx, dy) {
    const angles = player.double ? [-.13, .13] : [0];
    return angles.map(a => ({dx: dx * Math.cos(a) - dy * Math.sin(a), dy: dx * Math.sin(a) + dy * Math.cos(a), damage: player.damage+(player.roomDamage||0), pierce: player.pierce, burst: player.burst, homing: player.homing, spectral: player.spectral, bounce: player.bounce, returning: player.returning}));
  }
};
if (typeof module !== 'undefined') module.exports = Rules;
