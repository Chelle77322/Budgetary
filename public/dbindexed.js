let db;
//connects to the indexed db
const request = indexedDB.open('Budgetary',1);

//Now create the object store to store files in
request.onupgradeneeded = function(event){
    const db = event.target.result;
    db.createObjectStore('new_transactions', {
        autoIncrement: true });
        console.log(db);
};

//Store reference in global db after connection is made
request.onsuccess = function(event){
    db = request.result;
    console.log("Database opened successfully:" + db );

//Check if the app is either online or offline and upload saved to global db transactions
if(navigator.onLine){
    uploadTransaction();
}
};
request.onerror = function(event){
    console.log(event.target.errorCode);
};
//Saves the transaction to indexedDB
function saveRecord(record){
    const transactions = db.transactions(['new_transactions'], 'readwrite');
const transObjectStore = transactions.objectStore('new_transactions');
transObjectStore.add(record);
}
//Uploads indexEB data to the mongodb server when you have internet
function uploadTransaction(){
    const transactions = db.transactions(['new_transactions'], 'readwrite');
    const transObjectStore = transactions.objectStore('new_transactions');
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
            const transactions = db.transactions(['new_transactions'],'readwrite');
            const transObjectStore = transactions.objectStore('new_transactions');
            transObjectStore.clear();
            alert('All offline transactions have been submitted to Budgetary');
        }).catch((error)=>{
            console.log(error);
        });
    }
}
window.addEventListener('online', uploadTransaction);