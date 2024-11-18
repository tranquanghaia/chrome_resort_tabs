document.getElementById('groupTabs').addEventListener('click', async () => {
    run()
});
async function run() {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const domainMap = {};


    console.log(tabs);

    tabs.forEach(tab => {
        const url = new URL(tab.url);
        let domain = url.hostname;
        let tmp = tab.url.split('/');
        if(tmp && tmp[3]){
            domain+=tmp[3];
        }
        if (!domainMap[domain]) {
            domainMap[domain] = [];
        }
       
        domainMap[domain].push(tab.id);
    });

    console.log(domainMap);
    // for (const domain in domainMap) {
    //     const tabIds = domainMap[domain];
    //     await chrome.tabs.group({ tabIds });
    // }
    let sortedTabIds =[];
     for(let domain in domainMap){
        let l = domainMap[domain];
        for(let index in l){
            sortedTabIds.push(l[index]);
        }
     }
    //  const sortedTabIds = Object.values(domainMap).flat();
     sortedTabIds.forEach((tabId, index) => {
         chrome.tabs.move(tabId, { index });
     });

     console.log(sortedTabIds);
}

setTimeout(run,300)