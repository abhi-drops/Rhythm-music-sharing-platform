<script>
    import { Toggle , Button } from 'flowbite-svelte';
    import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
    import { doc, getFirestore } from "firebase/firestore";
    import { auth , db , storage} from "../../../lib/firebase/firebase.client";
    import { setDoc , getDoc,updateDoc,arrayUnion , arrayRemove } from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
    import { authHandlers, authStore } from "../../../stores/authStore";
    import { CurrentS} from '../../../stores/store';

    let formattedRequest,activeRequest,docSnap;

    async function getData()
    {
        try {
            const docRef = doc(db, "tips", "request");
            docSnap = await getDoc(docRef);

            if (docSnap.exists()) {

                activeRequest = docSnap.data().activeRequest;
              
                // Create a new array variable if needed (optional):
                formattedRequest = activeRequest.map((s) => ({
                    // Customize the mapping logic to match your desired structure
                    amount: s.amount,
                    uName: s.uName,
                    uPic: s.uPic,
                    uid:s.uid
                    
                }));

                console.table(formattedRequest);


            } else {
                console.log("No such document!");
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    getData();

    async function accept(amount,uName,uPic,uid){
        
        const docRef1 = doc(db, "users", uid);
        await updateDoc(docRef1, {
                ubalance:0,
                request:true // Remove the object from the array
            });



        const docRef = doc(db, "tips", "request");

        const removedSong = {
           // Customize the mapping logic to match your desired structure
            amount: amount,
            uName: uName,
            uPic: uPic,
            uid:uid
        };

        await updateDoc(docRef, {
            activeRequest: arrayRemove(removedSong) // Remove the object from the array
        });
        alert("sucessfully accepted ")
    }

    async function reject(amount,uName,uPic,uid){
        
        const docRef1 = doc(db, "users", uid);
        await updateDoc(docRef1, {
                request:true // Remove the object from the array
            });



        const docRef = doc(db, "tips", "request");

        const removedSong = {
           // Customize the mapping logic to match your desired structure
            amount: amount,
            uName: uName,
            uPic: uPic,
            uid:uid
        };

        await updateDoc(docRef, {
            activeRequest: arrayRemove(removedSong) // Remove the object from the array
        });
        alert("sucessfully rejected")
    }

   

</script>

<main>
   <div class="flex flex-col  dark:text-white items-center">
       <h1 class="text-2xl font-semibold p-4 pt-5">Requests</h1>

       {#if formattedRequest}
       {#each formattedRequest as r}
       <div class="dark:bg-slate-800 bg-lime-300 p-5 w-2/5 rounded-3xl text-white dark:text-white">
          <h1 class="text-lime-700 dark:text-white font-semibold">{r.uName}</h1>
          <div class="">
            <div>
                <h1 class=" text-6xl font-semibold text-lime-800 dark:text-white">{r.amount}Rs</h1>
            </div>
            <div class="flex w-full justify-end gap-2">
                <Button on:click={accept(r.amount,r.uName,r.uPic,r.uid)} color=""  class=" bg-lime-600 hover:bg-lime-800 text-white  dark:bg-indigo-800 dark:hover:bg-indigo-950" >Accept</Button>
                <Button  on:click={reject(r.amount,r.uName,r.uPic,r.uid)} color=""  class=" bg-red-600 hover:bg-lime-800 text-white dark:bg-indigo-900 dark:hover:bg-indigo-950" >Reject</Button>
            </div>
          </div>
       </div>
       {/each}
                    {/if}
   </div>
</main>