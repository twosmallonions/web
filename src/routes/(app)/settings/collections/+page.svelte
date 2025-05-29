<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ApiUser } from '$lib/types/user.js';
    import { Pencil, Plus, Save, Trash } from '@lucide/svelte';

    const { data } = $props();
    let editModal: HTMLDialogElement | undefined = $state();
    const { collections } = data;

    function showEditModal(collectionId: string | null = null) {
        if (!editModal) {
            return;
        }
        collectionEditId = collectionId;
        editModal.showModal();
    }

    let collectionEditId: string | null | undefined = $state();
    let drowndownOpen = $state(false);
    let users: ApiUser[] = $state([])
    let userToAdd: ApiUser | undefined = $state();
    async function openUsersDropdown() {
        users = []
        let userResponse = await (await fetch('/settings/users?exclude_self=false')).json();

        users.push(...userResponse)
        drowndownOpen = true;
    }

    async function searchForUser() {
        let params = new URLSearchParams({'exclude_self': 'false', 'search': userSearchQuery})
        let userResponse = await (await fetch(`/settings/users?${params.toString()}`)).json();
        users = []
        users.push(...userResponse)
    }

    let userSearchQuery = $state('');

    async function setUserToAdd(user: ApiUser) {
        if (!collectionEditId) {
            return;
        }
        drowndownOpen = false;
        userSearchQuery = user.displayName;
        console.log(collectionEditId, user.id);
        userToAdd = user;
    }

    async function addUserToCollection() {
        if (!userToAdd) {
            return;
        }
    }
</script>

<div class="min-w-[80%]">
    <table class="table w-full">
        <thead>
            <tr>
                <th>Collection</th>
                <th>Users</th>
            </tr>
        </thead>
        <tbody>
            {#each collections as collection (collection.id)}
                <tr
                    class="hover:bg-base-300 hover:cursor-pointer"
                    onclick={() => showEditModal(collection.id)}
                >
                    <th>{collection.name}</th>
                    <th>{collection.id}</th>
                </tr>
            {/each}
        </tbody>
        <tfoot>
            <tr>
                <td
                    ><button class="btn btn-circle btn-accent" onclick={() => showEditModal()}>
                        <Plus />
                    </button></td
                >
            </tr>
        </tfoot>
    </table>

    <dialog class="modal" bind:this={editModal}>
        <div class="modal-box min-h-[90%] min-w-[70%]">
            <form action="?/addUser" method="POST" use:enhance>
                <fieldset class="fieldset">
                    <legend class="fieldset-legend">Add a User to Collection</legend>
                    <div class="join">
                        <div>
                            <input
                                type="text"
                                class="input join-item"
                                onfocus={openUsersDropdown}
                                bind:value={userSearchQuery}
                                oninput={searchForUser}
                            />
                            <input type="text" name="collectionId" value={collectionEditId} class="hidden">
                            <input type="text" name="userId" value={userToAdd?.id} class="hidden">
                            {#if drowndownOpen}
                                <div class="relative top-2">
                                    <ul class="menu bg-base-200 rounded-box absolute top-0">
                                        {#each users as user}
                                            <li><button onclick={() => setUserToAdd(user)}>{user.displayName}</button></li>
                                        {/each}
                                    </ul>
                                </div>
                            {/if}
                        </div>
                        <button class="btn join-item" type="submit">Add</button>
                    </div>
                </fieldset>
            </form>
            <div class="divider"></div>
            <div>hi</div>
        </div>
        <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>
</div>
