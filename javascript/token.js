
function retrieveJWTtoken() {
    const userFromLocalStorage = getWithExpiry("user");
    //const userFromLocalStorage = localStorage.getItem("user");
    console.log(userFromLocalStorage);
    if (userFromLocalStorage) { //si user existe dans le storage local
        const user = JSON.parse(userFromLocalStorage);
        if (user.jwt != null) { //et que le jeton existe aussi
            return {status: "authenticated",msg: "connexion réussie", token: user.jwt};
        };        
    };
    return { status: "anonymous",msg: "merci de vous connecter", token: null};
}

function setWithExpiry(key, value, ttl) {
	const now = new Date()

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key)
		return null
	}
	return item.value
}

// Exporting variables and functions
export { retrieveJWTtoken, setWithExpiry, getWithExpiry };