<script>
  import Player from '../../components/Player.svelte';

 

   

    import Headernav from '../../components/Headernav.svelte';

    import dp from '$lib/images/dp.avif';
    import th from '$lib/images/th.webp';
    

    import {GradientButton, ButtonGroup, Button , Dropdown, DropdownItem, Avatar, DropdownHeader, DropdownDivider, Range, Label} from "flowbite-svelte";
    import { authHandlers, authStore } from "../../stores/authStore";
    import Spin from "../../components/spin.svelte";
    import Darkicon from "../../components/darkicon.svelte";
    import { doc, getFirestore } from "firebase/firestore";
    import { auth , db , storage} from "../../lib/firebase/firebase.client";
    import { setDoc , getDoc } from "firebase/firestore"; 
    import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";

    
    
let like = false;

 
let email;
let uid;

authStore.subscribe(curr => {

    email = curr?.currentUser?.email
    uid = curr?.currentUser?.uid
    
    })


      let currTime = 0 , maxTime = 230 ;

    function liked()
    {
        like = !like;
    }
   
  
  </script>
  
  
  {#if $authStore.currentUser}
  
  <div class="flex flex-col justify-between h-screen">
     <!-- home page -->
    <Headernav></Headernav>
     
      <!--body-->
        <div class=" z-0">
            <div class=" h-32 ">

            </div>
           
                  
            
                <slot />
            
            <!-- freespace under body-->
            <div class=" h-52">

            </div>
        </div>

     <Player></Player>


  </div>
  
  {:else} 

    <!-- Loading -->

     
    <div class="flex flex-col justify-end items-end p-3">
      
      <Darkicon/>
  
</div>

<Spin/>
  {/if}