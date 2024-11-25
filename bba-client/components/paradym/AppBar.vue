<!-- Paradym Component
  Name:     AppBar
  Version:  0.11
-->

<template>
<v-app-bar :app="app" clipped-left flat :dark="dark" :color="color">
    <!-- For Mobile Menu -->
    <IconButtonMenuLeft v-if="isMobileBreakPoint" :items="menuItems" icon="mdi-menu" />

    <!-- For Web Menu -->
    <v-app-bar-nav-icon v-if="hasMenuClickHandler && !isMobileBreakPoint" @click.stop="$emit('menuClick')" />

    <v-toolbar-title v-if="title || logo" class="mx-1 pl-0" :class="[isMobileBreakPoint ? 'full-width' : '']">
        <n-link to="/">
            <div class="d-flex align-center justify-center">
                <img v-if="logo" :src="logo" :height="computedLogoHeight" :alt="title" class="mr-2" />
                <span v-if="title">{{ title }}</span>
            </div>
        </n-link>
    </v-toolbar-title>
    <v-spacer />
    <slot></slot>
</v-app-bar>
</template>

<script>
import IconButtonMenuLeft from "./IconButtonMenuLeft";

export default {
    name: "appBar",
    props: {
        title: String,
        color: String,
        logo: String,
        logoHeight: {
            type: [Number, String],
            default: "36px",
        },
        dark: Boolean,
        app: Boolean,
        isMobileBreakPoint: Boolean,
    },
    components: {
        IconButtonMenuLeft,
    },
    computed: {
        hasMenuClickHandler() {
            return !!(this.$listeners && this.$listeners.menuClick);
        },
        computedLogoHeight() {
            if (!isNaN(this.logoHeight)) return this.logoHeight + "px";
            else return this.logoHeight;
        },
    },
    data() {
        return {
            menuItems: [{
                    title: "DASHBOARD",
                    iconImage: require('./../../assets/images/home.svg'),
                    to: "/",
                },
                {
                    title: "SEARCH HISTORY",
                    iconImage: require('./../../assets/images/search.svg'),
                    to: "/searchHistory",
                },
                {
                    title: "DELIVERY ORDER",
                    iconImage: require('./../../assets/images/delivery_bike.svg'),
                    to: "/deliveryOrder",
                },
                {
                    title: "LOCKING",
                    iconImage: require('./../../assets/images/lock.svg'),
                    to: "/locking",
                },
                {
                    title: "RESEND",
                    iconImage: require('./../../assets/images/resend.svg'),
                    to: "/resend",
                },
                {
                    title: "PICKUP",
                    icon: "mdi-truck",
                    iconSelected: "mdi-truck-check",
                    to: "/pickup",
                    color: "primary",
                },
                {
                    title: "TIME CLOCK",
                    icon: "mdi-timer",
                    iconSelected: "mdi-timer-marker",
                    to: "/timeclock",
                    disabled: false,
                    color: "primary",
                },
                {
                    title: "EQUIPMENT SWAP",
                    icon: "mdi-swap-horizontal-circle-outline",
                    iconSelected: "mdi-swap-horizontal-circle",
                    to: "/equipmentswap",
                    disabled: false,
                    color: "primary",
                },
            ],
        };
    },
};
</script>

<style lang="scss">
.v-toolbar__title a {
    text-decoration: none;
    color: unset !important;
}

.full-width {
    width: 100% !important;
}
</style>
