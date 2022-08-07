


export async function createOldOrdersCombinations(ctx: InstalledAppEvent, next: () => Promise<any>) {


  let pagesCount = 2;
  let errorsCount = 0;
  let countOrders = 0
  let orders: any = []
  async function sendToAWS(data: any) {// Envia todos os dados para aws
    await ctx.clients.combination.deleteCombination(`/deleteAll`)
      .then(async (response) => {
        console.log("🚀 ~ ", response)
        await ctx.clients.combination.postOrganizer('/organizer', data)
        .then((response: any) => {
          if (response?.data?.countError) {
            errorsCount += response?.data?.countError
          }
        }).catch(() => {
          errorsCount += 1
        })
      })
      .catch((error: any) => console.log(error))

  }

  let page = 1;
  while ( page <= pagesCount ){ // Pega todos os pedidos do cliente
    await ctx.clients.masterDataCustom.getData(page, 100)
      .then((res: any) => {
      if (page === 1) {
        const restContentRange = res.headers['rest-content-range'];
        const total = Number(restContentRange.split('/')[1]);
        pagesCount = total / 100  <= 1 ? 1 : Math.ceil(total / 100)
      }
      if (res?.data) {
        orders = orders.concat(res?.data)
      }
      page++
    })
      .catch(() => {
        page++
    })
  }
  //@ts-ignore
  const resMap = await orders.map(async (order: any, index: number) => { //Filtro de informações
    const orderItems = await order?.items.map(async (item: any) => {
      return item.id
    })
    const items = await Promise.all(orderItems);
    countOrders += 1
    return {
      items: [items],
      orderDate: order.creationDate.split('T')[0]
    }

  });

  const resultBody = await Promise.all(resMap);
  if (countOrders > 0) {
    await sendToAWS(resultBody)
    ctx.vtex.logger.info({
      setupAppConfigurationInfo: {
        status: 'success',
        content: `Um total de ${countOrders} pedidos geraram novas combinações`,
      },
    });
  }
  if (errorsCount > 0) {
    ctx.vtex.logger.error({
      setupAppConfigurationError: {
        status: 'failed',
        content: `Ocorreu um erro em ${errorsCount} pedidos na hora de gerar combinações`,
      },
    });
  }
  await next()
}
