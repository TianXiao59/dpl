#!/usr/bin/env node

const start = Date.now();
require('./test/00_env.test.js'); // check if AWS keys are set
const dpl = require('./lib/index.js');
const pkg = require(dpl.utils.getBasepath() + 'package.json');
dpl.copyfiles(); // copy required files & dirs
if (pkg.files_to_deploy.indexOf('.env') > -1) {
  dpl.utils.makeEnvFile();
}
dpl.install_node_modules(); // install only production node_modules
dpl.zip(); // zip the /dist directory
dpl.upload(function (err, data) { // upload the .zip file to AWS:
  let exitcode = 0;
  if (err) {
    console.log('- - -  - - - - - - - - - - - - - - - - - - - - DEPLOY ERROR');
    console.log(err);
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
    exitcode = 1;
  } else {
    console.log('- - - - - - - - > Lambda Function Deployed:');
    console.log(data);
    console.log('- - - - - - - - > took', (Date.now() - start) / 1000, 'seconds');
  }
  dpl.utils.cleanUp(); // delete /dist and .zip file for next time
  process.exit(exitcode);
});
