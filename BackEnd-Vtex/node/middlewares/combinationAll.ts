export async function combinationAll(ctx: Context, next: () => Promise<any>) {

  ctx.set('Cache-Control','no-cache, no-store, must-revalidate');
  ctx.set('X-VTEX-Use-Https','true')
  ctx.set('Proxy-Authorization','ctx.authToken')
  ctx.set('Authorization', 'ctx.authToken')
  function queryObj(url: string) {
    var result: any = {}, keyValuePairs: any = url.split('?')[1].split("&");
    keyValuePairs.forEach(function(keyValuePair: any) {
      keyValuePair = keyValuePair.split('=')
      const decodeURIName = decodeURIComponent(keyValuePair[0]) as any
      const decodeURIValue = decodeURIComponent(keyValuePair[1]) as any
        result[decodeURIName] = decodeURIValue  || '' ;
    });
    return result;
  }
  const querystring = queryObj(ctx.originalUrl)
  console.log("🚀 ~ file: combinationAll.ts ~ line 18 ~ combinationAll ~ querystring", querystring)

  const res = await ctx.clients.combination.getCombination(`?pageSize=${querystring.pageSize}&index=${querystring.index}`, {
    pageSize: querystring?.pageSize,
    index: querystring?.index
  }).catch((reason: any)=>{
    return reason?.response?.data
  })


  ctx.body = res;

  await next()
}
