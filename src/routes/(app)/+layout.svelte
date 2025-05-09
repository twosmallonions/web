<script lang="ts">
    import Sidemenu from '$lib/components/nav/Sidemenu.svelte';
    import { Menu } from '@lucide/svelte';
    let { children } = $props()
    import { page } from '$app/state';
    export const appTitle: string = 'Two Small Onions';
</script>

<div class="bg-base-100 h-full font-display">
    <div class="drawer lg:drawer-open">
        <input type="checkbox" id="sidebar-drawer" class="drawer-toggle" />

        <div class="drawer-content">
            <div class="navbar bg-base-200 w-full lg:hidden">
                <label for="sidebar-drawer" class="btn btn-square btn-ghost">
                    <Menu class="h-6 w-6" />
                </label>
                <div class="flex-1">
                    <span class="px-2 text-lg font-semibold">{appTitle}</span>
                </div>
            </div>

            <!-- Main content -->
            <div class="flex justify-center p-2 md:p-4 h-full">
                {@render children()}
            </div>
        </div>
        <Sidemenu currentRoute={page.url.pathname} {appTitle} />
    </div>
</div>
