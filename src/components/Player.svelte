<script>
  import { onMount } from 'svelte';
  import { CurrentS , CurrentP , lastSong} from '../stores/store';
  import { fade , blur ,slide ,scale} from 'svelte/transition';
  import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
  import { collection, doc, getDocs, getFirestore, query } from "firebase/firestore";
  import { auth , db , storage} from "../lib/firebase/firebase.client";
  import { setDoc , getDoc ,updateDoc , arrayUnion , arrayRemove} from "firebase/firestore"; 
  import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
  import { authHandlers, authStore } from "../stores/authStore";
  import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
  import { page } from '$app/stores';
  $: activeUrl = $page.url.pathname;

  
let CurrentPId ,CurrentLSId ,formattedPlaylist=[],lastSongId ,lastSongG;
  let sName , CurrentSg,CurrentSId;
  let songData;

  let CrSongData,crSName,crSTh,crSUrl,crSCre,sCreId;
  let firstPlay = false;
  let firstPL = false;
  let audioPlayer;
  let isPlaying = false;
  let currentTime = 0;
  let maxTime = 0;
  let changeS = false;
  let isLiked = false;
  let docSnap2;

  let email;
      let uid;
        authStore.subscribe(curr => {
            email = curr?.currentUser?.email
            uid = curr?.currentUser?.uid
            
        })


  async function getSongData(songid, songgenre) {
    try {
        const docRef = doc(db, 'songs', 'genres', songgenre,songid);

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log(data);
            return data;
        } else {
            console.log("Document does not exist");
            return null;
        }
    } catch (error) {
        console.error('Error retrieving song data:', error);
        throw error; // Throw error for handling in the calling function
    }
}

function startPlaying() {
    audioPlayer.play();
    isPlaying = true;
  }

lastSong.subscribe(curr =>{
  lastSongId = curr?.id;
  lastSongG = curr?.genre;
})


CurrentP.subscribe(curr => {
firstPL=true;
CurrentPId = curr?.cPid




    async function getPlaylist(){
        try {
            const docRef = doc(db, "playlists", CurrentPId );
            docSnap2 = await getDoc(docRef);

            if (docSnap2.exists()) {

                
                let pSongs = docSnap2.data().pSongs; 
                
                // Create a new array variable if needed (optional):
                formattedPlaylist = pSongs.map((song) => ({
                    // Customize the mapping logic to match your desired structure
                    id: song.sId,
                    name: song.sName,
                    thumbnail: song.sThumb,
                    genre:song.sGen
                    
                }));

                console.table(formattedPlaylist);


            } else {
                console.log("No such document!");
                
            }
        } catch (error) {
          firstPL=false;
        }
        
    }

    getPlaylist();
})




function nextsong(){
  
  let rand = Math.floor(Math.random() * formattedPlaylist.length);
  
 
   if(CurrentSId){
    lastSong.set({
    id: CurrentSId,
    genre: CurrentSg
  });
  }else{
    lastSong.set({
    id: formattedPlaylist[rand].id,
    genre: formattedPlaylist[rand].genre
  });
  }
   rand = Math.floor(Math.random() * formattedPlaylist.length);
  CurrentS.set({
    id: formattedPlaylist[rand].id,
    genre: formattedPlaylist[rand].genre
  });
}


function SongBack(){
  let tid =  CurrentSId;
  let tgenre = CurrentSg

  CurrentS.set({
    id:lastSongId,
    genre: lastSongG
  });

  lastSong.set({
    id:tid,
    genre: tgenre
  });
  


}





  CurrentS.subscribe(curr => {
    firstPlay = true;
    CurrentSId = curr?.id
    CurrentSg = curr?.genre

    async function loadSong(){

      try {   
              isLiked = false;
              // Call the function to get song data by songid
              CrSongData = await getSongData(CurrentSId,CurrentSg);

              
              if (CrSongData) {
              crSName = CrSongData.sName;
              crSTh = CrSongData.sThumb;
              crSUrl = CrSongData.sUrl;
              crSCre = CrSongData.sCreName;
              sCreId = CrSongData.sCreId;
              console.log('Song Data:', sCreId);

              // If audio player is already playing, pause it first
              if (isPlaying) {
                audioPlayer.pause();
              }

              // Update audio source
              audioPlayer.src = crSUrl;

              // Start playing the new song
              startPlaying();

              if (uid) {
                          try {
                              const userDocRef = doc(db, 'users', uid);
                              const userDocSnap = await getDoc(userDocRef);
                              if (userDocSnap.exists()) {
                                  const userData = userDocSnap.data();
                                  if (userData.likedSongs) {
                                      userData.likedSongs.forEach(song => {
                                          if (song.sId === CurrentSId && song.sGen === CurrentSg) {
                                              isLiked = true;
                                              
                                          }else{
                                           
                                          }
                                      });
                                  }
                              }
                          } catch (error) {
                              console.error('Error checking if song is liked:', error);
                          }
                      }

            } else {
                console.log("song not found !");
                firstPlay = false;
                  // Handle the case where song is not found
              }
          } catch (error) {
              console.log("firebase song fetching error");
              // Handle errors
          }


          

    }

    loadSong();
    
})



let username , myplaylists,formattedmyplaylists;
let docSnap;

async function getprofile(){
        const docRef = doc(db, "users", uid );
        docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

           
            username = docSnap.data().username;
            
            myplaylists = docSnap.data().myplaylists; 
            
            // Create a new array variable if needed (optional):
             formattedmyplaylists = myplaylists.map((p) => ({
                // Customize the mapping logic to match your desired structure
                pName: p.pName,
                pid: p.pid
                
            }));

             console.table(formattedmyplaylists);
            

        } else {
            console.log("No Myplaylists found");
        }
        
    }

    getprofile();




  onMount(async () => {

    

    //audio player 

    audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.addEventListener('timeupdate', updateTime);
    audioPlayer.addEventListener('loadedmetadata', () => {
      maxTime = audioPlayer.duration;

      
    });
  });

  
  function togglePlay() {
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    isPlaying = !isPlaying;
  }

  function updateTime() {
    currentTime = audioPlayer.currentTime;
  }

  function onRangeChange(event) {
    currentTime = parseFloat(event.target.value);
    audioPlayer.currentTime = currentTime;
  }

  async function likeSong(){
    if(!isLiked){
        //like a song
      try {
      
            const udocRef = doc(db, "users", uid);

            const newliked = {
            sName: crSName,
            sId: CurrentSId,
            sThumb: crSTh,
            sGen: CurrentSg,
            };

            await updateDoc(udocRef, {
              likedSongs : arrayUnion(newliked) // Add the new song object to the array
            });

            isLiked = true;
            console.log("liked sucessfully");

          } catch (error) {
              console.log("error : " + error);
          }

  

    }else{

      //unlike the song

      try {
        const udocRef = doc(db, "users", uid);

            const removedSong = {
              sName: crSName,
              sId: CurrentSId,
              sThumb: crSTh,
              sGen: CurrentSg,
            };

            await updateDoc(udocRef, {
                likedSongs: arrayRemove(removedSong) // Remove the song object from the array
            });

            isLiked = false;
            console.log("Unliked successfully");

      } catch (error) {
        console.log("Error: ", error);
      }

    }
  }

  async function addToPlaylist(crPId){
   
      try {
      
            const udocRef = doc(db, "playlists", crPId);

            const newSong = {
            sName: crSName,
            sId: CurrentSId,
            sThumb: crSTh,
            sGen: CurrentSg,
            };

            await updateDoc(udocRef, {
              pSongs : arrayUnion(newSong) // Add the new song object to the array
            });

            console.log("added to playlist sucessfully");

          } catch (error) {
              console.log("error : " + error);
          }

  }

</script>
{#if  firstPlay}
<div transition:fade={{ delay: 250, duration: 300 }} >
  <footer class="fixed z-10 bottom-3/4">
    <div class="fixed bottom-3">
      <div class="w-screen flex flex-col items-center">
        <div>
          <audio id="audioPlayer" src={crSUrl} />
        </div>
        <div class="w-5/6 md:w-6/12 bg-lime-300 rounded-lg bg-opacity-90 dark:bg-indigo-950">
          <div class="flex justify-between">
            <div>
              <div class="flex items-center text-lime-950 dark:text-white font-semibold">
                <img class=" m-4 w-16 rounded-lg mb-0 shadow-md aspect-square object-cover " src={crSTh} alt="">
                <div class="flex flex-col">
                  <h1>{crSName}</h1>
                  <h1 on:click={
                    ()=> {
                        window.location.href='/home/profile/' + sCreId ;
                    }
                }   class="text-sm">{crSCre}</h1>
                </div>
              </div>
            </div>
            <div class="p-4 pb-0 flex items-center gap-2">
              <div class="p-1 mx-1 bg-lime-200 rounded-lg px-2 dark:bg-indigo-900">
                <button on:click={()=>{likeSong()}} class="dark:text-white p-1 text-lime-800 hover:scale-110">

                  {#if isLiked}
                    <i class="fa-solid fa-heart fa-lg"></i>
                  {:else}
                    <i class="fa-regular fa-heart fa-lg"></i>
                  {/if}
                  
                </button>
                <button  color="" class="p-0  "><i class="fa-solid fa-plus fa-lg dark:text-white p-2 text-lime-800 hover:scale-110"></i></button>
                <Dropdown {activeUrl}>
                  {#if formattedmyplaylists}
                    {#each formattedmyplaylists as pl}
                      <DropdownItem on:click={addToPlaylist(pl.pid)} >{pl.pName}</DropdownItem>

                    {/each}
                  {/if}
                 
                  
                </Dropdown>
                
    
              </div>
              
              <div class="bg-lime-700 rounded-lg dark:bg-white">

                {#if firstPL}
                  <button on:click={()=>{SongBack()}}  class="text-white py-2 px-3 rounded-lg dark:text-indigo-950 hover:scale-110"><i class="fa-solid fa-backward"></i></button>
                {/if}
                
                <button class="text-white py-2 px-3 rounded-lg dark:text-indigo-950 hover:scale-110" on:click={togglePlay}>
                  {#if isPlaying}
                    <i class="fa-solid fa-pause"></i>
                  {:else}
                    <i class="fa-solid fa-play"></i>
                  {/if}
                </button>
                {#if firstPL}
                  <button on:click={()=>{nextsong()}} class="text-white py-2 px-3 rounded-lg dark:text-indigo-950 hover:scale-110"><i class="fa-solid fa-forward"></i></button>
                {/if }
               
              </div>
            </div>
          </div>
          <div class="flex items-center w-full p-3">
            <div class="w-full p-1 text-lime-950 font-semibold dark:text-white text-xs">
              <input class="w-full accent-lime-700 dark:accent-white" type="range" bind:value={currentTime} max={maxTime} step="any" on:change={onRangeChange}>
              <div class="flex w-full justify-between">
                <h1>{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</h1>
                <h1>{Math.floor(maxTime / 60)}:{(maxTime % 60).toFixed(0).padStart(2, '0')}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>


{/if}
