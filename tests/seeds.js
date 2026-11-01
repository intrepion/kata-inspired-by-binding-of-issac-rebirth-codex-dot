'use strict';
(function(){const out=document.querySelector('#result'),results=[];const check=(ok,msg)=>{if(!ok)throw Error(msg);results.push('PASS '+msg);};try{
 const signature=()=>JSON.stringify(game.rooms.map(r=>({x:r.x,y:r.y,type:r.type,doors:Object.keys(r.doors).sort(),hidden:Object.keys(r.hiddenDoors).sort(),drops:r.drops.map(d=>({type:d.type,item:d.item,effect:d.effect}))})));
 seedInput.value='  abc  ';document.querySelector('#start').click();check(game.seed==='ABC'&&game.customSeed&&seedInfo.textContent.includes('ABC')&&pauseSeed.textContent.includes('unlocks disabled'),'entered seed is normalized and displayed');const first=signature();
 for(let i=0;i<100;i++)random();game.floor=2;floor();const second=signature();
 newGame('abc');check(signature()===first,'same seed reproduces first floor and initial items');game.floor=2;floor();check(signature()===second,'same seed reproduces later floor despite prior random use');
 newGame('OTHER');check(signature()!==first,'different seed changes the generated floor');
 profiles={scout:false,vanguard:false};lanternUnlocked=false;newGame('ABC');game.floor=2;floor();let boss=game.rooms.find(r=>r.type==='boss');enter(boss);boss.enemies=[];game.floorRedDamage=false;update(.01);check(!profiles.vanguard,'entered seed cannot unlock Vanguard');
 game.floor=4;floor();boss=game.rooms.find(r=>r.type==='boss');enter(boss);boss.enemies=[];update(.01);check(!profiles.scout,'entered seed cannot unlock Scout');
 game.current.drops=[{type:'victory',x:480,y:320}];game.player.x=480;game.player.y=320;update(.01);check(!game&&!lanternUnlocked&&unlockStatus.textContent.includes('no unlocks'),'seeded victory does not unlock Lantern');
 seedInput.value='';newGame();check(!game.customSeed&&game.seed.length>0,'blank seed generates an eligible random run');out.textContent=results.join('\n');
 }catch(e){out.textContent=results.join('\n')+'\nFAIL '+e.message;throw e;}})();
