<template>
<!-- Card for displaying recent publications -->
<div class="card">
    <div class="custom-notifications d-flex justify-content-between align-items-center flex-wrap">
        <div class="custom-title mb-0">Recent Release Log</div>
        <div>
            <button class="btn text-primary view-details-btn btn-sm m-0" @click="viewMore">
                <span class="mdi mdi-eye-outline mr-2"></span> View details
            </button>
        </div>
    </div>
    <div data-simplebar class="card-body border-top py-2 mb-3">
        <!-- Show a skeleton loading table when 'showSpinner' is true -->
        <b-skeleton-table v-if="showSpinner" :rows="5" :columns="2" :table-props="{ bordered: true, striped: true }"></b-skeleton-table>
        <!-- Render publications when data is available and not loading -->
        <div v-else-if="activityData.length > 0 && !showSpinner">
            <ul class="list-group card-body custom-card-body mb-3">
                <li class="list-group-item list-group-item-action m-1 custom-list-item" v-for="data in activityData" :key="data.id">
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
        <div v-else> 
            <div class="text-center font-size-14 custom-center">
                <div class="custom-container">
                    <img class="custom-image" src="../../../../assets/placeholder.png" />
                    <div class="custom-text">No Recent Publication Added</div>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            userId: this.$store.state.Auth.userId,
            activityData: [], // List of recent publications
            showSpinner: true,
        };
    },
    mounted() {
        // Check if recent publications data is available in the store, if not, fetch data
        if (this.$store.state.Auth.recentPublicationsData.length) {
            this.showSpinner = false;
            this.activityData = this.$store.state.Auth.recentPublicationsData
                .reverse()
                .slice(0, 5);
        } else {
            this.getReleaseNote(); // Fetch recent publications
        }
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
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
        // Fetch recent publications
        getReleaseNote() {
            this.$store.getters.client
                .get(`/orguser/release/byuserId?userId=${this.userId}`)
                .then((response) => {
                    if (response.data) {
                        this.showSpinner = false;
                        this.activityData = response.data.reverse().slice(0, 5);
                        console.log(this.activityData.length > 0);
                        this.$store.commit("setRecentPublicationsData", response.data);
                    } else {
                        this.messageToast(
                            "Invalid request",
                            "danger",
                            "No data received from the server"
                        );
                        this.showSpinner = false;
                    }
                })
                .catch((err) => {
                    this.messageToast(
                        "Invalid request",
                        "danger",
                        err.response ? err.response.data.message : "An error occurred"
                    );
                    this.showSpinner = false;
                });
        },
    },
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
