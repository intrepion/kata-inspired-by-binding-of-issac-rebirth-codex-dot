'use strict';
// Fixture-assisted integration: real production update loop, controlled boss/roll.
(function(){
 const results=[],check=(ok,label)=>{if(!ok)throw Error(label);results.push('PASS '+label);};
 const touch=d=>{game.player.x=d.x;game.player.y=d.y;update(.001);};
 function reward(floorNumber,roll=0){
  game.floor=floorNumber;floor();const boss=game.rooms.find(r=>r.type==='boss');enter(boss);
  game.player.x=480;game.player.y=450;boss.enemies.forEach(e=>e.hp=0);
  random=()=>roll;update(.001);return boss;
 }
 try{
  newGame('SANCTUARY');let boss=reward(2);
  check(boss.dealRoom.type==='deal','first portal is always a Bargain');
  touch(boss.drops.find(d=>d.type==='dealPortal'));check(game.bargainVisited,'entering a Bargain records eligibility');
  touch(game.current.drops.find(d=>d.type==='dealExit'));
  touch(boss.drops.find(d=>d.type==='hatch'));check(game.floor===3&&game.bargainVisited,'declining survives real hatch descent');
  boss=reward(3);check(boss.dealRoom.type==='sanctuary','declined Bargain permits later Sanctuary');
  touch(boss.drops.find(d=>d.type==='dealPortal'));const sanctuary=game.current;
  check(sanctuary.clear&&sanctuary.drops.filter(d=>d.choice).length===2,'Sanctuary starts open with two choices');
  touch(sanctuary.drops.find(d=>d.type==='dealExit'));
  touch(boss.drops.find(d=>d.type==='dealPortal'));
  check(sanctuary.drops.filter(d=>d.choice).length===2,'leaving unchosen preserves both relics');
  const p=game.player,before=p.damage,containers=p.maxHp,coins=p.coins,keysBefore=p.keys;
  touch(sanctuary.drops.find(d=>d.item==='dawn'));
  check(p.damage===before+1&&p.maxHp===containers+2,'Dawn Halo grants health and damage');
  check(p.coins===coins&&p.keys===keysBefore&&!sanctuary.drops.some(d=>d.choice),'free choice consumes neither coins nor keys and removes both relics');
  update(.01);check(p.damage===before+1,'standing on the pedestal cannot collect twice');
  touch(sanctuary.drops.find(d=>d.type==='dealExit'));touch(boss.drops.find(d=>d.type==='dealPortal'));
  check(!sanctuary.drops.some(d=>d.choice),'re-entry does not restore choices');
  boss=reward(4);touch(boss.drops.find(d=>d.type==='dealPortal'));
  touch(game.current.drops.find(d=>d.item==='vigil'));
  check(p.orbit&&p.shields.reduce((n,h)=>n+h.hp,0)===4,'Vigil Seal grants two soul hearts and Orbit Guard');
  newGame('REFUSED');boss=reward(2);touch(boss.drops.find(d=>d.type==='dealPortal'));
  game.player.maxHp=2;game.player.hp=2;const blood=game.current.drops.find(d=>d.item==='blood');touch(blood);
  check(!game.bargainTaken&&game.current.drops.includes(blood),'lethal refused deal does not commit the run');
  game.player.maxHp=6;game.player.hp=6;touch(blood);
  check(game.bargainTaken&&!game.current.drops.includes(blood),'successful heart deal commits the run');
  boss=reward(3);check(boss.dealRoom.type==='deal','purchase prevents Sanctuary even on favorable roll');
  newGame('SKIPPED');reward(2);boss=reward(3);
  check(boss.dealRoom.type==='deal','skipping without entering does not qualify');
  newGame('RESET');check(!game.bargainVisited&&!game.bargainTaken&&!game.player.orbit,'new run resets pact and relic effects');
  game.bargainVisited=true;boss=reward(3,.75);
  check(boss.dealRoom.type==='deal','eligible run can still roll a Bargain');
  newGame('NO-PORTAL');game.floor=3;floor();boss=game.rooms.find(r=>r.type==='boss');enter(boss);
  game.player.x=480;game.player.y=450;game.floorRedDamage=true;boss.enemies.forEach(e=>e.hp=0);random=()=>.75;update(.001);
  check(!boss.dealRoom,'red-damaged floor can fail the portal roll');
  document.querySelector('#result').textContent=results.join('\n');
 }catch(e){document.querySelector('#result').textContent=results.join('\n')+'\nFAIL '+e.message;throw e;}
})();
