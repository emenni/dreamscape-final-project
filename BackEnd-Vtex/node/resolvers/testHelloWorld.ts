export async function testHelloWorldResolver( _: unknown, {}, ctx: Context) {

  let res = await ctx.clients.testHelloWorld.go()

    ctx.clients.order.listOrders()

  console.log(ctx.clients.order.listOrders)

  return res;

 }




