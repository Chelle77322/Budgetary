let db;
//connects to the indexed db
const request = indexedDB.open('Budgetary',1);

//Now create the object store to store files in
request.onupgradeneeded = function(event){
    const db = event.target.result;
    db.createObjectStore('new_transaction', {
        autoIncrement: true });
};

//Store reference in global db after connection is made
request.onsuccess = function(event){
    db = event.target.result;
}
//Check if the app is either online or offline and upload saved to global db transactions
if(navigator.onLine){
    uploadTransaction();
}
request.onerror = function(event){
    console.log(event.target.errorCode);
};
//Saves the transaction to indexedDB
function saveRecord(record){
    const transaction = db.transaction(['new_transaction'], 'readwrite');
const transObjectStore = transaction.objectStore('new_transaction');
transObjectStore.add(record);
}
//Uploads indexEB data to the mongodb server when you have internet
function uploadTransaction(){
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const transObjectStore = transaction.objectStore('new_transaction');
    const getAll = transObjectStore.getAll();
}
//IF successful; the results property will hold all the data
getAll.onsuccess = function() {
    if(getAll.result.length > 0 ){
        fetch('/api/transaction/bulk', {
            method: 'POST',
            body : JSON.stringify(getAll.result),
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }).then((response)=> response.json()).then((ServerResponse)=> {
            if(ServerResponse.message){
                throw new Error(ServerResponse);
            }
            const transaction = db.transaction(['new_transaction'],'readwrite');
            const transObjectStore = transaction.objectStore('new_transaction');
            transObjectStore.clear();
            alert('All offline transactions have been submitted to Budgetary');
        }).catch((error)=>{
            console.log(error);
        });
    }
}
window.addEventListener('online', uploadTransaction);