<script>
    

    import dp from '$lib/images/dp.avif';
    import th from '$lib/images/th.webp';
    import { fade } from 'svelte/transition';

    import {GradientButton, ButtonGroup, Button , Dropdown, DropdownItem, Avatar, DropdownHeader, DropdownDivider, Range, Label} from "flowbite-svelte";
    
    import { authHandlers, authStore } from "../stores/authStore";
    import Spin from "./spin.svelte";
    import Darkicon from "./darkicon.svelte";
    import { doc, getFirestore } from "firebase/firestore";
    import { auth , db , storage} from "../lib/firebase/firebase.client";
    import { setDoc , getDoc } from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";

    
    
let like = false;

let email,uid,up;

authStore.subscribe(curr => {

    email = curr?.currentUser?.email
    uid = curr?.currentUser?.uid
    
    })

    let docSnap;

    async function getprofile(){
        const docRef = doc(db, "users", uid );
        docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }

        up = docSnap.data().userpic;
        
       
    }

    getprofile();
    

  
  
  
  </script>

 <header class="fixed z-10 ">
        <div class="bg-lime-200 dark:bg-gray-950 pb-5">

            <div class="flex flex-col justify-end items-end p-3">
                
                    <Darkicon/>
                
                
             </div>
             <!-- nav bar -->
        
             <div class="flex gap-4 w-screen justify-center">
                
                <div>
                    <Button color="" class="bg-lime-600 text-white rounded-full hover:bg-lime-800 dark:bg-white dark:text-indigo-900 dark:hover:bg-slate-100 " href="/home">Rhythm</Button>
                </div>
                <div>
                    <ButtonGroup class="bg-white rounded-full dark:bg-indigo-800 text-black hover:text-black ">
                        <Button  color="" class="hover:bg-slate-100 dark:text-white dark:hover:text-black" pill  href="/home/songs">Songs</Button>
                        <Button  color="" class="hover:bg-slate-100 dark:text-white dark:hover:text-black"pill  href="/home/playlists">Playlists</Button>
                        <Button  color="" class="hover:bg-slate-100 dark:text-white dark:hover:text-black"pill  href="/home/artists">Artists</Button>
                        
                      </ButtonGroup>
                </div>
                <div>
                    <div class="acs">
                        <Avatar class=" hover:animate-pulse object-cover " src={up}  />
                    </div>
                    
                    <Dropdown triggeredBy=".acs">
                    <div slot="header" class="px-4 py-2">
                        <span class="block text-sm text-gray-900 dark:text-white">{docSnap.data().username}</span>
                        <span class="block truncate text-sm font-medium">{email}</span>
                    </div>
                    <DropdownItem href="/home/myProfile">My Profile</DropdownItem>
                    
                    <DropdownItem href="/nav/earnings">Earnings</DropdownItem>
                    <DropdownItem slot="footer"  on:click={authHandlers.logout} >Sign out</DropdownItem>
                    </Dropdown>
                </div>

                <div>
                    <Avatar class="acs2 hover:animate-pulse"><i class="fa-solid fa-plus"></i></Avatar>
                    <Dropdown triggeredBy=".acs2">
                    
                        <DropdownItem href="/nav/addSong">Add Song</DropdownItem>
                        <DropdownItem  href="/nav/addPlaylist" >Add Playlist</DropdownItem>
                    
                    </Dropdown>
                </div>

             </div>
         </div>
         <div class=" h-10 bg-gradient-to-b from-lime-200 to-transparent dark:from-gray-950">

         </div>
     </header>

