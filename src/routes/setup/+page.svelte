<script>

  import Headernav from '../../components/Headernav.svelte';
  import { Input, Helper,  Checkbox , InputAddon } from 'flowbite-svelte';
  import { Fileupload } from 'flowbite-svelte';
  import { MultiSelect } from 'flowbite-svelte';
  import {GradientButton, ButtonGroup, Button , Dropdown, DropdownItem, Avatar, DropdownHeader, DropdownDivider, Range, Label} from "flowbite-svelte";
  import { authHandlers, authStore } from "../../stores/authStore";
  import Spin from "../../components/spin.svelte";
  import Darkicon from "../../components/darkicon.svelte";
import { doc, getFirestore } from "firebase/firestore";
import { auth , db , storage} from "../../lib/firebase/firebase.client";
import {  setDoc , updateDoc, arrayUnion} from "firebase/firestore"; 
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";

   
      let email;
      let uid;
        authStore.subscribe(curr => {
            email = curr?.currentUser?.email
            uid = curr?.currentUser?.uid
            
        })



let currTime = 0 , maxTime = 230 ;
let selected = [];
let username = "";
let bio = "";
let genre= [
    { value: 'pop', name: 'Pop' },
    { value: 'rc', name: 'Rock' },
    { value: 'lf', name: 'Lofi' },
    { value: 'other',name: 'Other'}
];

let files = '';
let filename = '';
$: file = files[0];

// Get the file from the Fileupload component


async function handleSubmit() {

  

  try {




    const docRef = doc(db, "users", uid);
    console.log(docRef); // Create a reference to the document with 'uid' as the name
    
    const extension = file.name.split('.').pop().toLowerCase();
    
    console.log(extension);
    // Create a storage reference
    const storageRef = ref(storage, `user-profile-pics/${uid}/${uid}.${extension}`);

    // Upload the file to storage
    await uploadBytes(storageRef, file);

    // Get the download URL for the uploaded image
    const photoURL = await getDownloadURL(storageRef);

     // Update the document with the photoURL
     await setDoc(docRef, {
      username: username,
      favGenres: selected,
      userpic: photoURL,
      bio: bio,
      admin : false ,
      mySongs : [],
      myplaylists : [],
      likedplaylists : [],
      likedSongs : [],
      ubalance : 0,
      uTbalance : 0,
      request : false
    });

    const ldocRef = doc(db, "lists", "list");

    const newUser= {
      username: username,
      userpic: photoURL,
      uid:uid
            };


    await updateDoc(ldocRef, {
      users: arrayUnion(newUser) // Add the new playlist object to the array
        });



    alert("Data and image uploaded successfully!");
    window.location.href='/home';
    // Clear form fields or display a success message
  } catch (error) {
    console.error("Error adding data:", error);
    // Handle any errors, e.g., display an error message
  }
}


</script>


{#if $authStore.currentUser}

<div class="flex flex-col justify-between h-screen">
   <!-- home page -->
  <div class=" fixed z-10 w-screen">
    <div class="flex flex-col justify-end items-end p-3 ">
              
      <Darkicon/>

    </div>
  </div>
   
    <!--body-->
      <div class=" z-0">

                <main>
                  <div class="flex flex-col w-screen justify-center items-center h-screen ">
                      <form action=""  class="flex flex-col  gap-5 bg-lime-600 dark:bg-gray-900 w-2/5 p-9 text-white rounded-lg">
                              <h1 class=" text-4xl font-semibold">Account Set-Up</h1>
                              <div>
                                  <Label class="mb-2 text-white" for="input-addon-sm">Username</Label>
                                  <ButtonGroup class="w-full" size="sm">
                                    <InputAddon>@</InputAddon>
                                    <Input id="input-addon-sm" bind:value={username} type="text" placeholder="Akhil" />
                                  </ButtonGroup>
                                </div>

                                <div>
                                  <Label class=" pb-2">Bio</Label>
                                  <Input size="md" bind:value={bio} type="text" placeholder="Searching in Time  ...." />
                                </div>

                           <div>
                              <Label class="pb-2 text-white" for="small_size">Profile Pic </Label>
                              <input type="file" accept="image/jpeg,image/png" bind:files={files}>
                           </div>     
              
                          <div>
                              <label for="">Favorite Genre</label>
                              <MultiSelect items={genre} bind:value={selected} />
                          </div>

                          
              
                          <div class="w-full justify-end flex py-5">
                              <Button on:click={handleSubmit}  class="bg-white text-lime-950 hover:bg-slate-200" color="">Submit</Button>
                          </div>
                      </form>
                  </div>
              </main>
        
      </div>

</div>

{:else} 

  <!-- Loading -->

    <div class="flex flex-col justify-end items-end p-3">
      
          <Darkicon/>
      
    </div>
    
   <Spin/>
{/if}