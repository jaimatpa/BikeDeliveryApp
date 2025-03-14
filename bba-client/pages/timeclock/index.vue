<template>
    <Page>
      <v-row>
        <v-col 
          v-for="(item, index) in Items" 
          :key="index" 
          cols="12" 
          xs="4" 
          sm="4" 
          md="4" 
          xl="4" 
          :class="isMobile ? 'custom-media-sm' : ''"
        >
          <v-card 
            :height="isMobile ? '120' : '180'" 
            class="d-flex flex-column align-center justify-center cursor-pointer dashboard-card" 
            elevation="0" 
            @click="item.function"
            :style="{ opacity: item.opacity }"
            outlined
          >
            <v-img 
              :max-height="isMobile ? '40' : '60'" 
              :max-width="isMobile ? '80' : '120'" 
              :src="item.icon" 
              aspect-ratio="1" 
              contain
            ></v-img>

            <p class="title text--secondary" :class="[isMobile ? 'mt-0 mb-0' : 'mt-3 mb-0']">
              {{ item.title }}
            </p>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" xl="12" class="mt-5" justify="center">
          <div :class="[isMobile ? 'text-center' : '']">
            <!-- <span class="gray--text mb-1">
              Your status: 
            </span> -->
            <span :class="`headline  ${currentStatus.color}--text mb-1`">
              {{ currentStatus.text }}
            </span>
            <v-divider :class="[isMobile ? 'mobile-divider' : '']"></v-divider>
          </div>
        </v-col>
      </v-row>
      <!-- Orders Mock Data Table -->
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="12" xl="12" class="mt-1">
          <v-data-table
            :headers="headers"
            :items="orders"
            :search="search"
            :options.sync="options"
            :hide-default-footer="false"
            :server-items-length="totalOrders"
            class="elevation-1"
            :mobile-breakpoint="0"
            :items-per-page="10"
          >
            <!-- Date -->
            <template v-slot:[`item.createdAt`]="{ item }">
              {{ getDateFormat(item.createdAt) }}
            </template>
            <template v-slot:[`item.status`]="{ item }">
              {{ getStatusFormat(item.status) }}
            </template>
            <template v-slot:[`item.duration`]="{ item }">
              {{ getDurationFormat(item.duration, item.status) }}
            </template>
            <!-- Name Editable Cell -->
            <template v-slot:item.note="{ item }">
              <v-text-field
                v-model="item.note"
                @blur="saveNote(item)"
                hide-details
                single-line
                style="margin-bottom: 16px;"
              />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </Page>
  </template>
  
  <script>
  import moment from "moment";
  import Page from "@/components/paradym/Page";
  import PageSection from "@/components/paradym/PageSection";
  
  export default {
    name: "pageIndex",
    auth: true,
    head() {
      return {
        title: "Home",
      };
    },
    components: {
      Page,
      PageSection,
    },
    computed: {
      isMobile() {
        return this.$vuetify.breakpoint.width < this.breakpoint;
      },
      currentStatus() {
        let statusInfo = { text: "Unknown Status", color: "grey" };

        switch (this.status) {
          case 0:
            statusInfo = { text: "Clocked Out", color: "red" };
            break;
          case 1:
            statusInfo = { text: "Clocked In", color: "green" };
            break;
          case 2:
            statusInfo = { text: "On Break", color: "orange" };
            break;
          case 3:
            statusInfo = { text: "During Lunch", color: "blue" };
            break;
        }

        return statusInfo;
      },
    },
    data() {
      return {
        breakpoint: 640,
        totalOrders: 0,
        timeInterval: null,
        orders: [],
        search: "",
        loading: true,
        options: {},
        status: 0,
        userPosition: {},
        headers: [
          // {
          //   text: "Id",
          //   align: "start",
          //   value: "id",
          // },
          {
            text: "From",
            align: "start",
            value: "createdAt",
            sortable: false, 
            width:'200px',
          },
          {
            text: "Duration",
            align: "end",
            value: "duration",
            sortable: false, 
            width:'150px',
          },
          {
            text: "Status",
            align: "start",
            value: "status",
            sortable: false, 
            width:'100px',
          },
          // {
          //   text: "Location",
          //   value: "location",
          // },
          {
            text: "Note",
            value: "note",
            sortable: false, 
            style: 'white-space: nowrap;',
            editable: true,
          },
        ],
        Items: [
          {
            title: "Clock in",
            icon: require("./../../assets/images/timer_start.svg"),
            opacity: 1,
            function: async () => {
              if(this.status == 0) this.status = 1;
              else if(this.status == 1) this.status = 2;
              else if(this.status > 1) this.status = 1;
              this.updateServerStatus();
            },
          },
          {
            title: "Lunch",
            icon: require("./../../assets/images/timer_lunchbreak.svg"),
            opacity: 0.3,
            function: async () => {
              if(this.status == 0 || this.status == 3) return;
              this.status = 3;
              this.updateServerStatus();
            },
          },
          {
            title: "Clock out",
            icon: require("./../../assets/images/timer_stop.svg"),
            opacity: 0.3,
            function: async () => {
              if(this.status == 0) return;
              this.status = 0;
              this.updateServerStatus();
            },
          },
        ],
      };
    },
    watch: {
      options: {
        handler() {
          this.getDataFromApi();
        },
        deep: true,
      },
      // search: function(newValue) {
      //   this.getDataFromApi();
      // },
      status(newValue) {
        this.handleStatusChange(newValue);
      },
    },
    async created() {
      await this.getLastStatus();
      this.getDataFromApi();
      this.getUserPosition();
    },
    mounted() {
      this.startStatusPolling();
    },
    beforeDestroy() {
      this.stopStatusPolling();
    },
    methods: {
      async getLastStatus() {
        const resposne = await this.$axios.$get("/api/user/timeclock/lastStatus");
        if(resposne) {
          this.status = resposne.status
          if(this.orders){
            const firstItem = this.orders[0];
            if (firstItem && firstItem.status === 1) {
              firstItem.duration = resposne.duration;
            }
          }
        }
      },
      startStatusPolling() {
        this.statusInterval = setInterval(async () => {
          await this.getLastStatus();
        }, 1000);
      },
      stopStatusPolling() {
        if (this.statusInterval) {
          clearInterval(this.statusInterval);
          this.statusInterval = null;
        }
      },
      async saveNote(item){
        await this.$axios.$put("/api/user/timeclock", {
          ...item
        });
      },  
      async handleStatusChange(newStatus) {
        switch(newStatus){
          case 0:
            this.Items[0].opacity = 1;
            this.Items[0].title = 'Clock in';
            this.Items[0].icon = require("./../../assets/images/timer_start.svg");
            this.Items[1].opacity = 0.3;
            this.Items[2].opacity = 0.3;
            break;
          case 1:
            this.Items[0].opacity = 1;
            this.Items[0].title = 'Pause';
            this.Items[0].icon = require("./../../assets/images/timer_pause.svg");
            this.Items[1].opacity = 1;
            this.Items[2].opacity = 1;
            break;
          case 2:
            this.Items[0].opacity = 1;
            this.Items[0].title = 'Resume';
            this.Items[0].icon = require("./../../assets/images/timer_start.svg");
            this.Items[1].opacity = 1;
            this.Items[2].opacity = 1;
            break;
          case 3:
            this.Items[0].opacity = 1;
            this.Items[0].title = 'Resume';
            this.Items[0].icon = require("./../../assets/images/timer_start.svg");
            this.Items[1].opacity = 1;
            this.Items[2].opacity = 1;
            break;
        }
      },
      async updateServerStatus(){
        if(!this.loading) {
          await this.$axios.$post("/api/user/timeclock", {
            status: this.status,
            lat: this.userPosition.lat,
            lng: this.userPosition.lng,
          });
          this.getDataFromApi();
        }
      },
      getUserPosition () {
        if (process.client) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                this.userPosition = pos;
              },
              (error) => {
                console.log("error =========== ", error);
              }
            );
          }
        }
      },
      getDateFormat(date) {
        return moment(date)
          // .add(4, "hours")
          .format("MM/DD/YYYY hh:mm A");
      },
      getStatusFormat(status) {
        switch (status) {
          case 0:
            return "Clocked Out";
          case 1:
            return "Clocked In";
          case 2:
            return "Break";
          case 3:
            return "Lunch";
          default:
            return "Unknown Status";
        }
      },
      getDurationFormat(duration, status) {
        if (duration === 0 || status == 0) return '';

        const seconds = Math.floor(duration / 1000);
        const days = Math.floor(seconds / (24 * 3600));
        const hours = Math.floor((seconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        let parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

        return parts.join(' ') || '';
      },
      getLockFormat(lock) {
        if (lock) {
          return "YES";
        } else {
          return "NO";
        }
      },
      getPrintFormat(printed) {
        if (printed) {
          return "YES";
        } else {
          return "NO";
        }
      },
      async getDataFromApi() {
        this.loading = true;

        try {
          const data = await this.apiCall();
          this.orders = data.items;
          this.totalOrders = data.total;
          // if (this.timeInterval) {
          //   clearInterval(this.timeInterval);
          // }
          // if(!this.timeInterval)
          //   this.timeInterval = setInterval(() => {
          //     const firstItem = this.orders[0];
          //     if (firstItem && firstItem.status === 1) {
          //       firstItem.duration += 1000;
          //     }else firstItem.duration = 1000;
          //   }, 1000);

        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          this.loading = false;
        }
      },
      apiCall() {
        return new Promise(async (resolve, reject) => {
          // let param = {
          //   search: this.search,
          //   type: "Dashboard",
          // };
  
          const {
              page,
              itemsPerPage
          } = this.options;
          const orderMockData = await this.$axios.$get("/api/user/timeclock", {
            // params: param,
          });
  
          let items = orderMockData;
          const total = orderMockData?.length;
  
          // if (sortBy?.length === 1 && sortDesc?.length === 1) {
          //   items = items.sort((a, b) => {
          //     const sortA = a[sortBy[0]];
          //     const sortB = b[sortBy[0]];
  
          //     if (sortDesc[0]) {
          //       if (sortA < sortB) return 1;
          //       if (sortA > sortB) return -1;
          //       return 0;
          //     } else {
          //       if (sortA < sortB) return -1;
          //       if (sortA > sortB) return 1;
          //       return 0;
          //     }
          //   });
          // }
  
          if (itemsPerPage > 0) {
              items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
          }
  
          setTimeout(() => {
            resolve({
              items,
              total,
            });
          }, 1000);
        });
      },
    },
  };
  </script>
  
  <style lang="scss">
  .custom-media-sm {
    flex-basis: 50% !important;
    align-items: center !important;
    justify-content: center !important;
  
    .dashboard-card {
      background-color: #f5f6fa;
      border: 2px solid #4c9a2a;
  
      .title {
        font-size: 14px !important;
      }
    }
  }
  
  .mobile-divider {
    max-width: 50%;
    margin: 0 auto;
  }
  </style>
  