import { writable } from "svelte/store";


export const CurrentS = writable({
    id: "",
    genre: "",
    
});

export const CurrentP = writable({
    cPid: "",
    
});

export const lastSong = writable({
    id: "",
    genre: ""
});
