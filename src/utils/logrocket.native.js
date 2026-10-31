import LogRocket from '@logrocket/react-native';

export function initLogRocket(appId) {
    try {
        LogRocket.init(appId);
    } catch (e) {
        console.warn('LogRocket init gagal:', e);
    }
}

export function identifyUser(id, traits) {
    try {
        LogRocket.identify(id, traits);
    } catch (_e) { }
}