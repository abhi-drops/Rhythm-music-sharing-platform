<script>
     import { authHandlers, authStore } from "../../../stores/authStore";
    import { FloatingLabelInput, Helper } from 'flowbite-svelte';
    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { Fileupload, Label,Select } from 'flowbite-svelte';
    import { doc, getFirestore , getDoc} from "firebase/firestore";
    import { auth , db , storage} from "../../../lib/firebase/firebase.client";
    import { addDoc, collection, setDoc ,updateDoc, arrayUnion} from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
    
    

    import { page } from '$app/stores';
    $: activeUrl = $page.url.pathname;

    
  let email;
      let uid;
        authStore.subscribe(curr => {
            email = curr?.currentUser?.email
            uid = curr?.currentUser?.uid
            
        })

        let docSnap,uName,pName;
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



async function handleSubmit() {

    try {

      

        // Create a collection playlists
        const subcollectionRef = collection(db, "playlists");

        // Update the document with the photoURL
        const docRef = await addDoc(subcollectionRef, {
            pName: pName,
            pCreId: uid,
            pCreName: uName,
            pSongs : []
            });
            
            let pid = docRef.id;
            
            //profile update

            const udocRef = doc(db, "users", uid);

            const newPlaylist = {
                pName: pName,
                pid: pid,
                
            };

            await updateDoc(udocRef, {
                myplaylists: arrayUnion(newPlaylist) // Add the new playlist object to the array
        });

        const ldocRef = doc(db, "lists", "list");

        await updateDoc(ldocRef, {
                playlists: arrayUnion(newPlaylist) // Add the new playlist object to the array
        });

        alert("Uploaded sucessfully!");

        window.location.href='/home/myProfile';
        // Clear form fields or display a success message

    } catch (error) {

        alert("Error adding data:", error);
        // Handle any errors, e.g., display an error message
    }
}
    
</script>

<main>
    <div class="flex flex-col w-full justify-center items-center">
        <div class="bg-lime-300 dark:bg-slate-900 w-4/6 mt-10 pb-16 rounded-lg">
        <div class="flex justify-center">
            <h1 class="text-3xl p-4 pt-9 dark:text-white flex items-start">Add Playlists</h1>
            
        </div>
    
    <div class="flex justify-center">
    
        <div class=" w-4/5 md:w-2/5">
            <form action="" class="flex flex-col gap-4">
                <FloatingLabelInput  bind:value={pName} style="filled" id="floating_filled" name="floating_filled" type="text">
                    Playlist Name
                </FloatingLabelInput>
                <Button on:click={handleSubmit}  color=""  class="w-full bg-lime-600 hover:bg-lime-800 text-white dark:bg-indigo-800 dark:hover:bg-indigo-950">Submit</Button>
            </form>
        </div>
            
        </div>
    </div>
   </div>
</main>