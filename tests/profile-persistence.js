'use strict';
(function(){const out=document.querySelector('#result');try{
 const phase='profile-fixture-phase',original='profile-fixture-original';
 if(!sessionStorage.getItem(phase)){
  sessionStorage.setItem(original,JSON.stringify(Object.fromEntries(Object.entries(profileKeys).map(([id,key])=>[id,localStorage.getItem(key)]))));
  for(const key of Object.values(profileKeys))localStorage.removeItem(key);
  profiles={scout:false,vanguard:false};displayUnlock();
  newGame();game.floor=2;floor();let boss=game.rooms.find(r=>r.type==='boss');enter(boss);boss.enemies=[];game.floorRedDamage=true;update(.01);if(profiles.vanguard)throw Error('Vanguard unlocked despite red damage');
  newGame();game.floor=2;floor();boss=game.rooms.find(r=>r.type==='boss');enter(boss);boss.enemies=[];update(.01);if(!profiles.vanguard||!loadProfile('vanguard'))throw Error('Vanguard unlock not saved');
  newGame();game.floor=4;floor();boss=game.rooms.find(r=>r.type==='boss');enter(boss);boss.enemies=[];update(.01);if(!profiles.scout||!loadProfile('scout'))throw Error('Scout unlock not saved');
  sessionStorage.setItem(phase,'verify');location.reload();return;
 }
 if(!profiles.scout||!profiles.vanguard||profileOptions.scout.hidden||profileOptions.vanguard.hidden)throw Error('Profiles missing after reload');
 profileSelects.scout.click();newGame();let p=game.player;if(p.hp!==4||p.maxHp!==4||p.speed!==215||p.keys!==2||p.coins!==3||p.bombs!==1)throw Error('Scout start incorrect');
 profileSelects.vanguard.click();if(profileSelects.scout.checked)throw Error('Selection not exclusive');newGame();p=game.player;if(p.hp!==8||p.maxHp!==8||p.speed!==165||p.keys!==1||p.coins!==0||p.bombs!==0)throw Error('Vanguard start incorrect');
 const saved=JSON.parse(sessionStorage.getItem(original));for(const [id,key] of Object.entries(profileKeys)){if(saved[id]===null)localStorage.removeItem(key);else localStorage.setItem(key,saved[id]);}sessionStorage.removeItem(original);sessionStorage.removeItem(phase);
 Object.defineProperty(window,'localStorage',{configurable:true,get(){throw Error('storage denied');}});profiles={scout:false,vanguard:false};let stored=saveProfile('scout');if(stored||!profiles.scout||profileOptions.scout.hidden)throw Error('Session-only storage fallback failed');
 out.textContent='PASS red damage prevents Vanguard unlock\nPASS both boss conditions unlock and save profiles\nPASS unlocks survive reload\nPASS Scout and Vanguard start with documented tradeoffs\nPASS only one unlocked start can be selected\nPASS denied storage retains session unlock and reports failure';
 }catch(e){out.textContent='FAIL '+e.message;throw e;}})();
