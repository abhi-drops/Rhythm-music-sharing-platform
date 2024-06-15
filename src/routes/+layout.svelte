
<script>
    import "../app.css";
    import {onMount} from 'svelte';
    import {auth} from '../lib/firebase/firebase.client';
    import {authStore} from '../stores/authStore';
    import {browser} from '$app/environment';
    
    

	

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            
            authStore.update((curr) => {
                return{...curr,isLoading:false,currentUser:user}
            });


            if (browser){
                if (!$authStore.currentUser && !$authStore.isLoading && window.location.pathname !== '/auth' )
                {
                    window.location.href = '/auth';
                }
            }
        });
        return unsubscribe;
    })
  </script>
  
  
<slot/>
     
