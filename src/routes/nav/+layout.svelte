<script>

    import Headernav from '../../components/Headernav.svelte';

    
    
    import {GradientButton, ButtonGroup, Button , Dropdown, DropdownItem, Avatar, DropdownHeader, DropdownDivider, Range, Label} from "flowbite-svelte";
    import { authHandlers, authStore } from "../../stores/authStore";
    import Spin from "../../components/spin.svelte";
    import Darkicon from "../../components/darkicon.svelte";

  let email;
      authStore.subscribe(curr => {
          email = curr?.currentUser?.email

      })

      let currTime = 0 , maxTime = 230 ;

     
  
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

  </div>
  
  {:else} 

    <!-- Loading -->

      <div class="flex flex-col justify-end items-end p-3">
        
            <Darkicon/>
        
      </div>
      
     <Spin/>
  {/if}