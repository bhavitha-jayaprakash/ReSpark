// data
const ARKAVS_ELECTRONICS = {
    'smartphone': { name: 'Smartphone', emoji: '📱' },
    'laptop': { name: 'Laptop', emoji: '💻' },
    'tablet': { name: 'Tablet', emoji: '📟' },
    'headphones': { name: 'Headphones', emoji: '🎧' },
    'smartwatch': { name: 'Smartwatch', emoji: '⌚' },
    'camera': { name: 'Camera', emoji: '📷' },
    'keyboard': { name: 'Keyboard', emoji: '⌨️' },
    'mouse': { name: 'Mouse', emoji: '🖱️' },
    'charger': { name: 'Charger', emoji: '🔌' },
    'powerbank': { name: 'Power Bank', emoji: '🔋' },
};

const ARKAVS_CONDITIONS = {
    'good': { text: 'Working Fine', severity: 'green' },
    'slow': { text: 'Running Slow', severity: 'orange' },
    'battery_issue': { text: 'Poor Battery Life', severity: 'orange' },
    'screen_crack': { text: 'Cracked Screen', severity: 'orange' },
    'not_working': { text: 'Not Turning On', severity: 'red' },
    'physical_damage': { text: 'Physical Damage', severity: 'red' },
};


// db
const arkavs_spark_db_v3 = {
    items: [],
    profile: {
        sparkPoints: 0,
        itemsSaved: 0,
        repairs: 0,
        redeemedRewards: [] 
    }
};

function loadDatabase() {
    const db = localStorage.getItem('arkavs_spark_db_v3');
    if (db) {
        return JSON.parse(db);
    } else {
        localStorage.setItem('arkavs_spark_db_v3', JSON.stringify(arkavs_spark_db_v3));
        return arkavs_spark_db_v3;
    }
}

function saveDatabase(db) {
    localStorage.setItem('arkavs_spark_db_v3', JSON.stringify(db));
}

// items
/**
 * Adds an item using predefined keys.
 * @param {string} itemKey - The key for the electronic (e.g., 'smartphone').
 * @param {string} conditionKey - The key for the condition (e.g., 'battery_issue').
 */
function addItem(itemKey, conditionKey) {
    const db = loadDatabase();
    const newItem = {
        id: `item_${Date.now()}`,
        itemKey: itemKey,
        conditionKey: conditionKey,
        createdAt: Date.now(),
    };
    db.items.push(newItem);
    saveDatabase(db);
}

function getItems() {
    return loadDatabase().items;
}

function getItemById(itemId) {
    return loadDatabase().items.find(item => item.id === itemId) || null;
}

function completeItemAction(itemId, action, basePoints, sessionPoints) {
    const db = loadDatabase();
    const totalPointsToAdd = basePoints + sessionPoints;
    db.profile.sparkPoints += totalPointsToAdd;

    if (action === 'repair') db.profile.repairs += 1;
    if (action !== 'recycle') db.profile.itemsSaved += 1;
    
    db.items = db.items.filter(item => item.id !== itemId);
    saveDatabase(db);
}



function getProfile() {
    return loadDatabase().profile;
}

/**
 * Redeems a reward and DEDUCTS points.
 * @param {string} rewardId - The ID of the reward.
 * @param {number} cost - The point cost of the reward.
 */
function redeemReward(rewardId, cost) {
    const db = loadDatabase();
    if (db.profile.sparkPoints >= cost && !db.profile.redeemedRewards.includes(rewardId)) {
        db.profile.sparkPoints -= cost; 
        db.profile.redeemedRewards.push(rewardId);
        saveDatabase(db);
        return true; 
    }
    return false; 
}


// get the current item ID from the URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
