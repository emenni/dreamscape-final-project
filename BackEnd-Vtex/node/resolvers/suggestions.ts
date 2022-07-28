export async function gqlSuggestions( _: unknown, {}, ctx: Context) {


  console.log('RESPONSE ----->',ctx.clients.suggestion);

  const res = await ctx.clients.suggestion.getSuggestionAll('').catch((reason: any)=>{
    return reason?.response?.data
  })


  ctx.body = res;

    return res;

 }
