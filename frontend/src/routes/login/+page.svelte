<script lang="ts">
  import { login } from '$lib/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let message = '';

  async function handleLogin() {
    try {
      const token = await login(email, password);

      const res = await fetch('https://nei6ijkhbf.execute-api.eu-west-1.amazonaws.com/prod/notes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      console.log(data); 
      message = " Login successful!";
      goto('/dashboard'); 
    } catch (err) {
      message = ` ${err}`;
    }
  }
</script>

<h1>Log In</h1>

<input bind:value={email} placeholder="Email" />
<input bind:value={password} type="password" placeholder="Password" />
<button on:click={handleLogin}>Log In</button>

<p>
  Don’t have an account? <a href="/">Sign up</a>
</p>

<pre>{message}</pre>
