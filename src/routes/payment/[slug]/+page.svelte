<script>


   import { onMount } from 'svelte';
   import { authHandlers, authStore } from "../../../stores/authStore";
    import { FloatingLabelInput, Helper } from 'flowbite-svelte';
    import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { Fileupload, Label,Select } from 'flowbite-svelte';
    import { doc, getFirestore , getDoc,serverTimestamp} from "firebase/firestore";
    import { auth , db , storage} from "../../../lib/firebase/firebase.client";
    import { addDoc, collection, setDoc ,updateDoc, arrayUnion} from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";

  export let data;
   let tuid = data.slug;
   let uName,tuName,upic,tupic,tid;
   let ubalance , uTbalance , tubalance , tuTbalance ;
  
   const fetchUserProfile = async () => {
    if (!uid) return; // Ensure uid is defined before fetching profile
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      uName = docSnap.data().username;
      upic = docSnap.data().userpic;
      ubalance = docSnap.data().ubalance;
      uTbalance = docSnap.data().uTbalance;
      console.log(uName);
    } else {
      console.log("No such document!");
    }
  };

  const fetchUserProfile2 = async () => {
    if (!tuid) return; // Ensure tuid is defined before fetching profile
    const docRef = doc(db, "users", tuid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      tuName = docSnap.data().username;
      tupic = docSnap.data().userpic;
      tubalance = docSnap.data().ubalance;
      tuTbalance = docSnap.data().uTbalance;
      console.log(tuName);
    } else {
      console.log("No such document!");
    }
  };

  let email,uid;
  authStore.subscribe(curr => {
    email = curr?.currentUser?.email;
    uid = curr?.currentUser?.uid;
    fetchUserProfile();
    fetchUserProfile2();
  });

  let selected = 200;
  let totalprice = selected;

  function onChange(event) {
    selected = event.currentTarget.value;
    totalprice = event.currentTarget.value;
  }

  async function handlePay(){
     try {
      // Create a collection playlists
     const subcollectionRef = collection(db, "tips");

// Update the document with the photoURL
const docRef = await addDoc(subcollectionRef, {
    tipedfromuName: uName,
    tiedtouName: tuName,
    tipedfromuId: uid,
    tipedtouId : tuid,
    tippedfromUpic : upic,
    tippedtoUpic : tupic,
    amount:parseInt(selected),
    time:serverTimestamp()
    });
    
     tid = docRef.id;

     //profile update
    
     const udocRef = doc(db, "users", uid);

      const newArray = {
        tiedtouName: tuName,
        tipedtouId : tuid,
        tippedtoUpic : tupic,
        amount:parseInt(selected),
        tid : tid
      };

      await updateDoc(udocRef, {
          tippedTo: arrayUnion(newArray),
          // Add the new playlist object to the array
      });


       //profile update

     const udocRef2 = doc(db, "users", tuid);

      const newArray2 = {
        tiedfromuName: uName,
        tipedfromuId : uid,
        tippedfromUpic : upic,
        amount:parseInt(selected),
        tid : tid
      };

      await updateDoc(udocRef2, {
          tippedFrom: arrayUnion(newArray2),
          ubalance : (ubalance + parseInt(selected)),
          uTbalance : (uTbalance + parseInt(selected)) // Add the new playlist object to the array
      });

      alert("tipped Sucessfully");
      window.location.href='/home';
     
     } catch (error) {
      console.log("error:" + error);
     }
  }

</script>


    <div class="font-[sans-serif] bg-white p-4 min-h-screen pt-40">
        <div class="lg:max-w-6xl max-w-xl mx-auto">
          <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 max-lg:order-1">
              <h2 class="text-3xl font-extrabold text-[#333]">Make a payment</h2>
              <p class="text-[#333] text-base mt-6">Complete your transaction swiftly and securely with our easy-to-use payment process.</p>
              <form class="mt-12 max-w-lg">
                <div class="grid gap-6">
                  
                  <div>
                    <h1 class="text-2xl font-semibold ">Amount</h1>
                    <label>
                      <input checked={selected===100} on:change={onChange} type="radio" name="amount" value="100" /> 100
                    </label>
                    <label>
                      <input checked={selected===200} on:change={onChange} type="radio" name="amount" value="200" /> 200
                    </label>
                    <label>
                      <input checked={selected===300} on:change={onChange} type="radio" name="amount" value="300" /> 300
                    </label>
                  </div>
                  
                  <input type="text" placeholder="Cardholder's Name"
                    class="px-4 py-3.5 bg-gray-100 text-[#333] w-full text-sm border rounded-md focus:border-purple-500 outline-none" />
                    
                  <div class="flex bg-gray-100 border rounded-md focus-within:border-purple-500 overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 ml-3" viewBox="0 0 32 20">
                      <circle cx="10" cy="10" r="10" fill="#f93232" data-original="#f93232" />
                      <path fill="#fed049"
                        d="M22 0c-2.246 0-4.312.75-5.98 2H16v.014c-.396.298-.76.634-1.107.986h2.214c.308.313.592.648.855 1H14.03a9.932 9.932 0 0 0-.667 1h5.264c.188.324.365.654.518 1h-6.291a9.833 9.833 0 0 0-.377 1h7.044c.104.326.186.661.258 1h-7.563c-.067.328-.123.66-.157 1h7.881c.039.328.06.661.06 1h-8c0 .339.027.67.06 1h7.882c-.038.339-.093.672-.162 1h-7.563c.069.341.158.673.261 1h7.044a9.833 9.833 0 0 1-.377 1h-6.291c.151.344.321.678.509 1h5.264a9.783 9.783 0 0 1-.669 1H14.03c.266.352.553.687.862 1h2.215a10.05 10.05 0 0 1-1.107.986A9.937 9.937 0 0 0 22 20c5.523 0 10-4.478 10-10S27.523 0 22 0z"
                        class="hovered-path" data-original="#fed049" />
                    </svg>
                    <input type="number" placeholder="Card Number"
                      class="px-4 py-3.5 bg-gray-100 text-[#333] w-full text-sm outline-none" />
                  </div>
                  <div class="grid grid-cols-2 gap-6">
                    <input type="number" placeholder="EXP."
                      class="px-4 py-3.5 bg-gray-100 text-[#333] w-full text-sm border rounded-md focus:border-purple-500 outline-none" />
                    <input type="number" placeholder="CVV"
                      class="px-4 py-3.5 bg-gray-100 text-[#333] w-full text-sm border rounded-md focus:border-purple-500 outline-none" />
                  </div>
                </div>
                <button on:click={handlePay} type="button" class="mt-6 w-40 py-3.5 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600">Submit</button>
              </form>
            </div>
            <div class="bg-gray-100 p-6 rounded-md">
              
              <ul class="text-[#333] mt-10 space-y-6">
                <li class="flex flex-wrap gap-4 text-base">Processing Cost + donation :<span class="ml-auto font-bold">${selected}</span></li>
                
                <li class="flex flex-wrap gap-4 text-base font-bold border-t-2 pt-4">Total <span class="ml-auto">${totalprice}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
