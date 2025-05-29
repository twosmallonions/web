<script lang="ts">
    import '../../../app.css';

    import NavLink from '$lib/components/nav/NavLink.svelte';

    import { Home, Cloud, Settings, CookingPot, Plus, Library } from '@lucide/svelte';

    let { appTitle, currentRoute }: { appTitle: string, currentRoute: string } = $props();
</script>


<div class="drawer-side">
    <label for="sidebar-drawer" class="drawer-overlay"></label>
    <div class="bg-base-200 h-full w-64">
        <div class="border-base-300 hidden border-b p-4 lg:block">
            <div class="flex items-center gap-2">
                <Cloud class="text-primary h-6 w-6" />
                <span class="text-lg font-semibold">{appTitle}</span>
            </div>
        </div>

        <!-- Navigation items -->
        <nav class="p-2">
            <ul class="menu w-full gap-2">
                <li>
                    <a href="/create" class="btn {currentRoute === '/create' ? 'btn' : 'btn-outline'} btn-primary btn-md">
                        <Plus />
                        <span>Create Recipe</span>
                    </a>
                </li>
                <NavLink target="/" text="My recipes" Icon={CookingPot} isActive={currentRoute === '/'} />
                <div class="divider"></div>
                <li>
                    <details open>
                        <summary><Settings class="h-4 w-4"/> Settings</summary>
                        <ul>
                            <NavLink target="/settings/collections" text="Collections" Icon={Library} isActive={currentRoute === '/settings/collections'}/>
                        </ul>
                    </details>
                </li>
            </ul>
        </nav>
    </div>
</div>
