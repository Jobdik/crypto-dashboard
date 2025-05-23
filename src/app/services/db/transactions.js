import { getFirestore, collection, addDoc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const db = getFirestore();


// Adjusts a user's purchase history when selling assets and computes cost basis of the sold amount.
const transactionsHistorySell = (history, sellAmount) => {  
    let remaining = sellAmount; // Amount left to allocate against purchase history
    let newHistory = []; // Will hold remaining history entries after sale
    let totalCost = 0; // Accumulates cost basis for sold amount

    for(const entry of history) {
        // If we've already sold the full amount, keep the rest of history intact
        if(remaining <= 0){
            newHistory.push(entry);
            continue;
        }
        // If this entry covers less than or equal to what remains to sell,
        // sell the entire entry
        if(entry.amount <= remaining) {
            totalCost += entry.price * entry.amount;
            remaining -= entry.amount;
        }else{
            // Partially consume this entry, subtract sold amount and keep leftover
            totalCost += entry.price * remaining;
            newHistory.push({amount: entry.amount - remaining, price: entry.price, timestamp: entry.timestamp});
            remaining = 0; // Sold everything needed
        }

    }

    return [newHistory, totalCost];
};

// Records a new transaction (buy or sell) for a user and updates their wallet holdings.
export const addTransaction = async (uid, symbol, type, amount, price) => {
    // 1) Persist the transaction in Firestore under user's transactions subcollection
    await addDoc(collection(db, "users", uid, "transactions"), {
        symbol,
        type, 
        amount,
        price,
        timestamp: serverTimestamp()
    })

    // 2) Retrieve the user's current wallet snapshot
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const wallet = userSnap.data?.wallet || {};

    // Get previous state for this symbol
    const prev = wallet[symbol] || {amount : 0, invested: 0, history: []};

    let newAmount = prev.amount;
    let newInvested = prev.invested;
    let history = prev.history; // Clone array to avoid mutation

    // 3) Update wallet fields based on transaction type
    if (type === 'buy') {
        // Increase holdings and total invested cost
        newAmount += amount;
        newInvested += amount * price;
        history.push({amount, price, timestamp: new Date().toISOString()});

    } else if (type === 'sell') {
        // Ensure sufficient balance to sell
        if (newAmount < amount) throw new Error(`Not enough ${symbol} to sell`);
        // Compute new history (FIFO) and cost basis
        const [newHistory, totalCost] = transactionsHistorySell(history, amount);
        newAmount -= amount;
        newInvested -= totalCost;
        history = newHistory;
    }

    // 4) Merge updated token entry back into wallet
    const newWallet = {...wallet, [symbol]: {amount: newAmount, invested: newInvested, history}};

    // 5) Persist the updated wallet back into the user's document
    await setDoc(userRef, {wallet: newWallet}, {merge: true});

};