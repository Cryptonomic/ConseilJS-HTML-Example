const serverInfo = {
    url: '',
    apiKey: ''
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
    const platformResult = await conseiljs.ConseilMetadataClient.getPlatforms(serverInfo.url, serverInfo.apiKey);
    const platform = platformResult[0]['name'];

    const networksResult = await conseiljs.ConseilMetadataClient.getNetworks(serverInfo.url, serverInfo.apiKey, platform);
    const network = networksResult[0]['name'];

    const entityResult = await conseiljs.ConseilMetadataClient.getEntities(serverInfo.url, serverInfo.apiKey, platform, network);
    const blocks = Array.from(entityResult).filter(v => v['name'] === 'blocks')[0]['name'];

    const attributeResult = await conseiljs.ConseilMetadataClient.getAttributes(serverInfo.url, serverInfo.apiKey, platform, network, blocks);
}

document.addEventListener("DOMContentLoaded", (event) => { fetchMetadata(); });
