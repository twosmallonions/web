<script lang="ts">
    import '../../../app.css';

    import NavLink from '$lib/components/nav/NavLink.svelte';

    import { Home, Cloud, Settings, Menu, CookingPot, Plus } from '@lucide/svelte';

    export const appTitle: string = 'Two Small Onions';
</script>

<div class="h-full bg-base-100">
    <div class="drawer lg:drawer-open">
        <!-- Drawer trigger for mobile -->
        <input type="checkbox" id="sidebar-drawer" class="drawer-toggle" />

        <!-- Page content -->
        <div class="drawer-content">
            <!-- Hamburger menu button (only visible on mobile) -->
            <div class="navbar w-full bg-base-200 lg:hidden">
                <label for="sidebar-drawer" class="btn btn-square btn-ghost">
                    <Menu class="h-6 w-6" />
                </label>
                <div class="flex-1">
                    <span class="px-2 text-lg font-semibold">{appTitle}</span>
                </div>
            </div>

            <!-- Main content -->
            <div class="p-2 md:p-4 flex justify-center">
                <slot />
            </div>
        </div>
        <!-- Sidebar content -->
        <div class="drawer-side">
            <label for="sidebar-drawer" class="drawer-overlay"></label>
            <div class="h-full w-64 bg-base-200">
                <!-- Logo area (hidden on mobile since we show it in navbar) -->
                <div class="hidden border-b border-base-300 p-4 lg:block">
                    <div class="flex items-center gap-2">
                        <Cloud class="h-6 w-6 text-primary" />
                        <span class="text-lg font-semibold">{appTitle}</span>
                    </div>
                </div>

                <!-- Navigation items -->
                <nav class="p-2">
                    <ul class="menu menu-vertical w-full">
                        <li>
                            <a href="/create" class="btn btn-outline btn-primary btn-md">
                                <Plus />
                                <span>Create Recipe</span>
                            </a>
                        </li>
                        <NavLink target="/" text="Home" icon={Home} />
                        <NavLink target="/recipes" text="My recipes" icon={CookingPot} />
                        <div class="divider"></div>
                        <NavLink target="/settings" text="Settings" icon={Settings} />
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</div>