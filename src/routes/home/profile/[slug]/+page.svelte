<script>
    import { Gallery } from 'flowbite-svelte';
    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { doc, getFirestore } from "firebase/firestore";
    import { auth , db , storage} from "../../../../lib/firebase/firebase.client";
    import { setDoc , getDoc ,updateDoc ,arrayUnion ,arrayRemove} from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
    import { authHandlers, authStore } from "../../../../stores/authStore";
    import { CurrentS} from '../../../../stores/store';
  import { flip } from 'svelte/animate';
    export let data;

let uid = data.slug;
 
let email,up ,username,bio,mySongs,formattedSongs, myplaylists,formattedmyplaylists,followerCount ;
let foll = false;

        let uemail;
        let uuid;
        authStore.subscribe(curr => {
            uemail = curr?.currentUser?.email
            uuid = curr?.currentUser?.uid
            
        })


    let docSnap;

    async function getprofile(){
        const docRef = doc(db, "users", uid );
        docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            up = docSnap.data().userpic;
            username = docSnap.data().username;
            bio = docSnap.data().bio;
            mySongs = docSnap.data().mySongs; 
            
            // Create a new array variable if needed (optional):
             formattedSongs = mySongs.map((song) => ({
                // Customize the mapping logic to match your desired structure
                id: song.sId,
                name: song.sName,
                thumbnail: song.sThumb,
                genre:song.sGen
                
            }));

             console.table(formattedSongs);


             myplaylists = docSnap.data().myplaylists; 
            
            // Create a new array variable if needed (optional):
             formattedmyplaylists = myplaylists.map((p) => ({
                // Customize the mapping logic to match your desired structure
                pName: p.pName,
                pid: p.pid
                
            }));

            // Check if the current user is already following this user
        const currentUserUID = auth.currentUser.uid;
        const followedBy = docSnap.data().followedBy;
        followerCount = followedBy.length;
        foll = followedBy.some((follower) => follower.uid === currentUserUID);

        console.table(formattedSongs);
             console.table(formattedmyplaylists);
            

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

    async function follow()
  {
        if(!foll){

            try {
                
                const udocRef = doc(db, "users", uid);

                const newD = {
                    uid:uuid
                };

                await updateDoc(udocRef, {
                    followedBy: arrayUnion(newD)
                });



                const docRef2 = doc(db, "users", uuid);

                const newD2 = {
                    uid:uid,
                    username:username,
                    userpic:up
                };

                await updateDoc(docRef2, {
                    following: arrayUnion(newD2)
                });

                console.log("followed sucessfully");
                foll = true;
            } catch (error) {
                console.log("error: " + error);
            }

        }else{
            try {
                
                const udocRef = doc(db, "users", uid);

                const newD = {
                    uid:uuid
                };

                await updateDoc(udocRef, {
                    followedBy: arrayRemove(newD)
                });



                const docRef2 = doc(db, "users", uuid);

                const newD2 = {
                    uid:uid,
                    username:username,
                    userpic:up
                };

                await updateDoc(docRef2, {
                    following: arrayRemove(newD2)
                });

                console.log("unfollowed sucessfully");
                foll = false;
            } catch (error) {
                console.log("error: " + error);
            }
        }
  }
    
    
 
    
</script>

<div class="flex justify-center dark:text-white">
    <div class=" w-5/5 xl:w-4/5 flex flex-col items-center">
        <div class="hover:scale-105 duration-300 ">
                <img class="rounded-full m-4 w-52 shadow-md aspect-square object-cover dark:shadow-violet-950"
            src={up} alt="shoas" />

            <div class="flex items-center justify-center">
                <h1 class="text-xl font-semibold text-lime-950 dark:text-white">{username}</h1>
            </div>

        </div>

        
        <div class="w-2/4 p-4 pt-0  text-center text-lime-900 dark:text-white ">
            <h1>{bio}</h1>
        </div>
        <div class="flex  items-center justify-center  pt-0 p-5">
            <form  on:submit|preventDefault >
            <h1 class="text-sm  text-lime-950 dark:text-white px-3 pt-0 ">followed by <span class=" font-semibold">{followerCount} other </span> </h1>
            <Button on:click={follow}  size="xs" color=""   class=" bg-lime-600 hover:bg-lime-800 text-white dark:bg-indigo-800 dark:hover:bg-indigo-950">
                {#if foll}
                    following
                {:else}
                    follow
                {/if}
    
            </Button>
            <Button on:click={
                ()=> {
                    window.location.href='/payment/' + uid;
                }
            }  size="xs" color=""   class=" mx-2 bg-red-600 hover:bg-red-800 text-white ">Tip</Button>

        </form>
        </div>


        <div class="w-3/4 flex flex-col items-center dark:bg-stone-950 bg-lime-600 text-white rounded-3xl ">
            <h1 class="text-xl font-semibold pt-7 p-2">Songs</h1>

        <div class=" w-full flex justify-center items-center p-4 pt-0 ">

           

            <Gallery class="gap-4 grid-cols-4 w-4/5 pt-2">

                {#if formattedSongs}
                    {#each formattedSongs as song}
                    <div on:click={()=>{changeCurrSong(song.id,song.genre)}} class="flex flex-col items-center hover:scale-105 duration-300 cursor-pointer">
                        <img  src={song.thumbnail} alt="shoas" class="h-auto max-w- rounded-lg aspect-square object-cover cursor-pointer" />
                        <h1 class=" text-xl p-1  dark:text-white">{song.name}</h1>
                    </div>
                    {/each}
                {/if}
                
   
               </Gallery>
         </div>



         <h1 class="text-xl font-semibold pt-7 p-2">Playlists</h1>

        <div class=" w-full flex justify-center items-center p-4 pt-0">

           

            <Gallery class="gap-4 grid-cols-4 w-4/5 md:pt-12 pt-8">

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
</div>