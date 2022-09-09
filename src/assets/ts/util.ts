import SongDetailType = Song.SongDetailType
export function shuffle(source: Array<SongDetailType>) {
    const arr = source.slice();
    for (let i = 0; i < arr.length; i++) {
        const j = getRandomInt(i);
        swap(arr, i, j);
    }
    return arr;
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * (max + 1)); // 0 - max
}

function swap(arr: Array<SongDetailType>, i: number, j: number) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

export function formatTime(interval: number) {
    interval = Math.floor(interval);
    const minute = (Math.floor(interval / 60) + '').padStart(2, '0');
    const second = (interval % 60 + '').padStart(2, '0');
    return `${minute}:${second}`
}