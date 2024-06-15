<script>



import {GradientButton, ButtonGroup, Button , Dropdown, DropdownItem, Avatar, DropdownHeader, DropdownDivider, Range, Label} from "flowbite-svelte";
import { fade , blur, fly , slide ,scale , draw , crossfade} from 'svelte/transition';

import { authHandlers, authStore } from "../../stores/authStore";
import Spin from "../../components/spin.svelte";
import Darkicon from "../../components/darkicon.svelte";

 


let email;
      let uid;
        authStore.subscribe(curr => {
            email = curr?.currentUser?.email
            uid = curr?.currentUser?.uid
            
        })



  </script>
  
  
  {#if email === 'abhinand7887@gmail.com'}

  
  
  <div class="flex flex-col justify-between h-screen">
     <!-- home page -->

     <!--nav bar -->
    


     <header class="fixed z-10 ">
        <div class="bg-lime-200 dark:bg-gray-950 pb-5">

            <div class="flex flex-col justify-end items-end p-3">
                
                    <Darkicon/>
                
                
             </div>
             <!-- nav bar -->
        
             <div class="flex gap-4 w-screen justify-center">
                
                <div>
                    <Button color="" class="bg-lime-600 text-white rounded-full hover:bg-lime-800 dark:bg-white dark:text-indigo-900 dark:hover:bg-slate-100 " >Admin</Button>
                </div>
                <div>
                    <ButtonGroup class="bg-white rounded-full dark:bg-indigo-800 text-black hover:text-black ">
                        <Button  color="" class="hover:bg-slate-100 dark:text-white dark:hover:text-black" pill  href="/admin/financial">Financial</Button>
                        <Button  color="" class="hover:bg-slate-100 dark:text-white dark:hover:text-black"pill  href="/admin/request">Requests</Button>
                        
                        
                      </ButtonGroup>
                </div>
                <div>
                    <Avatar class="acs hover:animate-pulse font-semibold" >Ad</Avatar>
                    <Dropdown triggeredBy=".acs">
                    
                   
                    <DropdownItem  on:click={authHandlers.logout} >Sign out</DropdownItem>
                    </Dropdown>
                </div>

                

             </div>
         </div>
         <div class=" h-10 bg-gradient-to-b from-lime-200 to-transparent dark:from-gray-950">

         </div>
     </header>




     
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

            <h1 class="dark:text-white">Admin Permission Not Found</h1>
            <Darkicon/>

      </div>
      
     <Spin/>
  {/if}