import json
import boto3
import os
import uuid
from boto3.dynamodb.conditions import Key
from datetime import datetime
import itertools




def responseApi(status,body):
    return {
                "statusCode": status,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": body
            }
    


def combinacao_de_produtos(orders_list):
    orders_list_unraveled = []
    ocurrency_counter = []
    combination_list = []
    counter = 0

    for orders in orders_list:
        orders.sort()
        for index in range(2, len(orders)+1):
            if orders not in orders_list_unraveled:
                orders_list_unraveled.append(list(
                    map(list, itertools.combinations(orders, index))))

    orders_list_unraveled = [
        element for sublist in orders_list_unraveled for element in sublist]

    # print(orders_list_unraveled)

    # Os dois for comparam cada pedido com todos os da lista
    for n in orders_list_unraveled:
        if len(n) <= 1:
            continue
        for i in orders_list_unraveled:
            
            if n == i:
                counter += 1
        # Ordena n para a comparação (para [1,2] ser igual a [2,1])
        n.sort()
        # O if impede que pedidos iguais sejam adicionados repetidamente
        if n not in combination_list:
            ocurrency_counter.append(counter)
            combination_list.append(n)
        counter = 0
    """Junta as duas lista em uma só tupla. O primeiro número representa as
    repeticoes e a lista representa o pedido com a ID dos itens"""
    ranked_orders_list = list(zip(ocurrency_counter, combination_list))
    # Arruma a lista pela ordem decrescente de repeticoes do pedido
    ranked_orders_list.sort(reverse=True)

    ranked_orders_dict = [{"Ocorrencia": i[0], "ID": i[1]}
                          for i in ranked_orders_list]

    return ranked_orders_dict

def insertIntoTable(table,combination,order):
    try:
        table.put_item(
            Item = {
                'combination': ",".join(combination["ID"]),
                'combinationId': f"{uuid.uuid4()}",
                "orderDate": order["orderDate"],
                "createDate": datetime.now().strftime("%Y-%m-%d"),
                "occurrences": combination["Ocorrencia"],
                "showInShop": False,
            }
        )
        return True
    except Exception as e:
        return e

def lambda_handler(event, context):
    client = boto3.resource('dynamodb')
    table = client.Table(os.environ['TABLE']) 
    
    # combination = ",".join(event['body'][0])
    if not event['body']:
        return responseApi(400,{"message": "body is required"})
    event['body'] = json.loads(event['body'])
    if len(event['body']) <= 0:
        return responseApi(400,{"message": "items is required"})
        
    for order in event['body']:
        countError = 0
        countSuccess = 0
        errors = []
        if not 'items' in order:
            countError += 1
            errors.append('No items in order');
            continue
        
        combinations = combinacao_de_produtos(order["items"])
        for combination in combinations:
            try:
                response = table.query(KeyConditionExpression=Key('combination').eq(",".join(combination["ID"])))
                # Items []
                # []
                if 'Items' in response:
                    if len(response["Items"]) > 0:
                        updateCombination = response["Items"][0]
                        updateCombination["occurrences"] += combination["Ocorrencia"]
                        
                        table.update_item(
                             Key={
                                'combination': updateCombination["combination"],
                                'combinationId': updateCombination["combinationId"]
                            },
                            UpdateExpression="set occurrences = :r",
                            ExpressionAttributeValues={
                                ':r': updateCombination["occurrences"],
                            }
                        )
                        
                    else:
                        resultInserted = insertIntoTable(table,combination,order)
                        if resultInserted != True: 
                            raise resultInserted
                        
                    
                else:
                    resultInserted = insertIntoTable(table,combination,order)
                    if resultInserted != True: 
                        raise resultInserted
                    
                countSuccess += 1
            except Exception as e:
                countError += 1
                errors.append(f"Combinação {','.join(combination['ID'])} não pode ser criada")

    if countError > 0:
        if countSuccess == 0: 
            return responseApi(200,json.dumps({
                            'statusCode': '200',
                            "success": countSuccess,
                            "errors":  countError,
                            "errorInfo": errors,
                            "message": "Não há combinações para serem criadas e algumas combinações apresentaram error"
                        }))
            
            
        return responseApi(200,json.dumps({
                            "statusCode": "200",
                            "success": countSuccess,
                            "errors":  countError,
                            "errorInfo": errors,
                            "message": "Algumas combinações apresentaram error"
                        }))
    

    else:
        if countSuccess == 0: 
            return responseApi(200,json.dumps({
                            'statusCode': '200',
                            "success": countSuccess,
                            "message": "Não há combinações para serem criadas"
                        }))
        
        
        
        return responseApi(200,json.dumps({
                            'statusCode': '200',
                            "success": countSuccess,
                            "message": "Todas as combinações foram criadas com sucesso"
                        }))