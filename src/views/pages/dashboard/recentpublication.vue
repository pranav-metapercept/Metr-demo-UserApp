<template>
    <!-- Card for displaying recent publications -->
    <div class="card">
        <div class="custom-notifications d-flex justify-content-between align-items-center flex-wrap">
            <div class="custom-title mb-0">Recent Release Log</div>
            <!-- <div>
                <button class="btn text-primary view-details-btn btn-sm m-0" @click="viewMore">
                    <span class="mdi mdi-eye-outline mr-2"></span> View details
                </button>
            </div> -->
        </div>
        <div data-simplebar class="card-body border-top py-2 mb-3">

            <!-- Render publications when data is available and not loading -->
            <div>
                <ul class="list-group card-body custom-card-body mb-3">
                    <li class="list-group-item list-group-item-action m-1 custom-list-item" v-for="data in activityData"
                        :key="data.id">
                        <div class="d-flex justify-content-between">
                            <h5 class="mb-1 font-size-13 ptitle-cust-cls">
                                {{ data.releaseTitle }}
                            </h5>
                            <div class="badge-soft-success ml-1 font-size-14 custom-badge">
                                Output format: {{ data.outputFormat }}
                            </div>
                        </div>
                        <p class="mb-1">
                            <b><span class="font-size-14 custom-released-by">Released By: {{ data.releasedBy }}</span></b>
                        </p>
                        <small class="text-muted font-size-14 custom-time-ago">{{
                            getTimeAgo(data.createdAt)
                        }}</small>
                    </li>
                </ul>
            </div>


        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

            activityData: [
   {
      "_id": "641051ebca19b316a00b796a",
      "ditaMapFileName": "ditamap20",
      "outputFormat": "html5",
      "ditaotVersion": "3.4.1",
      "orgId": "640ecdb18e33cc0b2c5ea795",
      "userId": "63f3120a58cb1b1d4852b107",
      "releaseTitle": "DitaxPresso guide",
      "releasedBy": "Jyoti Kamal Singh",
      "createdAt": "2023-03-14T10:52:27.505Z",
      "updatedAt": "2023-03-14T10:52:27.505Z"
   },
   {
      "_id": "64105403ca19b316a00b796b",
      "ditaMapFileName": "ditamap20",
      "outputFormat": "html5",
      "ditaotVersion": "3.4.1",
      "orgId": "640ecdb18e33cc0b2c5ea795",
      "userId": "63f3120a58cb1b1d4852b107",
      "releaseTitle": "DitaxPresso guide",
      "releasedBy": "Samantha Roberts",
      "createdAt": "2023-03-14T11:01:23.019Z",
      "updatedAt": "2023-03-14T11:01:23.019Z"
   },
   {
      "_id": "6410570eca19b316a00b796c",
      "ditaMapFileName": "ditamap21",
      "outputFormat": "pdf",
      "ditaotVersion": "3.5.2",
      "orgId": "640ecdb18e33cc0b2c5ea795",
      "userId": "63f3120a58cb1b1d4852b107",
      "releaseTitle": "Documentation Overhaul",
      "releasedBy": "Nathan Blackwell",
      "createdAt": "2023-05-02T14:45:11.742Z",
      "updatedAt": "2023-05-02T14:45:11.742Z"
   },
   {
      "_id": "64105a9dca19b316a00b796d",
      "ditaMapFileName": "ditamap22",
      "outputFormat": "epub",
      "ditaotVersion": "3.6.0",
      "orgId": "640ecdb18e33cc0b2c5ea795",
      "userId": "63f3120a58cb1b1d4852b107",
      "releaseTitle": "User's Guide",
      "releasedBy": "Emily Anderson",
      "createdAt": "2023-07-19T09:32:45.126Z",
      "updatedAt": "2023-07-19T09:32:45.126Z"
   },
   {
      "_id": "64105d28ca19b316a00b796e",
      "ditaMapFileName": "ditamap23",
      "outputFormat": "html5",
      "ditaotVersion": "3.6.3",
      "orgId": "640ecdb18e33cc0b2c5ea795",
      "userId": "63f3120a58cb1b1d4852b107",
      "releaseTitle": "Interactive Tutorial",
      "releasedBy": "Aiden Turner",
      "createdAt": "2023-09-10T18:20:37.891Z",
      "updatedAt": "2023-09-10T18:20:37.891Z"
   },
   {
      "_id": "64106232ca19b316a00b796f",
      "ditaMapFileName": "ditamap24",
      "outputFormat": "html5",
      "ditaotVersion": "3.7.0",
      "orgId": "640ecdb18e33cc0b2c5ea795",
      "userId": "63f3120a58cb1b1d4852b107",
      "releaseTitle": "Advanced Techniques",
      "releasedBy": "Olivia Carter",
      "createdAt": "2023-11-05T12:15:55.673Z",
      "updatedAt": "2023-11-05T12:15:55.673Z"
   },
   {
      "_id": "6410648eca19b316a00b7970",
      "ditaMapFileName": "ditamap25",
      "outputFormat": "pdf",
      "ditaotVersion": "3.7.2",
      "orgId": "640ecdb18e33cc0b2c5ea795",
      "userId": "63f3120a58cb1b1d4852b107",
      "releaseTitle": "Optimization Guide",
      "releasedBy": "Liam Mitchell",
      "createdAt": "2024-01-08T08:50:14.991Z",
      "updatedAt": "2024-01-08T08:50:14.991Z"
   },
   {
      "_id": "64106710ca19b316a00b7971",
      "ditaMapFileName": "ditamap26",
      "outputFormat": "epub",
      "ditaotVersion": "3.8.0",
      "orgId": "640ecdb18e33cc0b2c5ea795",
      "userId": "63f3120a58cb1b1d4852b107",
      "releaseTitle": "Mastering DitaxPresso",
      "releasedBy": "Lucas Foster",
      "createdAt": "2024-03-14T15:30:42.217Z",
      "updatedAt": "2024-03-14T15:30:42.217Z"
   },
   {
      "_id": "64106977ca19b316a00b7972",
      "ditaMapFileName": "ditamap27",
      "outputFormat": "html5",
      "ditaotVersion": "3.9.1",
      "orgId": "640ecdb18e33cc0b2c5ea795",
      "userId": "63f3120a58cb1b1d4852b107",
      "releaseTitle": "Advanced User Manual",
      "releasedBy": "Sophia Rodriguez",
      "createdAt": "2024-05-20T09:12:31.572Z",
      "updatedAt": "2024-05-20T09:12:31.572Z"
   }
]


        };
    },

    methods: {

        viewMore() {
            this.$router.push({
                name: "Releasetable",
            });
        },
        // Function to calculate the time ago since a given timestamp
        getTimeAgo(timestamp) {
            const now = new Date();
            const timeDiff = now.getTime() - new Date(timestamp).getTime();
            const minuteDiff = Math.floor(timeDiff / 60000); // 60000 milliseconds in a minute
            if (minuteDiff < 1) {
                return "just now";
            } else if (minuteDiff < 60) {
                return `${minuteDiff} minute${minuteDiff > 1 ? "s" : ""} ago`;
            } else {
                const hourDiff = Math.floor(minuteDiff / 60);
                if (hourDiff < 24) {
                    return `${hourDiff} hour${hourDiff > 1 ? "s" : ""} ago`;
                } else {
                    const dayDiff = Math.floor(hourDiff / 24);
                    if (dayDiff < 30) {
                        return `${dayDiff} day${dayDiff > 1 ? "s" : ""} ago`;
                    } else {
                        const monthDiff = Math.floor(dayDiff / 30);
                        if (monthDiff < 12) {
                            return `${monthDiff} month${monthDiff > 1 ? "s" : ""} ago`;
                        } else {
                            const yearDiff = Math.floor(monthDiff / 12);
                            return `${yearDiff} year${yearDiff > 1 ? "s" : ""} ago`;
                        }
                    }
                }
            }
        },
    }
};
</script>

<style scoped>
.custom-notifications {
    padding: 14px;
    gap: 24px;
}

.view-details-btn {
    background-color: rgba(113, 165, 203, 0.2);
}

.custom-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.5px;
    text-align: left;
    color: rgba(23, 35, 61, 1);
}

.card {
    height: 43vh;
    /* Set your desired fixed height */
    /* overflow-y: auto; */
    /* Enable vertical scrolling if content exceeds the height */
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .card {
        max-height: 300px;
        /* Adjust the height for smaller screens */
    }
}

.custom-center {
    margin-top: 10px;
}

.custom-container {
    position: relative;
    display: inline-block;
}

.custom-image {
    height: 200px;
    margin-bottom: 30px;
}

.custom-text {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: #666;
    padding-top: 0px;
    font-size: 16px;
}

.btn {
    white-space: nowrap;
    /* Prevent button text from wrapping */
}
</style>
