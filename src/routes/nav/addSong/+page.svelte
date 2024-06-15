<script>
    import { FloatingLabelInput, Helper } from 'flowbite-svelte';
    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { Fileupload, Label,Select } from 'flowbite-svelte';

import Headernav from '../../../components/Headernav.svelte';
  import { Input, Checkbox , InputAddon } from 'flowbite-svelte';
  
  import { MultiSelect } from 'flowbite-svelte';
  import {GradientButton, ButtonGroup, Avatar, DropdownHeader, DropdownDivider, Range} from "flowbite-svelte";
  import { authHandlers, authStore } from "../../../stores/authStore";
  import Spin from "../../../components/spin.svelte";
  import Darkicon from "../../../components/darkicon.svelte";
import { doc, getFirestore , getDoc} from "firebase/firestore";
import { auth , db , storage} from "../../../lib/firebase/firebase.client";
import { addDoc, collection, setDoc ,updateDoc, arrayUnion} from "firebase/firestore"; 
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
    
    import { page } from '$app/stores';
    $: activeUrl = $page.url.pathname;

    let isloading = false;

    let gener = [
    { value: 'pop', name: 'Pop' },
    { value: 'rc', name: 'Rock' },
    { value: 'lf', name: 'Lofi' },
    { value: 'other',name: 'Other'}
  ];

  let lan = [
    { value: 'ml', name: 'Malayalam' },
    { value: 'eng', name: 'English' },
    { value: 'hi', name: 'Hindi' },
    { value: 'other',name: 'Other'}
  ];


  let email;
      let uid;
        authStore.subscribe(curr => {
            email = curr?.currentUser?.email
            uid = curr?.currentUser?.uid
            
        })

let docSnap,uName;
        async function getprofile(){

            const docRef = doc(db, "users", uid );
            docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
            
            } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            }

            uName = docSnap.data().username;
        
       
            }

    getprofile();



let currTime = 0 , maxTime = 230 ;


let songName = "";
let songDes = "";
let songGenre = "";
let songLan = "";



let files = '';
let filename = '';
$: file = files[0];


let Tfiles = '';
let Tfilename = '';
$: Tfile = Tfiles[0];


async function handleSubmit() {

  

try {

    isloading = true;
 // Create a reference to the parent "songs" collection
 const songsCollectionRef = collection(db, "songs");

// Create a subcollection reference based on the selected genre
const subcollectionRef = collection(songsCollectionRef, "genres", songGenre);


  
  
  // song upload
  const extension = file.name.split('.').pop().toLowerCase();
  const timestamp = Date.now();
  const storageRef = ref(storage, `songs/${uid}/${timestamp}.${extension}`);
  await uploadBytes(storageRef, file);
  const songURL = await getDownloadURL(storageRef);
  
// thumbnail upload
  const Textension = Tfile.name.split('.').pop().toLowerCase();
  const TstorageRef = ref(storage, `songsThumb/${uid}/${timestamp}.${Textension}`);
  await uploadBytes(TstorageRef, Tfile);
  const photoURL = await getDownloadURL(TstorageRef);


   // Update the document with the photoURL
   const docRef = await addDoc(subcollectionRef, {
      sName: songName,
      sDes: songDes,
      sLang: songLan,
      sUrl: songURL,
      sThumb: photoURL,
      sCreId: uid,
      sCreName: uName,
      liked : []
    });
    
    let songid = docRef.id;
    
    

    //profile update

    const udocRef = doc(db, "users", uid);

    const newSong = {
    sName: songName,
    sId: songid,
    sThumb: photoURL,
    sGen: songGenre
    };

    await updateDoc(udocRef, {
    mySongs: arrayUnion(newSong) // Add the new song object to the array
  });

  const ldocRef = doc(db, "lists", "list");
  await updateDoc(ldocRef, {
    songs: arrayUnion(newSong) // Add the new song object to the array
  });

  
    isloading = false;
  alert("Uploaded sucessfully!");
  
 window.location.href='/home/myProfile';
  // Clear form fields or display a success message
} catch (error) {
    isloading = false;
  alert("Error adding data:", error);
  // Handle any errors, e.g., display an error message
}
}

</script>

{#if !isloading}

    <main >
        <div class="flex flex-col w-full justify-center items-center">
            <div class="bg-lime-300 dark:bg-slate-900 w-4/6 mt-10 pb-16 rounded-lg">
                <div class="flex justify-center">
                    <h1 class="text-3xl p-4 pt-9 dark:text-white flex items-start">Add Songs</h1>
                    
                </div>
            
            <div class="flex justify-center">
            
                <div class=" w-4/5 md:w-2/5">
                    <form action="" class="flex flex-col gap-4">
                        <FloatingLabelInput  bind:value={songName} style="filled" id="floating_filled" name="floating_filled" type="text">
                            Song Name
                        </FloatingLabelInput>
            
                        <FloatingLabelInput bind:value={songDes} style="filled" id="floating_filled" name="floating_filled" type="text">
                            Song Description
                        </FloatingLabelInput>
            
                    
                            <div class="flex flex-row w-full gap-4">
                                <div class="">
                                    <Select bind:value={songGenre} id="select-md" size="md" items={gener} class="mb-6" placeholder="Gener"/>
                                </div>
                
                                <div>
                                    <Select bind:value={songLan} id="select-md" size="md" items={lan} class="mb-6" placeholder="Language"/>
                                </div>
                            </div>
            
                            <Label class="pt-4" for="small_size">Song file</Label>
                            <input class=" dark:text-white" type="file" bind:files={files}>
            
                            
                            <Label class="pt-4" for="small_size">Thumbnail file ( Square 1:1 ratio)</Label>
                            <input class="dark:text-white" type="file" bind:files={Tfiles}>
            
                            <Button color=""  on:click={handleSubmit}  class="w-full bg-lime-600 hover:bg-lime-800 text-white dark:bg-indigo-800 dark:hover:bg-indigo-950">Submit</Button>
                            
            
                    </form>
                </div>
                    
                </div>
            </div>
        </div>
    </main>


{:else}
    
    <Spin/>
{/if}
