import fs from 'fs';
import Router from 'koa-router';

export default async function routerConfig(router: Router) {
  let files = fs.readdirSync('./src/routes');
  for (let file of files) {
    let myImport = await import(`./src/routes/${file}`);
    // console.log(myImport);
    if (
      !['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'].includes(
        myImport.default.method
      )
    )
      throw new Error(
        `File ${file} does not include a valid method [${myImport.default.method}]`
      );

    if (!myImport.default.exec || typeof myImport.default.exec !== 'function')
      throw new Error(
        `File ${file} does not include an exec function or its of different expected type [${
          myImport.default.exec
        } | ${typeof myImport.default.exec}]`
      );
    switch (myImport.default.method) {
      case 'POST': {
        router.post(myImport.default.routename, myImport.default.exec);
      }
      case 'GET': {
        router.get(myImport.default.routename, myImport.default.exec);
      }
      case 'PUT': {
        router.put(myImport.default.routename, myImport.default.exec);
      }
      case 'DELETE': {
        router.delete(myImport.default.routename, myImport.default.exec);
      }
      case 'PATCH': {
        router.patch(myImport.default.routename, myImport.default.exec);
      }
    }
  }
  console.log('SUCCESS');
  //
}
