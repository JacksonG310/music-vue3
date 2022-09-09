import storage from "good-storage";
export type compareType<T> = ($1: T) => boolean;
export const load = (key: string) => {
    return storage.get(key, []);
}


const interArray = <T>(arr: Array<T>, val: T, compare: compareType<T>, maxLen?: number) => {
    const index = arr.findIndex(compare);
    if (index > -1) return;
    arr.unshift(val);
    if (maxLen && arr.length > maxLen) {
        arr.pop();
    }
}
export const save = <T>(item: T, key: string, compare: compareType<T>, maxLen?: number) => {
    const items: Array<T> = storage.get(key, []);
    interArray(items, item, compare);
    storage.set(key, items);
    return items
}



const deleteFromArray = <T>(arr: Array<T>, compare: compareType<T>) => {
    const index = arr.findIndex(compare);
    console.log('index', index);

    if (index > -1) arr.splice(index, 1);
}
export const remove = <T>(key: string, compare: compareType<T>) => {
    const items = storage.get(key, []);
    deleteFromArray(items, compare);
    storage.set(key, items);
    return items;
}
