<!-- Paradym Component
  Name:     NotificationButtonMenu
  Version:  0.1
-->

<template>
<v-menu open-on-click bottom :left="left" offset-y transition="slide-y-transition" :content-class="isMobile ? 'mobile-menu' : ''">
    <template v-slot:activator="{ on, attrs }">
        <v-btn text icon v-bind="attrs" v-on="on" class="mx-0" style="left: -4px;">
            <v-icon>{{ icon }}</v-icon>
        </v-btn>
    </template>
    <template> 
        <v-list lines="one">

            <template v-for="(item, index) in items">
                <v-list-item :key="`user_${index}`" style="display: block">
                    <template>
                        <!-- <div class="mt-1 mb-1">Friday, April 3rd, 2013 05:03 PM</div> -->
                        <div class="mt-2 mb-2">{{ item.message }}</div>

                        <v-btn class="mb-3" v-if="item.deliveryOrderId >0" @click.stop="$router.push({ path: `/deliveryOrder/${item.DeliveryOrder.orderid}` })">Go to Order #{{item.DeliveryOrder.orderid}}</v-btn>
                        <!-- <v-btn class="mb-2" v-if="item.tripId >0" @click.stop="$router.push({ path: `/deliveryOrder/${item.orderid}` })">Go to Trip #{{item.tripId}}</v-btn> -->
                    </template>
                </v-list-item>
                <v-divider v-if="index < items.length - 1" />
            </template>

            <v-list-item :key="0" class="mt-2 mb-2" v-if="items.length == 0">
                There are no notifications.
            </v-list-item>
        </v-list>            

    </template>
</v-menu>
</template>

<script>
export default {
    name: "notificationButtonMenu",
    props: {
        items: {
            type: Array,
            default: () => {
                return [
                    {
                    name: 'Item #1',
                    id: 1,
                    },
                    {
                    name: 'Item #2',
                    id: 2,
                    },
                    {
                    name: 'Item #3',
                    id: 3,
                    },
                ];
            },
        },
        breakpoint: {
            type: Number,
            default: 640,
        },
        icon: String,
        iconImage: String,
        downArrowIcon: String,
        left: Boolean,
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.width < this.breakpoint;
        },
    },
    methods: {
        runAction(item) {
            if (item.hasOwnProperty("action")) {
                item.action();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.mobile-menu {
    min-width: 100% !important;
    top: 56px !important;
    left: 0px !important;
    transform-origin: left top !important;
    z-index: 8 !important;

    border-bottom-color: #4c9a2a;
    border-bottom-style: solid;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;

    .v-list {
        background-color: #444444 !important;

        .v-list-item__content {
            .v-list-item__title {
                color: #ffffff !important;
                flex: none !important;
            }

            .rectangular-icon {
                .arrow-icon {
                    position: relative;
                    top: 3px;
                    left: -26px;
                }
            }
        }
    }
}
</style>
