import * as SecureStore from "expo-secure-store"; //https://docs.expo.dev/versions/latest/sdk/securestore/
// denne funktion gemmer og kryptere key værdier lokalt på enheden
class StoreManager {
    static async save(key, value) {
        await SecureStore.setItemAsync(key, value);
    }

    static async getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);

        return result ? result : undefined;
    }
    static async deleteValueFor(key) {
        await SecureStore.deleteItemAsync(key)

    }
}

export default StoreManager;
