<template>
<div>
    <!-- Modal for conversion progress -->
    <b-modal id="modal-progress" ref="modaloutputprogress" title="Processing" title-class="font-18" hide-header hide-footer hide-close no-close-on-backdrop no-close-on-esc>
        <p>Please wait while your file is being converted to DITA.</p>
        <b-progress :value="progress" :max="100" class="custom-progress"></b-progress>
    </b-modal>
    <div>
        <!-- Modal for important message -->
        <b-modal ref="my-modal" hide-footer title="important message" hide-close no-close-on-backdrop no-close-on-esc>
            <div class="d-block text-center">
                <h6>
                    "I'm sorry, It seems that the formatting of your Word file is not correct, which may be causing some
                    issues.
                    In order to rectify this, you will need to adjust the formatting to ensure that it meets the
                    required standards.
                    Once you have made the necessary changes, please try again.
                </h6>
            </div>
            <button puser-btn block @click="hideModal">Go Back</button>
        </b-modal>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card-header bg-primary text-white">
                <h5 class="card-title  text-white mb-0">
                    <i class="fa fa-fw fa-cog me-2"></i>Source word file selection
                </h5>
            </div>
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="col-md-12">
                        <form>
                            <div class="form-group row">
                                <label class="col-md-12 col-form-label">Select File<span class="text-danger">*</span></label>
                                <div class="col-md-12">
                                    <!-- Dropdown for selecting a file -->
                                    <select class="form-control" v-model="selectedfolder" :value="foldername" placeholder="Select DITA-OT version" required>
                                        <option value="" disabled selected>Select File</option>
                                        <!-- Options based on foldername data -->
                                        <option v-for="(version, index) in foldername" :key="index" :value="version.value">
                                            {{ version.text }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <!-- Button to initiate conversion -->
                            <button type="submit" class="btn btn-primary btn-sm  btn-block px-4 me-1 mb-3" @click.prevent="selectedfolder !== '' && convertToDita()"><i class="fa fa-fw fa-rocket me-2"></i>Convert Now</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import _ from "lodash";
export default {
    data() {
        return {
            progress: 0,
            selectedfolder: "",
            foldername: [],
            userId: null,
            orgId: null,
        };
    },
    computed: {
        _() {
            return _;
        },
    },
    mounted() {
        // Call the getfoldernames method when the component is mounted
        this.getfoldernames()
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            // Display a toast message
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        getfoldernames() {
            
            this.$store.getters.client.get(`/orguser/wordToDita/getExtractedFolderList?orgId=${this.orgId}&userId=${this.userId}`)
                .then(response => {
                    if (response.data && Array.isArray(response.data)) {
                        response.data.forEach((ele) => {
                            // Push folder names to foldername array
                            this.foldername.push({
                                value: ele.folderName,
                                text: ele.folderName,
                            });
                        });
                    } else {
                        this.messageToast("Error", "danger", "Received invalid data from the server");
                    }
                    // Hide the loader
                   
                })
                .catch(error => {
                 
                    this.messageToast("Error", "danger", error.response ? error.response.data.message : "An error occurred while fetching folder names.");
                    // Hide the loader in case of an error
                    
                });
        },
        hideModal() {
            // Redirect to the previous page
            this.$router.push({
                path: `/docmigration`
            });
        },
        convertToDita() {
            this.progress = 0;
            const body = {
                userId: null,
                orgId: null,
                folderName: this.selectedfolder,
            };
            const targetProgress = 100;
            const totalTime = 5000;
            const increment = (targetProgress / totalTime) * 50;
            const intervalId = setInterval(() => {
                if (this.progress < targetProgress) {
                    this.progress += increment;
                } else {
                    clearInterval(intervalId);
                }
            }, 50);
            this.$refs["modaloutputprogress"].show();
            this.$store.getters.client.post("/orguser/wordToDita/convertToDita", body)
                .then(response => {
                    clearInterval(intervalId); // Stop the progress interval
                    setTimeout(() => {
                        this.$refs["modaloutputprogress"].hide();
                    }, 2000);
                    this.foldername = response.data;
                    this.messageToast(
                        "Success",
                        "success",
                        response.data.message
                    );
                    setTimeout(() => {
                        this.$router.push({
                            path: `/docmigration/converttodita/outputscreen/${this.selectedfolder}`
                        });
                        this.$refs["modaloutputprogress"].hide();
                    }, 2000);
                })
                .catch(error => {
                    clearInterval(intervalId); // Stop the progress interval
                    error
                    setTimeout(() => {
                        this.$refs["modaloutputprogress"].hide();
                    }, 3000);
                    setTimeout(() => {
                        this.$refs['my-modal'].show();
                    }, 2000);
                });
        },
    }
}
</script>
<style scoped>
.custom-progres {
    height: 5px;
}
</style>
