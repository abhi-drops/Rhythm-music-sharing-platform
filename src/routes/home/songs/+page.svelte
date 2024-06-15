<script>
   import { onMount } from 'svelte';
   import { Search, Button } from 'flowbite-svelte';
   import { Gallery } from 'flowbite-svelte';
   import { doc, getFirestore } from "firebase/firestore";
   import { auth , db , storage} from "../../../lib/firebase/firebase.client";
   import { setDoc , getDoc } from "firebase/firestore"; 
   import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
   import { authHandlers, authStore } from "../../../stores/authStore";
   import { CurrentS} from '../../../stores/store';
   import { fade , blur ,slide ,scale} from 'svelte/transition';
 
   let email,uid,up ,username,bio,mySongs,likedSongs,formattedSongs, myplaylists,formattedmyplaylists,docSnap2;
   let query = '';
   let searchResults = [];
 
   authStore.subscribe(curr => {
     email = curr?.currentUser?.email
     uid = curr?.currentUser?.uid
   });
 
   let docSnap;
 
   async function getprofile(){
     const docRef = doc(db, "users", uid );
     docSnap = await getDoc(docRef);
 
     if (docSnap.exists()) {
       up = docSnap.data().userpic;
       username = docSnap.data().username;
       bio = docSnap.data().bio;
       likedSongs = docSnap.data().likedSongs; 
       
       formattedSongs = likedSongs.map((song) => ({
         id: song.sId,
         name: song.sName,
         thumbnail: song.sThumb,
         genre:song.sGen
       }));
 
       console.table(formattedSongs);
     } else {
       console.log("No such document!");
     }
   }
 
   getprofile();
 
   async function searchSongs() {
    if(query){
      console.log("query: "+ query);
 
      const docRef = doc(db, "lists", "list");
      docSnap2 = await getDoc(docRef);

      // Retrieve the songs array from the document
      const songsArray = docSnap2.data().songs;

      // Filter the songs based on the query
      searchResults = songsArray.filter(song => {
          // Check for both exact title match and partial match
          return song.sName.toLowerCase().includes(query.toLowerCase());
      });
      
      console.log(searchResults);
    }
   }
 
   function changeCurrSong(sid,sg){
     CurrentS.set({
         id:sid,
         genre:sg
     })
   }
 
 </script>
 
 <main>
   <div class="flex flex-col justify-center pt-4 items-center">
 
     <div>
       <h1 class="text-3xl p-4 pt-5 dark:text-white flex items-start">Songs</h1>
     </div>
 
     <div class="w-2/4">
       <form class="flex gap-2" on:submit|preventDefault>
         <input bind:value={query} type="text" class="w-full rounded-lg border-lime-500 dark:border-indigo-600 bg-lime-100 dark:bg-white" placeholder="song name">
         <Button on:click={searchSongs} color="" class="!p-2.5 bg-lime-600 text-white hover:bg-lime-800 dark:bg-indigo-800 dark:hover:bg-indigo-950">
           <i class="fa-solid fa-magnifying-glass"></i>
         </Button>
       </form>
     </div>
 
 
   </div>
 
   <div class="w-full flex flex-col items-center mt-10">
     <h1 class="w-4/5 text-2xl px-24 pt-10 text-lime-950 dark:text-white flex items-start font-medium"> Search Result :</h1>
     {#if searchResults.length > 0}
     <div class="bg-lime-600 w-4/6 rounded-lg mt-5 p-4 dark:bg-slate-900" transition:fade={{ delay: 250, duration: 300 }} >
       <div class="w-full flex justify-center items-center p-4 py-20">
         <Gallery class="gap-4 grid-cols-4 w-4/5 pt-2">
           {#each searchResults as result}
             <div on:click={()=>{changeCurrSong(result.sId,result.sGen)}} class="flex flex-col items-center hover:scale-105 duration-300 cursor-pointer">
               <img src={result.sThumb} alt="shoas" class="h-auto max-w- rounded-lg aspect-square object-cover cursor-pointer" />
               <h1 class="text-xl p-1 text-white">{result.sName}</h1>
             </div>
           {/each}
         </Gallery>
       </div>
     </div>
     {:else}
      <p class="dark:text-white">No results found</p>
   {/if}
   </div>

   <div class="w-full flex flex-col items-center mt-10">
         
      <h1 class=" w-4/5 text-2xl px-24 pt-10 text-lime-950 dark:text-white flex items-start font-medium"> Liked Songs :</h1>
   

      <div class=" bg-lime-600 w-4/6 rounded-lg mt-5 p-4 dark:bg-slate-900">
        
         <div class=" w-full flex justify-center items-center p-4 py-20">
            <Gallery class="gap-4 grid-cols-4 w-4/5 pt-2">
               {#if formattedSongs}
                    {#each formattedSongs as song}
                  <div on:click={()=>{changeCurrSong(song.id,song.genre)}} class="flex flex-col items-center hover:scale-105 duration-300 cursor-pointer">
                  <img  src={song.thumbnail} alt="shoas" class="h-auto max-w- rounded-lg aspect-square object-cover cursor-pointer" />
                  <h1 class=" text-xl p-1  text-white">{song.name}</h1>
                  </div>
                  {/each}
                  {/if}
               </Gallery>
         </div>
      </div>
  </div>
      
 </main>
 