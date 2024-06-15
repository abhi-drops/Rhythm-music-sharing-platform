<script>
   
    import { Search, Button } from 'flowbite-svelte';

  import { Gallery } from 'flowbite-svelte';
  import { doc, getFirestore } from "firebase/firestore";
    import { auth , db , storage} from "../../../lib/firebase/firebase.client";
    import { setDoc , getDoc } from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
    import { authHandlers, authStore } from "../../../stores/authStore";
    import { CurrentS} from '../../../stores/store';
    import { fade , blur ,slide ,scale} from 'svelte/transition';
 
 
let email,uid,up ,username,bio,mySongs,formattedSongs, myplaylists,likedplaylists,formattedmyplaylists,docSnap2;
let query = '';
let searchResults = [];

authStore.subscribe(curr => {

    email = curr?.currentUser?.email
    uid = curr?.currentUser?.uid
    
    })

    let docSnap;

    async function getprofile(){
        const docRef = doc(db, "users", uid );
        docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            up = docSnap.data().userpic;
            username = docSnap.data().username;
            bio = docSnap.data().bio;
           

            likedplaylists = docSnap.data().likedplaylists; 
            
            // Create a new array variable if needed (optional):
             formattedmyplaylists = likedplaylists.map((p) => ({
                // Customize the mapping logic to match your desired structure
                pName: p.pName,
                pid: p.pid
                
            }));

             console.table(formattedmyplaylists);
            

        } else {
            console.log("No such document!");
        }
        
    }

    getprofile();

    async function searchPlay() {
    if(query){
        console.log("query: "+ query);
 
        const docRef = doc(db, "lists", "list");
        docSnap2 = await getDoc(docRef);

        // Retrieve the songs array from the document
        const songsArray = docSnap2.data().playlists;

        // Filter the songs based on the query
        searchResults = songsArray.filter(song => {
            // Check for both exact title match and partial match
            return song.pName.toLowerCase().includes(query.toLowerCase());
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
                <h1 class="text-3xl p-4 pt-5 dark:text-white flex items-start">Playlists</h1>
            </div>
            <div class="w-2/4">
                <form class="flex gap-2" on:submit|preventDefault>
                  <input bind:value={query} type="text" class="w-full rounded-lg border-lime-500 dark:border-indigo-600 bg-lime-100 dark:bg-white" placeholder="song name">
                  <Button on:click={searchPlay} color="" class="!p-2.5 bg-lime-600 text-white hover:bg-lime-800 dark:bg-indigo-800 dark:hover:bg-indigo-950">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </Button>
                </form>
              </div>
            
           </div>

           
           <div class="w-full flex flex-col items-center mt-10">
         
            <h1 class=" w-4/5 text-2xl px-24 pt-10 text-lime-950 dark:text-white flex items-start font-medium"> Search Result :</h1>
         
            {#if searchResults.length > 0}
            <div class=" bg-lime-600 w-4/6 rounded-lg mt-5 p-4 dark:bg-slate-900" transition:fade={{ delay: 250, duration: 300 }} >
              
               <div class=" w-full flex justify-center items-center p-4 py-20">
                  <Gallery class="gap-4 grid-cols-4 w-4/5 pt-2">
                    {#each searchResults as result}
                     <div class="flex flex-col items-center hover:scale-105 duration-300 ">
                        <div on:click={
                            ()=> {
                                window.location.href='/home/playlistView/' + result.pid ;
                            }
                        }   class="bg-lime-700 rounded-lg  dark:bg-violet-950">
                            <h1 class="md:text-6xl text-4xl md:pb-16 px-3 pb-10 text-lime-200 dark:text-white "> <i class="fa-solid fa-compact-disc fa-2xl hover:animate-spin"></i></h1>
                           
                        </div>
                        
                        <h1 class=" text-2xl p-3  dark:text-white">{result.pName}</h1>
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
         
      <h1 class=" w-4/5 text-2xl px-24 pt-10 text-lime-950 dark:text-white flex items-start font-medium"> Liked Playlists :</h1>
   

      <div class=" bg-lime-600 w-4/6 rounded-lg mt-5 p-4 dark:bg-slate-900">
        
         <div class=" w-full flex justify-center items-center p-4 py-20">
            <Gallery class="gap-4 grid-cols-4 w-4/5 pt-2">
               {#if formattedmyplaylists}
               {#each formattedmyplaylists as pl}
                 <div class="flex flex-col items-center hover:scale-105 duration-300 ">
                     <div  on:click={
                         ()=> {
                             window.location.href='/home/playlistView/' + pl.pid;
                         }
                     }   class="bg-lime-700 rounded-lg  dark:bg-violet-950">
                         <h1 class="md:text-6xl text-4xl md:pb-16 px-3 pb-10 text-lime-200 dark:text-white "> <i class="fa-solid fa-compact-disc fa-2xl hover:animate-spin"></i></h1>
                         
                         
                     </div>
                     
                     <h1 class=" text-2xl p-3  dark:text-white">{pl.pName} </h1>
                 </div>
               {/each}
             {/if}
               </Gallery>
         </div>
      </div>
  </div>
      
     </main>
    