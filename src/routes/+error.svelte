



<script>
    import { page } from '$app/stores';

    import Darkicon from "../components/darkicon.svelte";
    import {  Button } from 'flowbite-svelte';

  
  
  </script>
  
  

  
  <div class="flex flex-col justify-between h-screen">
     <!-- home page -->
    


     <header class="fixed z-10 w-screen">
        <div class=" pb-5">

            <div class="flex flex-col justify-end items-end p-3 ">
                
                    <Darkicon/>
                
             </div>
             
         </div>
        
     </header>


     
      <!--body-->
        <div class=" z-0 flex flex-col justify-center items-center w-screen h-screen dark:text-white">
           
           <h1 class=" text-8xl font-bold p-5">Oops!</h1>
           
            <h1 class="text-xl font-semibold">{$page.status} - {$page.error.message}</h1>
            
            <Button color="" href="/home"  class=" bg-lime-600 hover:bg-lime-800 text-white dark:bg-indigo-800 dark:hover:bg-indigo-950 m-10 font-semibold w-52">Home</Button>
           
            
        </div>

  </div>
