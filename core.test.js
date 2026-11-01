'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), rules=require('./core.js');
const player=()=>({keys:1,coins:5,damage:3.5,rate:.3,hp:4,maxHp:6});
test('locked doors cost one key only once and deny entry without one',()=>{let p=player(),room={locked:true};assert.equal(rules.unlock(room,p),true);assert.equal(p.keys,0);assert.equal(rules.unlock(room,p),true);assert.equal(p.keys,0);assert.equal(rules.unlock({locked:true},p),false);});
test('purchases charge only affordable items',()=>{let p=player();assert.equal(rules.buy({price:10},p),false);assert.equal(p.coins,5);assert.equal(rules.buy({price:3},p),true);assert.equal(p.coins,2);});
test('damage, double shot, piercing and splash compose on each projectile',()=>{let p=player();for(let item of ['damage','double','pierce','burst'])rules.apply(item,p);let shots=rules.projectiles(p,390,0);assert.equal(shots.length,2);assert.ok(shots.every(s=>s.damage===5&&s.pierce&&s.burst));assert.ok(shots[0].dy<0&&shots[1].dy>0);});
test('health upgrades expand and heal, fire rate has a lower bound',()=>{let p=player();rules.apply('health',p);assert.equal(p.hp,6);assert.equal(p.maxHp,8);for(let i=0;i<10;i++)rules.apply('rate',p);assert.equal(p.rate,.12);});
test('soul and black hearts absorb damage in reverse pickup order; black heart bursts only when depleted',()=>{let p=player();p.shields=[];assert.equal(rules.addShield(p,'soul'),true);assert.equal(rules.addShield(p,'black'),true);assert.equal(rules.damage(p,1),0);assert.equal(p.hp,4);assert.deepEqual(p.shields,[{kind:'soul',hp:2},{kind:'black',hp:1}]);assert.equal(rules.damage(p,1),1);assert.equal(rules.damage(p,3),0);assert.equal(p.hp,3);});
test('heart capacity includes containers and shield half-hearts',()=>{let p=player();p.maxHp=22;p.shields=[];assert.equal(rules.addShield(p,'soul'),true);assert.equal(rules.addShield(p,'black'),false);rules.apply('health',p);assert.equal(p.maxHp,22);});
test('two-floor chapters have distinct encounter pools and a final boss',()=>{assert.deepEqual([1,2,3,4,5,6,7].map(n=>rules.stage(n).name),['BASEMENT','BASEMENT','CAVES','CAVES','DEPTHS','DEPTHS','DEPTHS']);assert.deepEqual([1,2,3,4,5,6].map(n=>rules.stage(n).number),[1,2,1,2,1,2]);assert.equal(rules.stage(3).boss,'mason');assert.equal(rules.stage(5).boss,'warden');assert.equal(rules.stage(6).boss,'watcher');assert.ok(rules.stage(3).enemies.includes('burrower'));assert.ok(rules.stage(5).enemies.includes('fan'));});
test('generated rooms keep enemies and rewards clear and connected to all doorways',()=>{
 const entries=[{x:125,y:320},{x:835,y:320},{x:480,y:140},{x:480,y:500}];
 for(let seed=1;seed<=500;seed++){let state=seed;const random=()=>((state=(state*1664525+1013904223)>>>0)/2**32);let entry=entries[seed%4];let {rocks,enemies}=rules.roomGeometry(6,entry,random);assert.equal(rocks.length,3);assert.equal(enemies.length,6);
  for(const [i,e] of enemies.entries()){assert.ok(rocks.every(r=>Math.hypot(e.x-r.x,e.y-r.y)>=58));assert.ok(Math.hypot(e.x-entry.x,e.y-entry.y)>=55);assert.ok(enemies.slice(0,i).every(a=>Math.hypot(e.x-a.x,e.y-a.y)>=40));}
  for(const p of [{x:435,y:315},{x:480,y:315},{x:525,y:315},...entries])assert.ok(rocks.every(r=>Math.hypot(p.x-r.x,p.y-r.y)>=40));
  // A conservative 20px grid checks traversability for the largest 30px radius.
  const points=[];for(let y=140;y<=500;y+=20)for(let x=120;x<=840;x+=20)if(rocks.every(r=>Math.hypot(x-r.x,y-r.y)>=54))points.push(`${x},${y}`);
  const open=new Set(points), seen=new Set(['480,320']),queue=['480,320'];for(let i=0;i<queue.length;i++){let [x,y]=queue[i].split(',').map(Number);for(let [dx,dy] of [[20,0],[-20,0],[0,20],[0,-20]]){let k=`${x+dx},${y+dy}`;if(open.has(k)&&!seen.has(k)){seen.add(k);queue.push(k);}}}
  for(const p of [...entries,...enemies])assert.ok([...seen].some(k=>{let [x,y]=k.split(',').map(Number);return Math.hypot(x-p.x,y-p.y)<=30;}),`unreachable target at seed ${seed}`);
 }
});
test('degenerate randomness and overcrowding terminate without overlapping spawns',()=>{for(const random of [()=>0,()=>.999999]){let layout=rules.roomGeometry(6,{x:480,y:320},random);assert.equal(layout.enemies.length,6);for(let e of layout.enemies)assert.ok(layout.rocks.every(r=>Math.hypot(e.x-r.x,e.y-r.y)>=58));}let crowded=rules.roomGeometry(500,{x:480,y:320},()=>0);assert.deepEqual(crowded,{rocks:[],enemies:[]});});
test('Lovers pickups avoid rock interiors and fall back to the player',()=>{let p={x:440,y:300},r=[{x:480,y:300}];assert.deepEqual(rules.pickupPosition(470,300,p,r),p);assert.deepEqual(rules.pickupPosition(410,300,p,r),{x:410,y:300});});
test('deal chance rewards avoiding red health damage and excludes floor one and final floor',()=>{assert.equal(rules.dealChance(1,false),0);assert.equal(rules.dealChance(2,false),1);assert.equal(rules.dealChance(2,true),.25);assert.equal(rules.dealChance(6,false),0);});
test('heart trades remove containers but never cause death or spend shields',()=>{let p={hp:6,maxHp:6,shields:[]};assert.equal(rules.payHeartContainers(p,1),true);assert.equal(p.hp,4);assert.equal(p.maxHp,4);assert.equal(rules.payHeartContainers(p,2),false);assert.equal(p.hp,4);p.shields=[{kind:'soul',hp:2}];assert.equal(rules.payHeartContainers(p,2),true);assert.equal(p.maxHp,0);assert.equal(p.hp,0);assert.equal(p.shields[0].hp,2);});
test('homing and damage compose with existing tear modifiers',()=>{let p={damage:3.5};for(let item of ['blood','homing','double','pierce','burst'])rules.apply(item,p);let shots=rules.projectiles(p,390,0);assert.equal(shots.length,2);assert.ok(shots.every(s=>s.damage===6.5&&s.homing&&s.pierce&&s.burst));});

test('generated floors always have a key-free boss path with locked optional rooms',()=>{
  const make=(type,x,y)=>({type,x,y,doors:{},locked:false});
  for(let seed=1;seed<=3000;seed++){
    let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
    const {rooms,boss,treasure,shop}=rules.floorRooms(make,random);
    assert.notEqual(boss,treasure);assert.notEqual(boss,shop);assert.notEqual(treasure,shop);
    treasure.locked=shop.locked=true;
    const seen=new Set([rooms[0]]),queue=[rooms[0]];
    for(let i=0;i<queue.length;i++)for(const r of Object.values(queue[i].doors))if(!r.locked&&!seen.has(r)){seen.add(r);queue.push(r);}
    assert.ok(seen.has(boss),`seed ${seed} blocks the boss`);
    for(const r of rooms)for(const [dir,n] of Object.entries(r.doors))assert.equal(n.doors[{left:'right',right:'left',up:'down',down:'up'}[dir]],r);
  }
});

test('a narrow route gains optional rooms rather than locking the boss path',()=>{
  const make=(type,x,y)=>({type,x,y,doors:{},locked:false});
  const rooms=Array.from({length:12},(_,i)=>make(i?'normal':'start',i,0));
  for(let i=1;i<rooms.length;i++){rooms[i-1].doors.right=rooms[i];rooms[i].doors.left=rooms[i-1];}
  const {boss,treasure,shop}=rules.specialRooms(rooms,make);
  assert.equal(boss,rooms[11]);assert.equal(rooms.length,14);
  assert.ok(rooms.indexOf(treasure)>=12 && rooms.indexOf(shop)>=12);
});
