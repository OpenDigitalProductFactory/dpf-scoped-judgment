import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, writeFile, rm, lstat, readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
assert.equal(process.version,'v24.16.0');
assert.equal(manifest.private,true);
assert.equal(manifest.exports?.['.']?.import,'./dist/judgment/index.js','Declare an installed advisory contract');
assert.equal(manifest.exports?.['./bounded-trusted-json']?.types,'./dist/bounded-trusted-json.d.ts','Declare the bounded JSON contract');
assert.deepEqual(manifest.dependencies,{});
const temp=await mkdtemp(join(tmpdir(),'scoped-judgment-installed-'));
const env={...process.env,NODE_PATH:'',NODE_OPTIONS:''};
function run(command,args,cwd=root){
  const result=spawnSync(command,args,{cwd,env,encoding:'utf8'});
  assert.equal(result.status,0,`${command} ${args.join(' ')}:\n${result.stdout}${result.stderr}`);
  return result.stdout;
}
try {
  const packed=JSON.parse(run('npm',['pack','--json','--ignore-scripts','--pack-destination',temp]))[0];
  assert(!packed.files.some(file=>/^(?:packages|node_modules|\.env)(?:\/|$)/.test(file.path)));
  const tarball=join(temp,packed.filename),consumer=join(temp,'consumer');
  await mkdir(join(consumer,'src'),{recursive:true});
  await writeFile(join(consumer,'package.json'),JSON.stringify({name:'installed-scoped-consumer',private:true,type:'module'}));
  run('npm',['install','--engine-strict','--ignore-scripts','--no-audit','--no-fund','--package-lock=false',tarball],consumer);
  const installed=join(consumer,'node_modules',...manifest.name.split('/'));
  assert(!(await lstat(installed)).isSymbolicLink());
  const fixture=await readFile(join(root,'examples/scoped-judgment/src/smoke.ts'),'utf8');
  await writeFile(join(consumer,'src/smoke.ts'),fixture.replaceAll('../kernel/judgment/index.js',manifest.name));
  const exports=Object.keys(manifest.exports).map((key,i)=>`import * as export${i} from '${manifest.name}${key==='.'?'':key.slice(1)}'; void export${i};`).join('\n');
  await writeFile(join(consumer,'src/exports.ts'),exports+`\nimport {DECISION_SCOPES,type DecisionScope} from '${manifest.name}/decision-scopes';
import {isBoundedTrustedJson as bounded} from '${manifest.name}/bounded-trusted-json';
const scope:DecisionScope='wwwd'; if(DECISION_SCOPES.join(',')!=='wwmd,wwwd,wsid'||scope!=='wwwd') throw Error('Scope identity changed');
const assert=(value:unknown,message:string)=>{if(!value)throw Error(message)};
const alias={safe:true}; assert(bounded({a:alias,b:alias,n:null,s:'text',number:3,array:[true,2]}),'ordinary JSON and aliases');
assert(bounded(Object.assign(Object.create(null),{safe:1})),'null prototype JSON');
for(const value of [undefined,NaN,Infinity,()=>1,Symbol('x'),1n,new Date(),Object.create({inherited:1}),new Array(2)]) assert(!bounded(value),'unsupported input admitted');
let getterCalls=0;const getter={get value(){getterCalls++;throw Error('executed getter')}};
assert(!bounded(getter)&&getterCalls===0,'accessor invoked');
let callbackCalls=0;const customArray=Object.setPrototypeOf([1],{toJSON(){callbackCalls++;return []},[Symbol.iterator](){callbackCalls++;return [][Symbol.iterator]()}});
assert(!bounded(customArray)&&callbackCalls===0,'custom array prototype invoked/admitted');
assert(!bounded(Object.setPrototypeOf([1],null)),'null-prototype array admitted');
assert(!bounded(Object.defineProperty({},'hidden',{value:1})),'hidden property admitted');
assert(!bounded({[Symbol('x')]:1}),'symbol property admitted');
assert(!bounded(new Proxy({},{ownKeys(){throw Error('hostile')}})),'hostile proxy admitted');
const cycle:{self?:unknown}={};cycle.self=cycle;assert(!bounded(cycle),'cycle admitted');
let atDepth:unknown=null;for(let i=0;i<16;i++)atDepth={v:atDepth};assert(bounded(atDepth)&&!bounded({v:atDepth}),'depth ceiling changed');
assert(bounded('x'.repeat(1048576))&&!bounded('x'.repeat(1048577)),'character ceiling changed');
assert(bounded(Array(19999).fill(null))&&!bounded(Array(20000).fill(null)),'node ceiling changed');
console.log('bounded JSON normal/adverse contract passed');
`);
  await writeFile(join(consumer,'tsconfig.json'),JSON.stringify({compilerOptions:{target:'ES2022',module:'NodeNext',moduleResolution:'NodeNext',strict:true,types:[],skipLibCheck:false,noEmitOnError:true,outDir:'dist',rootDir:'src'},include:['src/**/*.ts']}));
  run(process.execPath,[join(root,'node_modules/typescript/bin/tsc'),'--project',join(consumer,'tsconfig.json')],consumer);
  run(process.execPath,[join(consumer,'dist/exports.js')],consumer);
  const output=run(process.execPath,['--input-type=module','--eval',"const {runSmoke}=await import('./dist/smoke.js'); console.log(JSON.stringify(runSmoke()));"],consumer);
  const result=JSON.parse(output);assert.equal(result.passed.length,9);
  run(process.execPath,['--input-type=module','--eval',`for(const path of ['${manifest.name}/dist/judgment/index.js','${manifest.name}/packages/validators/src/judgment/index.ts']){try{await import(path);throw Error('Unexported path admitted')}catch(error){if(error.code!=='ERR_PACKAGE_PATH_NOT_EXPORTED')throw error}}`],consumer);
  async function inspect(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const path=join(directory,entry.name);if(entry.isDirectory())await inspect(path);else if(/\.(?:js|ts)$/.test(entry.name)){const text=await readFile(path,'utf8');for(const match of text.matchAll(/(?:from\s*|import\s*\()(["'])([^"']+)\1/g)){assert(!match[2].endsWith('.ts'));if(match[2].startsWith('.'))assert((await lstat(resolve(dirname(path),match[2]))).isFile());}}}}
  await inspect(join(installed,'dist'));
  console.log(JSON.stringify({package:`${manifest.name}@${manifest.version}`,tarballSha256:createHash('sha256').update(await readFile(tarball)).digest('hex'),installedConsumer:'pass',declarations:'pass',boundedJson:'pass',cases:result.passed,qualification:result.qualification,productionConformance:false},null,2));
}finally{await rm(temp,{recursive:true,force:true});}
