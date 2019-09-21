const serverInfo = {
    url: 'https://conseil-dev.cryptonomic-infra.tech:443',
    apiKey: 'hooman'
};

function refreshTable(blocks = []) {
    const tableRef = document.getElementById('query-table').getElementsByTagName('tbody')[0];
    tableRef.innerHTML = '';
    blocks.map((block, index) => {
        const row = tableRef.insertRow(index);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.innerHTML = block.level;
        cell2.innerHTML = new Date(block.timestamp).toLocaleString();
        cell3.innerHTML = block.hash;
    });
}

async function getBlocks(network, query) {
    const blocks = await conseiljs.TezosConseilClient.getBlocks(serverInfo, network, query);
    refreshTable(blocks);
}

function onClickGo(event) {
    event.preventDefault();

    const order = document.getElementById('order-select').value;
    const limit = parseInt(document.getElementById('limit-input').value);

    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'level', 'timestamp', 'hash');
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, 'level', order);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, limit);

    getBlocks('alphanet', query);
}

async function fetchMetadata() {
    const platformResult = await conseiljs.ConseilMetadataClient.getPlatforms(serverInfo);
    const platform = platformResult[0]['name'];

    const networksResult = await conseiljs.ConseilMetadataClient.getNetworks(serverInfo, platform);
    const network = networksResult[0]['name'];

    const entityResult = await conseiljs.ConseilMetadataClient.getEntities(serverInfo, platform, network);
    const blocks = Array.from(entityResult).filter(v => v['name'] === 'blocks')[0]['name'];

    const attributeResult = await conseiljs.ConseilMetadataClient.getAttributes(serverInfo, platform, network, blocks);
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') { fetchMetadata(); }
}

const platform = 'tezos';
const network = 'alphanet';
const entity = 'operations';

async function listAccountTransactions() {
    let sendQuery = conseiljs.ConseilQueryBuilder.blankQuery();
    sendQuery = conseiljs.ConseilQueryBuilder.addFields(sendQuery, 'block_level', 'timestamp', 'source', 'destination', 'amount', 'fee', 'counter');
    sendQuery = conseiljs.ConseilQueryBuilder.addPredicate(sendQuery, 'kind', conseiljs.ConseilOperator.EQ, ['transaction'], false);
    sendQuery = conseiljs.ConseilQueryBuilder.addPredicate(sendQuery, 'source', conseiljs.ConseilOperator.EQ, ['tz1WpPzK6NwWVTJcXqFvYmoA6msQeVy1YP6z'], false);
    sendQuery = conseiljs.ConseilQueryBuilder.addPredicate(sendQuery, 'status', conseiljs.ConseilOperator.EQ, ['applied'], false);
    sendQuery = conseiljs.ConseilQueryBuilder.addOrdering(sendQuery, 'block_level', conseiljs.ConseilSortDirection.DESC);
    sendQuery = conseiljs.ConseilQueryBuilder.setLimit(sendQuery, 100);

    let receiveQuery = conseiljs.ConseilQueryBuilder.blankQuery();
    receiveQuery = conseiljs.ConseilQueryBuilder.addFields(receiveQuery, 'block_level', 'timestamp', 'source', 'destination', 'amount', 'fee', 'counter');
    receiveQuery = conseiljs.ConseilQueryBuilder.addPredicate(receiveQuery, 'kind', conseiljs.ConseilOperator.EQ, ['transaction'], false);
    receiveQuery = conseiljs.ConseilQueryBuilder.addPredicate(receiveQuery, 'destination', conseiljs.ConseilOperator.EQ, ['tz1WpPzK6NwWVTJcXqFvYmoA6msQeVy1YP6z'], false);
    receiveQuery = conseiljs.ConseilQueryBuilder.addPredicate(receiveQuery, 'status', conseiljs.ConseilOperator.EQ, ['applied'], false);
    receiveQuery = conseiljs.ConseilQueryBuilder.addOrdering(receiveQuery, 'block_level', conseiljs.ConseilSortDirection.DESC);
    receiveQuery = conseiljs.ConseilQueryBuilder.setLimit(receiveQuery, 100);

    const sendResult = await conseiljs.ConseilDataClient.executeEntityQuery(serverInfo, platform, network, entity, sendQuery);
    const receiveResult = await conseiljs.ConseilDataClient.executeEntityQuery(serverInfo, platform, network, entity, receiveQuery);
    const transactions = sendResult.concat(receiveResult).sort((a, b) => { return a['timestamp'] - b['timestamp'] });

    //console.log(`${util.inspect(transactions, false, 2, false)}`);
    console.log(transactions);
}

listAccountTransactions();