import * as SecureStore from "expo-secure-store";

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
