'use strict';
// Non-browser, fixture-assisted production-loop checks. Rendering and native DOM
// behavior still require the HTTP browser fixtures; this harness does not replace QA.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function fixture(name) {
 const elements=new Map(),storage=new Map(),listeners={};
 const element=selector=>{
  if(!elements.has(selector))elements.set(selector,{
   textContent:'',value:'',checked:false,hidden:false,listeners:{},
   classList:{add(){},remove(){},contains(){return false;}},
   addEventListener(type,fn){this.listeners[type]=fn;},
   click(){this.listeners.click?.();},focus(){},
   querySelector:child=>element(selector+' '+child),
   getContext:()=>({})
  });
  return elements.get(selector);
 };
 const context=vm.createContext({
  document:{querySelector:element},window:{addEventListener:(type,fn)=>listeners[type]=fn,dispatchEvent:event=>listeners[event.type]?.(event)},
  localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},
  KeyboardEvent:class { constructor(type,options){this.type=type;Object.assign(this,options);} preventDefault(){} },
  requestAnimationFrame(){},HTMLButtonElement:class{},HTMLInputElement:class{},console
 });
 for(const file of ['core.js','game.js','tests/'+name+'.js'])
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file,timeout:15000});
 const output=element('#result').textContent;
 assert.ok(output.includes('PASS'),output);assert.ok(!output.includes('FAIL'),output);
 return output;
}
test('Sanctuary production-loop fixture (mock DOM, not browser QA)',()=>{fixture('sanctuary');});
test('existing combat/progression fixture (mock DOM, not browser QA)',()=>{fixture('integration');});
test('seeded-layout fixture (mock DOM, not browser QA)',()=>{fixture('seeds');});
