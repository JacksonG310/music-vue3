import { computed, Ref } from "vue";
import { useStore } from "vuex";
import { FAVOURITE_KEY } from "@/assets/ts/constants";
import { save, remove, } from "@/assets/ts/array-store";
import SongDetailType = Song.SongDetailType;
export default function useFavourite() {
    const maxLen = 100;
    const store = useStore();
    const favouriteList: Ref<Array<SongDetailType>> = computed(() => store.state.favouriteList);
    const isFavourite = (song: SongDetailType) => {
        return favouriteList.value.findIndex(item => item.id === song.id) > -1;
    }

    const getFavouriteIcon = (song: SongDetailType) => {
        return isFavourite(song) ? 'icon-favourite' : 'icon-not-favourite'
    }

    const toggleFavourite = (song: SongDetailType) => {

        let list;
        const compare = (item: SongDetailType) => {
            return item.id === song.id;
        }
        if (isFavourite(song)) {
            // remove
            list = remove(FAVOURITE_KEY, compare);
        } else {
            // save
            list = save(song, FAVOURITE_KEY, compare, maxLen);
        }

        store.commit('setFavouriteList', list);
    }
    return {
        toggleFavourite,
        getFavouriteIcon
    }
}