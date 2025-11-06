<script lang="ts">
    import { authClient } from "$lib/auth-client";
    const session = authClient.useSession();
</script>
      
<div>
{#if $session.data}
    <div>
    <p>
        {$session.data.user.name}
    </p>
    <button class="btn"
        onclick={async () => {
            await authClient.signOut();
        }}
    >
        Sign Out
    </button>
    </div>
{:else}
    <button class="btn"
      onclick={async () => {
        await authClient.signUp.email({
            name: "miguel",
            email: "m@m.es",
            password: "123",
        });
    }}
    >
    Crear cuenta
    </button>
    <button class="btn"
      onclick={async () => {
        await authClient.signIn.email({
            email: "m@m.es",
            password: "123",
        });
    }}
    >
    Login
    </button>
{/if}
{#if $session.error}
<div role="alert" class="alert alert-error">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>Error! {$session.error.toString()}</span>
    </div>
{/if}
</div>