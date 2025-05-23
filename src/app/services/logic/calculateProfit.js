import { getFirestore, doc, getDoc, getDocs, collection, Timestamp} from "firebase/firestore";

const db = getFirestore();
export const calculateLiveProfit = async (uid, currentPrices) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    // Extract the wallet object or default to an empty object
    const wallet = userSnap.data()?.wallet || {};
    const now = new Date();

    // Initialize base profit and value (e.g., starting at 100 USD)
    if (wallet) {
        let profit = 100;
        let totalValue = 100;
        
        // Iterate through each symbol in the wallet
        for(const symbol in wallet) {
            const { amount, invested } = wallet[symbol];
            const currentPrice = currentPrices[symbol]?.usd; 

            // Only proceed if we have a defined current price
            if(currentPrice !== undefined){
                const currentValue = amount * currentPrice;
                totalValue += amount * currentPrice;
                // Add gain/loss: current value minus amount invested
                profit += currentValue - invested;
            }
        }
        // Package result with Firestore Timestamp for consistency
        const result = {Timestamp : Timestamp.fromDate(now), profit, totalValue};

        return result;
    }

    // Return 0 if no wallet data
    return 0;

};


export const calculateProfitLast9 = async (uid, currentProfit ) => {
    // Fetch historical dailyProfit documents from Firestore
    const snapshot = await getDocs(collection(db, "users", uid, "dailyProfits"));
    const dailyProfits = snapshot.docs.map(doc => doc.data());
    const result = [];

    // Convert each Firestore Timestamp to a human-readable date and value
    for (const dailyProfit of dailyProfits) {
        const date = new Date(dailyProfit.Timestamp.seconds * 1000).toLocaleDateString('en-US',{month: 'short', day: 'numeric'});
        const value = dailyProfit.profit;
        result.push({date, value});
    }
    
    // Append today's profit using currentProfit argument
    result.push({date: new Date().toLocaleDateString('en-US',{month: 'short', day: 'numeric'}), value: currentProfit.profit});
    return result;
}