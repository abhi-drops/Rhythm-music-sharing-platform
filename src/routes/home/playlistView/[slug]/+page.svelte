
<script>
    import { doc, getFirestore } from "firebase/firestore";
    import { auth , db , storage} from "../../../../lib/firebase/firebase.client";
    import { setDoc , getDoc } from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
    import { updateDoc , arrayUnion , arrayRemove} from "firebase/firestore"; 
    import { authHandlers, authStore } from "../../../../stores/authStore";
    import { CurrentS ,CurrentP} from '../../../../stores/store';
    export let data;

    let pid = data.slug;

    let email,uid,pCreId,pCreName,pName,pSongs,formattedSongs;
    let isLiked = false;

    authStore.subscribe(curr => {
        email = curr?.currentUser?.email
        uid = curr?.currentUser?.uid

        // Check if the playlist is already liked when the page loads
        if (uid) {
            checkIfLiked();
        }
    })

    let docSnap;

    async function getprofile(){
        const docRef = doc(db, "playlists", pid );
        docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            pCreId = docSnap.data().pCreId;
            pCreName = docSnap.data().pCreName;
            pName = docSnap.data().pName;
            pSongs = docSnap.data().pSongs; 
            
            // Create a new array variable if needed (optional):
            formattedSongs = pSongs.map((song) => ({
                // Customize the mapping logic to match your desired structure
                id: song.sId,
                name: song.sName,
                thumbnail: song.sThumb,
                genre: song.sGen
            }));

            console.table(formattedSongs);
        } else {
            console.log("No such document!");
        }
    }

    async function checkIfLiked() {
        const udocRef = doc(db, "users", uid);
        const docSnapshot = await getDoc(udocRef);
        
        if (docSnapshot.exists()) {
            const likedPlaylists = docSnapshot.data().likedplaylists || [];
            isLiked = likedPlaylists.some(playlist => playlist.pid === pid);
        } else {
            console.log("User document does not exist");
        }
    }

    getprofile();

    function changeCurrSong(sid,sg){
        CurrentS.set({
            id:sid,
            genre:sg
        })

        CurrentP.set({
            cPid: pid,
        })
    }

    async function likePlaylist(){
        if (!isLiked) {
            // Like a song
            try {
                const udocRef = doc(db, "users", uid);

                const newliked = {
                    pid: pid,
                    pName: pName
                };

                await updateDoc(udocRef, {
                    likedplaylists: arrayUnion(newliked) // Add the new object to the array
                });

                isLiked = true;
                console.log("Liked successfully");

            } catch (error) {
                console.log("Error: ", error);
            }
        } else {
            // Unlike the song
            try {
                const udocRef = doc(db, "users", uid);

                const removedPlaylist = {
                    pid: pid,
                    pName: pName
                };

                await updateDoc(udocRef, {
                    likedplaylists: arrayRemove(removedPlaylist) // Remove the object from the array
                });

                isLiked = false;
                console.log("Unliked successfully");

            } catch (error) {
                console.log("Error: ", error);
            }
        }
    }
</script>

<main>
    <div class="flex justify-center items-center">
        <div class=" w-3/5 ">
            <div class="w-full flex justify-between bg-lime-600 pt-12 p-5 dark:bg-violet-950">
               <div>
                    <h1 class="text-4xl font-semibold text-white ">{pName}</h1>
                    <h2 class="text-xl text-lime-200 dark:text-gray-300">{pCreName}</h2>
               </div>
               <div class="flex items-end">
                <button on:click={()=>{likePlaylist()}} class="text-white p-1 hover:scale-110">

                    {#if isLiked}
                      <i class="fa-solid fa-heart fa-lg"></i>
                    {:else}
                      <i class="fa-regular fa-heart fa-lg"></i>
                    {/if}
                    
                  </button>
               </div>
            </div>
            <div class="flex w-full">
                <div class="w-full bg-lime-500 dark:bg-gray-900 rounded-b-lg flex flex-col justify-center items-center p-5">

                    {#if formattedSongs}
                    {#each formattedSongs as song}
                    <div on:click={()=>{changeCurrSong(song.id,song.genre)}} class="flex flex-row bg-lime-200 dark:bg-indigo-900 mx-4 mt-1 rounded-lg hover:scale-105 duration-300 w-4/5">
                        <div>
                            <img class=" m-4 w-16 shadow-md aspect-square object-cover rounded-lg" src={song.thumbnail} alt="">
                        </div>
                        <div class="flex flex-col justify-center">
                            <h1 class="text-xl dark:text-white text-lime-950 font-semibold">{song.name}</h1>
                            
                        </div>
                    </div>
                    {/each}
                    {/if}
                   
                </div>
            </div>
        </div>
    </div>
</main>