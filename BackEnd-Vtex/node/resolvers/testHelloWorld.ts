export async function testHelloWorldResolver( _: unknown, {}, ctx: Context) {

  let res = await ctx.clients.testHelloWorld.go()

  console.log("RESPONSE---------->",res)

  return res;

 }




