import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateRisk, appendJournal, readJournal, journalKey } from '../src/lib/analyst-tools.js';
test('risk sizing uses absolute stop distance for either scenario', () => {
  assert.deepEqual(calculateRisk({capital:1000,riskPercent:1,entry:100,stop:95}),{risk:10,units:2,notional:200});
  assert.deepEqual(calculateRisk({capital:1000,riskPercent:1,entry:100,stop:105}),{risk:10,units:2,notional:200});
  for(const override of [{entry:95,stop:95},{capital:0},{stop:-1},{riskPercent:101},{capital:Infinity}]) assert.equal(calculateRisk({capital:1000,riskPercent:1,entry:100,stop:95,...override}),null);
});
test('journal appends immutable snapshots, isolates account and symbol, preserves corrupt data',()=>{
  const data=new Map();const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
  const draft={hypothesis:'Rango',invalidation:'Pierde el soporte',checks:[0,1]};
  const first=appendJournal(storage,'one','BTC',draft);
  appendJournal(storage,'one','BTC',{...draft,hypothesis:'Ruptura'});
  assert.equal(readJournal(storage,'one','BTC').length,2);
  assert.deepEqual(readJournal(storage,'one','BTC')[0],first[0]);
  assert.deepEqual(readJournal(storage,'two','BTC'),[]);assert.deepEqual(readJournal(storage,'one','SOL'),[]);
  data.set(journalKey('one','SOL'),'original-broken');assert.throws(()=>appendJournal(storage,'one','SOL',draft));assert.equal(data.get(journalKey('one','SOL')),'original-broken');
});
