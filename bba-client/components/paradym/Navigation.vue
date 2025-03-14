<!-- Paradym Component
  Name:     Navigation
  Version:  0.1
-->

<template>
    <v-navigation-drawer :value="this.isMobile ? this.drawer : true" @input="
        (e) => {
            this.isMobile ? (drawer = e) : (drawer = true);
        }
    " :mini-variant="isMobile ? false : !drawer" :mobile-breakpoint="breakpoint" :app="app" mini-variant-width="76"
        floating clipped fixed width="225">
        <slot name="header"></slot>
        <v-list shaped>
            <v-list-item v-for="(item, i) in items" :disabled="item.disabled" :key="i" :to="item.to" router exact
                @click="onNavClick" :color="item.color">
                <v-tooltip right :disabled="isMobile ? true : !drawer" nudge-right="8" color="#222222">
                    <template v-slot:activator="{ on, attrs }">
                        <v-list-item-action class="pl-2 mr-4" v-bind="attrs" v-on="on">
                            <v-icon>{{ $nuxt.$route.path != item.to ? item.icon : item.iconSelected }}</v-icon>
                        </v-list-item-action>
                    </template>
                    <span>{{ item.title }}</span>
                </v-tooltip>
                <v-list-item-content>
                    <v-list-item-title v-text="item.title" />
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-footer style=" position: fixed; bottom: 0; width: 100%; display: flex; justify-content: center;">
            <div style=" display: flex; align-items: center;">
                <small>V{{ version }} {COMMIT}</small>
            </div>
        </v-footer>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: "navigation",
    props: {
        items: {
            type: Array,
            default: () => {
                return [];
            },
        },
        value: {
            type: Boolean,
            default: true,
        },
        breakpoint: {
            type: Number,
            default: 640,
        },
        color: {
            type: String,
            default: "undefined",
        },
        app: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            version: require('~/package.json').version,
            drawer: this.value,
        };
    },
    watch: {
        value(newValue) {
            this.drawer = newValue;
        },
        drawer(newValue) {
            this.$emit("input", newValue);
        },
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    methods: {
        onNavClick() {
            // Close the navigation on mobile when an item is clicked
            if (this.isMobile) this.drawer = false;
        },
    },
};
</script>
