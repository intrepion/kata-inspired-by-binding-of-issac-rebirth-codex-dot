'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), rules=require('./core.js');
const player=()=>({keys:1,coins:5,damage:3.5,rate:.3,hp:4,maxHp:6});
test('locked doors cost one key only once and deny entry without one',()=>{let p=player(),room={locked:true};assert.equal(rules.unlock(room,p),true);assert.equal(p.keys,0);assert.equal(rules.unlock(room,p),true);assert.equal(p.keys,0);assert.equal(rules.unlock({locked:true},p),false);});
test('purchases charge only affordable items',()=>{let p=player();assert.equal(rules.buy({price:10},p),false);assert.equal(p.coins,5);assert.equal(rules.buy({price:3},p),true);assert.equal(p.coins,2);});
test('damage, double shot, piercing and splash compose on each projectile',()=>{let p=player();for(let item of ['damage','double','pierce','burst'])rules.apply(item,p);let shots=rules.projectiles(p,390,0);assert.equal(shots.length,2);assert.ok(shots.every(s=>s.damage===5&&s.pierce&&s.burst));assert.ok(shots[0].dy<0&&shots[1].dy>0);});
test('health upgrades expand and heal, fire rate has a lower bound',()=>{let p=player();rules.apply('health',p);assert.equal(p.hp,6);assert.equal(p.maxHp,8);for(let i=0;i<10;i++)rules.apply('rate',p);assert.equal(p.rate,.12);});
