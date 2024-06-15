<script>

    import { Img } from 'flowbite-svelte';
    import Coffee from '$lib/images/coffee.jpg';
    import { Card, Button, Toggle } from 'flowbite-svelte';
    import { Gallery } from 'flowbite-svelte';
    import { Badge } from 'flowbite-svelte';
     import { doc, getFirestore } from "firebase/firestore";
    import { auth , db , storage} from "../../lib/firebase/firebase.client";
    import { setDoc , getDoc } from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
    import { authHandlers, authStore } from "../../stores/authStore";
    import { CurrentS} from '../../stores/store';

let email, uid;
let formattedSongs = [];

authStore.subscribe(curr => {

email = curr?.currentUser?.email
uid = curr?.currentUser?.uid

})

// Shuffle function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let docSnap;

async function getprofile(){

    const docRef = doc(db, "lists", "list");
     docSnap = await getDoc(docRef);
 
     // Retrieve the songs array from the document
     const songsArray = docSnap.data().songs;

        if (docSnap.exists()) {

            // Create a new array variable if needed (optional):
             formattedSongs = songsArray.map((song) => ({
                // Customize the mapping logic to match your desired structure
                id: song.sId,
                name: song.sName,
                thumbnail: song.sThumb,
                genre:song.sGen
                
            }));

             console.table(formattedSongs);
             // Shuffle the array
             formattedSongs = shuffle(formattedSongs);
formattedSongs = formattedSongs.slice(0, 8);
console.table(formattedSongs[0]);
             

        } else {
            console.log("No such document!");
        }
        
    }

    getprofile();

    function changeCurrSong(sid,sg){
     CurrentS.set({
         id:sid,
         genre:sg
     })
   }
 

</script>

   {#if formattedSongs[0]}
   <main>
    <div class="flex flex-col justify-center items-center ">
        <div>
            <h1 class="text-3xl p-4 pt-5 dark:text-white flex items-start">Curated For You</h1>
        </div>
        
        
        <div class=" w-4/5">
            <Gallery class="gap-4 grid-cols-3 cursor-pointer h-screen">
                

                <div class="gap-4 grid grid-rows-3 h-screen">
                   
                    <div class=" cursor-pointer h-screen gap-4 grid grid-flow-row grid-rows-3 ">
                        
                            <div on:click={()=>{changeCurrSong(formattedSongs[0].id,formattedSongs[0].genre)}} class=" hover:scale-105 duration-300 cursor-pointer h-auto max-w- rounded-lg flex items-center justify-center text-6xl font-extrabold bg-red-300">
                                <img height="100%" class=" cursor-pointer rounded-lg h-full w-full object-cover" src={formattedSongs[0].thumbnail} alt="">
                            </div>
                        
                        
                        <div on:click={()=>{changeCurrSong(formattedSongs[1].id,formattedSongs[1].genre)}} class="hover:scale-105 duration-300 h-auto max-w- rounded-lg flex items-center justify-center text-6xl font-extrabold bg-red-300">
                            <img height="100%" class="rounded-lg h-full w-full object-cover" src={formattedSongs[1].thumbnail} alt="">
                        </div>
                        <div on:click={()=>{changeCurrSong(formattedSongs[2].id,formattedSongs[2].genre)}} class="hover:scale-105 duration-300 h-auto max-w- rounded-lg flex items-center justify-center text-6xl font-extrabold bg-red-300">
                            <img height="100%" class="rounded-lg h-full w-full object-cover" src={formattedSongs[2].thumbnail} alt="">
                        </div>
                    </div>
                    
                    
                </div>

                <div class="gap-4  grid grid-flow-row grid-rows-3 h-screen">
                   
                    <div class="gap-4 h-screen grid grid-flow-row grid-rows-4">
                        <div on:click={()=>{changeCurrSong(formattedSongs[3].id,formattedSongs[3].genre)}} class="hover:scale-105 duration-300 h-auto max-w- rounded-lg flex items-center justify-center text-6xl font-extrabold bg-red-300 ">
                            <img height="100%" class="rounded-lg h-full w-full object-cover" src={formattedSongs[3].thumbnail} alt="">
                        </div>
                       
                        <div on:click={()=>{changeCurrSong(formattedSongs[4].id,formattedSongs[4].genre)}} class="hover:scale-105 duration-300 h-auto max-w- rounded-lg flex items-center justify-center text-6xl font-extrabold bg-red-300">
                            <img height="100%" class="rounded-lg h-full w-full object-cover" src={formattedSongs[4].thumbnail} alt="">
                        </div>

                        <div on:click={()=>{changeCurrSong(formattedSongs[5].id,formattedSongs[5].genre)}} class="hover:scale-105 duration-300 h-auto max-w- rounded-lg flex items-center justify-center text-6xl font-extrabold bg-red-300">
                            <img height="100%" class="rounded-lg h-full w-full object-cover" src={formattedSongs[5].thumbnail} alt="">
                        </div>

                        <div on:click={()=>{changeCurrSong(formattedSongs[6].id,formattedSongs[6].genre)}} class="hover:scale-105 duration-300 h-auto max-w- rounded-lg flex items-center justify-center text-6xl font-extrabold bg-red-300">
                            <img height="100%" class="rounded-lg h-full w-full object-cover" src={formattedSongs[6].thumbnail} alt="">
                        </div>
                    </div>
                   
                    
                </div>

                <div class="gap-4 grid grid-flow-row grid-rows-1 h-screen">
                    <div class="hover:scale-105 duration-300 h-screen dark:bg-indigo-800 rounded-lg flex flex-col bg-yellow-400">
                        <h1 class="xl:text-7xl text-4xl p-3 font-semibold text-white">Who Don't Wanna Soul Booostttt ? </h1>
                        
                        <div on:click={()=>{changeCurrSong(formattedSongs[7].id,formattedSongs[7].genre)}} class="hover:scale-105 duration-300  w-full">
                            <img class=" rounded-lg p-4" src={formattedSongs[7].thumbnail} alt="">
                        </div>
                    
                    </div>
                </div>
                
            </Gallery>
             
              <div class="hover:scale-105 duration-300 h-96 dark:bg-red-800 bg-amber-500 text-white  rounded-lg my-4 flex justify-between ">

                <div>
                    <h1 class=" xl:text-6xl font-semibold p-5 px-9 pb-2 text-3xl">Buy Them a Coffee</h1>

                    <h2 class="  font-semibold px-10 xl:text-2xl" >buy Your Fav Artist a Coffee for </h2>

                    <div class="flex mx-10 mt-10">
                        <Badge large color="dark" class="hover:scale-125 duration-300 p-2 px-4 m-1 rounded-lg">$5</Badge>
                        <Badge large color="dark" class="hover:scale-125 duration-300 p-2 px-4 m-1 rounded-lg">$10</Badge>
                        <Badge large color="dark" class="hover:scale-125 duration-300 p-2 px-4 m-1 rounded-lg">$15</Badge>
                    </div>
                </div>

                    <img class="hover:scale-105 duration-300 hover:rounded-lg rounded-r-lg" src={Coffee} alt="">
                
              </div>
        </div>

    </div>
</main>
   {/if} 