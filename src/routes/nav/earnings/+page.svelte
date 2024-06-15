<script>
     
    import { Listgroup, ListgroupItem, Avatar ,Button } from 'flowbite-svelte';
    import { doc, getFirestore } from "firebase/firestore";
    import { auth , db , storage} from "../../../lib/firebase/firebase.client";
    import { setDoc , getDoc,updateDoc,arrayUnion } from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
    import { authHandlers, authStore } from "../../../stores/authStore";
    import { CurrentS} from '../../../stores/store';

    let request, email, uid, up, username, bio, mySongs, formattedSongs, myplaylists, formattedmyplaylists, formattedtippedFrom, formattedtippedTo;
    let tippedTo, tippedFrom, uTbalance, ubalance;
    authStore.subscribe(curr => {
        email = curr?.currentUser?.email;
        uid = curr?.currentUser?.uid;
    });

    let docSnap;

    async function getprofile() {
        const docRef = doc(db, "users", uid);
        docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            up = docSnap.data().userpic;
            username = docSnap.data().username;
            bio = docSnap.data().bio;
            tippedTo = docSnap.data().tippedTo;
            tippedFrom = docSnap.data().tippedFrom;
            uTbalance = docSnap.data().uTbalance;
            ubalance = docSnap.data().ubalance;
            request = docSnap.data().request;

            formattedtippedTo = tippedTo?.map((s) => ({
                amount: s.amount,
                tid: s.tid,
                tiedtouName: s.tiedtouName,
                tipedtouId: s.tipedtouId,
                tippedtoUpic: s.tippedtoUpic
            }));

            console.table(formattedtippedTo);

            formattedtippedFrom = tippedFrom?.map((s) => ({
                amount: s.amount,
                tid: s.tid,
                tiedfromuName: s.tiedfromuName,
                tipedfromuId: s.tipedfromuId,
                tippedfromUpic: s.tippedfromUpic
            }));

            console.table(formattedtippedFrom);
        } else {
            console.log("No such document!");
        }

    }
    getprofile();

    async function RequestForWithdrawal(){
      if (!request && uTbalance>50 ){
        try {
          
            const docRef = doc(db, "tips", "request");
            const newArray2 = {
            uid:uid,
            uName:username,
            uPic:up,
            amount:parseInt()
            };

            await updateDoc(docRef, {
              activeRequest: arrayUnion(newArray2),
              // Add the new playlist object to the array
            });
            request = true
            alert("request sumbitted ");
        } catch (error) {
          console.log(error);
        }
      }else{
        alert("either there is an existing request in process or your balance is under 50 rs");
      }

    }
    
</script>

<main>

    <div class="flex flex-col dark:text-white items-center">
        <div class="flex flex-col w-3/4 items-center">
            <h1 class="text-2xl font-semibold p-4 pt-5">Earnings</h1>

            <div class="flex m-4">
                <div class="dark:bg-slate-800 bg-lime-300 p-5  rounded-3xl text-lime-900  dark:text-white m-4">
                    <h1 class=" text-4xl">Account Balance : {ubalance} rs</h1>
                </div>

                <div class="dark:bg-slate-800 bg-lime-300 p-5  rounded-3xl text-lime-900 dark:text-white m-4">
                    <h1 class=" text-4xl">Life-time Revenew : {uTbalance} rs</h1>
                </div>

            </div>

            {#if formattedtippedFrom}
            <div class="dark:bg-slate-800 bg-lime-300 p-5  rounded-3xl text-lime-900 dark:text-white m-4 w-full" >
             
                <h1 class=" text-xl text-center p-5"> {formattedtippedFrom.length} people Tipped you </h1>


                <Listgroup active class="w-full p-2 mb-5 ">
                 
                  {#each formattedtippedFrom as t}
                    <ListgroupItem class="text-base font-semibold gap-2">
                     <div class="flex justify-between w-full">
                      <div class="flex gap-2">
                        <Avatar src={t.tippedfromUpic} size="xs" />{t.tiedfromuName}
                      </div>
                      <h1>{t.amount} rs</h1>
                     </div>
                    </ListgroupItem>
                    {/each}
                    
                    
                  </Listgroup>
                 
            </div>
            {/if}

            {#if  formattedtippedTo}
            <div class="dark:bg-slate-800 bg-lime-300 p-5  rounded-3xl text-lime-900 dark:text-white m-4 w-full" >
                <h1 class=" text-xl text-center p-5"> you tipped {formattedtippedTo.length} people  </h1>


                <Listgroup active class="w-full p-2 mb-5 ">
                  {#each formattedtippedTo as t}
                    <ListgroupItem class="text-base font-semibold gap-2">
                      <div class="flex justify-between w-full">
                        <div class="flex gap-2">
                          <Avatar src={t.tippedtoUpic} size="xs" />{t.tiedtouName}
                        </div>
                        <h1>{t.amount} rs</h1>
                       </div>
                    </ListgroupItem>
                    {/each}
                    
                  </Listgroup>
            </div>
            {/if}

        </div>

        <Button on:click={RequestForWithdrawal}  color=""  class=" mt-5 bg-lime-600 hover:bg-lime-800 text-white dark:bg-indigo-800 dark:hover:bg-indigo-950">Request For Withdrawal</Button>
    </div>
</main>