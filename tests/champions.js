'use strict';
// Controlled fixture using the production encounter, movement, death and pickup paths.
(function(){
 const results=[],check=(ok,label)=>{if(!ok)throw Error(label);results.push('PASS '+label);};
 function arena(){newGame('CHAMPIONS');game.player.x=800;game.player.y=480;game.current.clear=true;game.current.rocks=[];return game.current;}
 function spawn(type,base='chaser'){const e=enemy(base,300,300);e.t=99;return Rules.makeChampion(e,type);}
 try {
  let total=0;
  for(let f=1;f<=6;f++)for(let sample=0;sample<20;sample++){
   newGame('CHAMPION-'+sample);game.floor=f;floor();
   for(const r of game.rooms.filter(r=>r.type==='normal')){
    enter(r);const champions=r.enemies.filter(e=>e.champion);
    check(champions.length<=1&&(f>1||champions.length===0),'floor '+f+' normal room champion limit');
    total+=champions.length;
   }
   const boss=game.rooms.find(r=>r.type==='boss');enter(boss);
   check(!boss.enemies.some(e=>e.champion),'boss stays non-champion');
  }
  check(total>0,'seeded generated encounters include champions after Basement I');
  function encounterSignature(){
   newGame('REPEATABLE-CHAMPIONS');game.floor=3;floor();
   return JSON.stringify(game.rooms.filter(r=>r.type==='normal').map(r=>{enter(r);return r.enemies.map(e=>[e.type,e.champion,e.hp]);}));
  }
  check(encounterSignature()===encounterSignature(),'same seed and room visit order reproduce champion encounters');
  let r=arena(),p=game.player,normal=enemy('chaser',300,300),swift=spawn('swift'),iron=spawn('iron');
  r.enemies=[normal,swift,iron];draw();const x=normal.x;update(.1);
  check(swift.x-x>normal.x-x&&normal.x-x>iron.x-x,'Swift moves faster and Iron slower than ordinary enemies');
  r=arena();p=game.player;let charger=spawn('swift','charger');charger.phase='rush';charger.phaseTime=1;charger.rushX=1;charger.rushY=0;r.enemies=[charger];update(.1);
  check(Math.abs(charger.x-333)<.001,'Swift multiplier applies to charger rushes');
  r=arena();let burrower=spawn('iron','burrower');burrower.phase='buried';burrower.phaseTime=1;r.enemies=[burrower];draw();const bx=burrower.x;update(.1);
  check(burrower.x>bx&&burrower.x-bx<8.5,'Iron multiplier also applies while burrowers tunnel');
  for(const type of ['iron','swift','volatile']){
   r=arena();p=game.player;const e=spawn(type);e.hp=0;r.enemies=[e];update(.001);
   const reward=Rules.champions[type].reward;
   check(r.drops.length===1&&r.drops[0].type===reward,type+' drops its guaranteed reward');
   check(game.shots.length===(type==='volatile'?6:0),type+' has the correct death projectile count');
   update(.001);check(r.drops.length===1,type+' death cannot pay twice');
   const drop=r.drops[0],before=reward==='soul'?p.shields.length:reward==='key'?p.keys:p.bombs;
   p.x=drop.x;p.y=drop.y;p.iframes=2;update(.001);
   check(!r.drops.includes(drop)&&(reward==='soul'?p.shields.length:reward==='key'?p.keys:p.bombs)===before+1,type+' reward is collectible');

  }
  r=arena();p=game.player;let explosive=spawn('volatile');explosive.hp=0;r.enemies=[explosive];update(.001);
  const shot=game.shots[0],hp=p.hp;p.x=shot.x+30;p.y=shot.y;p.iframes=0;
  update(.08);check(p.hp===hp-1,'Volatile death burst can damage the player');
  r=arena();let ordinary=enemy('chaser',300,300);ordinary.hp=0;r.enemies=[ordinary];update(.001);
  check(r.drops.length===0&&game.shots.length===0,'ordinary enemies gain no champion death effects');
  r=arena();const volatile=spawn('volatile');volatile.hp=0;r.clear=false;r.enemies=[volatile];update(.001);
  check(r.clear&&game.shots.length===6&&r.drops.some(d=>d.type==='bomb'),'last champion still clears the room and leaves its death hazard');
  const old=r;enter(game.rooms[0]);enter(old);update(.001);
  check(!old.enemies.length,'re-entering does not respawn a defeated champion');
  document.querySelector('#result').textContent=results.join('\n');
 }catch(e){document.querySelector('#result').textContent=results.join('\n')+'\nFAIL '+e.message;throw e;}
})();
