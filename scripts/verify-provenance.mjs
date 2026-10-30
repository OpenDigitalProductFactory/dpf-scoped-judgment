import {readFileSync,lstatSync} from 'node:fs';
import {createHash} from 'node:crypto';
const p=JSON.parse(readFileSync(new URL('../PROVENANCE.json',import.meta.url),'utf8'));
for(const f of p.files){
 if(f.path.startsWith('/')||f.path.split('/').includes('..'))throw Error('Unsafe source path');
 const u=new URL('../'+f.path,import.meta.url);if(!lstatSync(u).isFile()||lstatSync(u).isSymbolicLink())throw Error('Expected regular source '+f.path);
 const b=readFileSync(u);if(b.length!==f.bytes||createHash('sha256').update(b).digest('hex')!==f.sha256)throw Error('Source drift: '+f.path);
 const gitHash=createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');if(gitHash!==f.gitBlob)throw Error('Git identity drift: '+f.path);
}
console.log(JSON.stringify({component:p.component,files:p.files.length,sourceRevision:p.sourceRevision,sourceIdentity:'pass',productionConformance:false}));
