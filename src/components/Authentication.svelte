<script>
    import { Card, Button, Label, Input} from 'flowbite-svelte';
    import { redirect } from '@sveltejs/kit';
    import { authHandlers, authStore } from "../stores/authStore";

    let register = false;
    let forgetpass = false;
    let visible = true;
    let email = '';
    let password = '';
    let confirmPassword = '';

    async function handleSubmit () 
    {
        if(!email || !password || (register && !confirmPassword )){
            return;
        }

        if(register )
        {   
                if(password === confirmPassword)
                {
                        //register
                        try {
                            await authHandlers.signup(email,password)
                            window.location.href='/setup';
                    
                        } catch (err) {
                            alert("Register failed " + err.message );
                            console.log(err);
                        }
                }
                else{
                        alert("password and confirm password are different");
                }
            
        }else{

            //login
            
           
                try {
                        await authHandlers.login(email, password);
                        if(email === 'abhinand7887@gmail.com')
                        {
                            window.location.href='/admin/financial';
                        }else{
                            window.location.href='/home';
                        }
                        
                    // Handle successful login

                    } catch (err) {
                        alert("Login failed " + err.message );
                        console.error(err);
                    // Display a user-friendly error message
                    }
            } 
        
       
    }

    async function handleForgetPass () {
        try {
                    await  authHandlers.resetPassword(email)
                alert("Link Sented To Your Email Successfully");
                window.location.href='home';

                } catch (err) {
                    alert("Reset Password Failed");
                    console.log(err);
                }
    }



</script>


  
  
  <div class="flex flex-col justify-center items-center h-screen ">
      
        <Card>
          <form class="flex flex-col space-y-6" action="/">

            <h3 class="text-3xl  dark:text-white text-lime-950  tracking-widest">
                
                {#if !forgetpass}
                    {register ? 'CREATE ACCOUNT ' : 'WELCOME BACK'}
                {:else}
                    RESET PASSWORD
                {/if}
                
                

            </h3>

            <Label class="space-y-2">
              <span>Email</span>
              <Input  bind:value={email} title="Input (email)" type="email" name="email" placeholder="john@example.com"  autocomplete="email" required />
            </Label>

            {#if !forgetpass}

                <Label class="space-y-2">
                    <span>Your password</span>
                    <Input type="password"  bind:value={password} name="password" placeholder="Password" required />
                </Label>
    
    
                {#if register}
    
                    <Label class="space-y-2">
                        <span>Your password</span>
                        <Input type="password" bind:value={confirmPassword}  name="Confirm password" placeholder="Confirm Password" required />
                    </Label>
    
                {/if}
            {/if}
            
           

            {#if !forgetpass}
                <Button  on:click={handleSubmit} color=""  class="w-full bg-lime-600 text-white hover:bg-lime-800 dark:bg-indigo-600 dark:hover:bg-indigo-800">{register ? 'REGISTER' : 'LOGIN'}</Button>
            {:else}
            <Button on:click={handleForgetPass} color="red" class="w-full">SENT LINK</Button>  
            {/if}

            

            <div class="text-sm font-medium text-gray-500 dark:text-gray-300 flex   gap-1 flex-col">
                {#if !forgetpass}
                            {#if register}
                            <div class="flex gap-1">
                                <p>Already Have an Account?</p> <p on:click={() => {
                                    register = false;
                                }} on:keydown={() => {} } class="text-lime-600 hover:underline dark:text-primary-500">Login</p>
                            </div>
                        {:else}
                            <div class="flex gap-1">
                                <p>Not registered?</p> <p on:click={() => {
                                    register = true;
                                }} on:keydown={() => {} } class="text-lime-600 hover:underline dark:text-primary-500"> Create account </p>
                            </div>
                        {/if} 
                {/if}
                
              


              <div class="w-full flex justify-end text-lime-600 hover:underline dark:text-primary-500">
                <p on:click={() => {
                    forgetpass = ! forgetpass;
                }} on:keydown={() => {} } > {!forgetpass ? 'forget password' : 'back'} </p>
              </div>
            </div>
            
          </form>
        </Card>
  </div>
  
    
