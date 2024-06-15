<script>
    import { Listgroup, ListgroupItem, Avatar ,Button } from 'flowbite-svelte';
      import { Input, Label, Helper, Checkbox, Gallery} from 'flowbite-svelte';
      import { doc, getFirestore } from "firebase/firestore";
      import { auth , db , storage} from "../../../lib/firebase/firebase.client";
    import { setDoc , getDoc } from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
    import { updateDoc , arrayUnion , arrayRemove} from "firebase/firestore"; 
    import { authHandlers, authStore } from "../../../stores/authStore";
    import { CurrentS ,CurrentP} from '../../../stores/store';
    let timestamp;
      let list = [
   
    { name: 'J.D', name2:'Turk' , icon: 'rs 100' },
    { name: 'jake peralta', name2:'boyle' , icon: 'rs 100' },
    { name: 'barney', name2:'ted' , icon: 'rs 100' },
    { name: 'chandler', name2:'joe' , icon: 'rs 1000' },
    ]

    let docSnap,query, tipedfromuName ,tiedtouName ,tipedfromuId,tipedtouId,tippedfromUpic,tippedtoUpic,amount ,time;

    async function getprofile(){
        const docRef = doc(db, "tips",query );
        docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            tipedfromuName = docSnap.data().tipedfromuName,
            tiedtouName = docSnap.data().tiedtouName,
            tipedfromuId = docSnap.data().tipedfromuId,
            tipedtouId  = docSnap.data().tipedtouId,
            tippedfromUpic = docSnap.data().tippedfromUpic,
            tippedtoUpic  = docSnap.data().tippedtoUpic,
            amount = docSnap.data().amount,
            time = docSnap.data().time
           
             // Convert timestamp to readable date and time
             timestamp = new Date(time.seconds * 1000 + time.nanoseconds / 1000000); // Convert Firestore timestamp to JavaScript timestamp
            console.log(timestamp.toLocaleString()); // Log readable date and time
            
            


        } else {
            console.log("No such document!");
        }
        
    }

    getprofile();

</script>

<main>

    <div class="flex flex-col items-center">
        <div>
            <div class="flex flex-col justify-center items-center">
                <h1 class="text-2xl font-semibold dark:text-white p-4 pt-5">Financial</h1>
            </div>
        </div>
    
        <div class="w-3/5 dark:text-white flex flex-col justify-center items-center">
            <div class="w-3/4">
                <form class="flex gap-2" on:submit|preventDefault>
                  <input bind:value={query} type="text" class="w-full rounded-lg border-lime-500 dark:border-indigo-600 bg-lime-100 dark:bg-white dark:text-black" placeholder="Payment id">
                  <Button on:click={getprofile} color="" class="!p-2.5 bg-lime-600 text-white hover:bg-lime-800 dark:bg-indigo-800 dark:hover:bg-indigo-950">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </Button>
                </form>
              </div>
            
            <div class="w-full flex flex-col items-center mt-10">
         
                <h1 class=" w-full text-2xl pt-10 text-lime-950 dark:text-white flex items-start font-medium"> Search Result :</h1>
             
              {#if amount}
                
             
                <div class=" bg-lime-600 w-full rounded-lg mt-5 p-7 py-10 dark:bg-slate-900 text-lime-100 dark:text-white">
                        <h1 class="text-3xl font-semibold">{amount} rs</h1>
                        <h1>{timestamp}</h1>
                        <div class="flex justify-between w-full mt-8">
                            <h1>From : </h1>
                            <h1>To : </h1>
                        </div>
                        <div class="flex justify-between w-full">
                            
                            <div  on:click={
                              ()=> {
                                  window.location.href='/home/profile/' + tipedfromuId ;
                              }
                          }  class="flex gap-2">
                              <Avatar src={tippedfromUpic} size="xs" />{tipedfromuName}
                            </div>
                            <div  on:click={
                              ()=> {
                                  window.location.href='/home/profile/' + tipedtouId ;
                              }
                          }  class="flex gap-2">
                                <Avatar src={tippedtoUpic} size="xs" />{tiedtouName}
                              </div>
                           </div>
                    
        
                </div>
                {/if}
            </div>
            

        </div>
    </div>
    
</main>