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
</div>