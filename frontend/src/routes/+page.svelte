<script lang="ts">
  import { signUp, login } from '$lib/auth';
  import { confirmSignUp } from '@aws-amplify/auth';

  let email = '';
  let password = '';
  let code = '';
  let message = '';
  let step = 'signup';

  async function handleSignup() {
    try {
      await signUp(email, password);
      message = " Signup successful! Check your email for a verification code.";
      step = 'confirm';
    } catch (err) {
      message = ` Signup failed: ${err}`;
    }
  }

  async function handleConfirm() {
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      message = " Email confirmed! Logging in...";

      const token = await login(email, password);

      const res = await fetch('https://nei6ijkhbf.execute-api.eu-west-1.amazonaws.com/prod/notes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      message = ` Auth + API worked:\n${JSON.stringify(data, null, 2)}`;
    } catch (err) {
      message = ` Confirmation failed: ${err}`;
    }
  }
</script>

<h1>Sign Up</h1>

{#if step === 'signup'}
  <input bind:value={email} placeholder="Email" />
  <input bind:value={password} type="password" placeholder="Password" />
  <button on:click={handleSignup}>Sign Up</button>
{/if}

{#if step === 'confirm'}
  <p>Check your email for a verification code.</p>
  <input bind:value={code} placeholder="Confirmation code" />
  <button on:click={handleConfirm}>Confirm Code</button>
{/if}

<p>
  Already have an account? <a href="/login">Log in</a>
</p>

<pre>{message}</pre>
