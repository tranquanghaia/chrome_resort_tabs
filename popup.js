
async function run(isGroup) {
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
    //     // Tạo một nhóm cho từng domain
    //     await chrome.tabs.group({ tabIds });
    // }
    let sortedTabIds =[];
     // Sắp xếp các tab theo thứ tự domain
     for(let domain in domainMap){
        let l = domainMap[domain];
        for(let index in l){
            sortedTabIds.push(l[index]);
        }
     }
    //  const sortedTabIds = Object.values(domainMap).flat();
     // Đổi vị trí các tab
    //  sortedTabIds.forEach((tabId, index) => {
    //      chrome.tabs.move(tabId, { index });

    //      chrome.tabs.sendMessage(tabId, { action: "reloadIcon" ,tabIndex:index}, (response) => {
    //         if (chrome.runtime.lastError) {
    //             console.log(`Error sending message to tab ${tabId}:`, chrome.runtime.lastError);
    //         } else {
    //             console.log(`Response from tab ${tabId}:`, response);
    //         }
    //     });
    //  });

     console.log(sortedTabIds);

       
    // Lấy tất cả các tab đang mở
     
        const urlMap = {};
        const tabsToClose = [];

        // Duyệt qua các tab và tìm URL trùng lặp
        tabs.forEach(tab => {
            if (tab.url) {
                if (urlMap[tab.url]) {
                    // Nếu URL đã tồn tại, thêm tab vào danh sách để đóng
                    tabsToClose.push(tab.id);
                } else {
                    // Nếu chưa có, lưu lại URL
                    urlMap[tab.url] = true;
                }
            }
        });

        // console.log(tabsToClose);
        
        // Đóng các tab trùng lặp
        if (tabsToClose.length > 0) {
            chrome.tabs.remove(tabsToClose, () => {
                // console.log(`Closed ${tabsToClose.length} duplicate tab(s).`);
            });
        } else {
            // console.log('No duplicate tabs found.');
        }
}

setTimeout(run,300)