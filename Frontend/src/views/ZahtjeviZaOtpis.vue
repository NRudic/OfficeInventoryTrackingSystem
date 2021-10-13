<template>
  <div>
    <div class="card">
      <Toolbar class="p-mb-4">
        <template #left>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Izbriši filtere"
            class="p-button-outlined"
            style="margin-left:12px"
            @click="initFilters()"
          />
        </template>

        <template #right>
          <Button
            label="Izvoz"
            icon="pi pi-upload"
            class="p-button-help"
            @click="exportCSV($event)"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="requests"
        v-model:selection="selectedRequest"
        :paginator="true"
        :rows="10"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 25, 50]"
        :globalFilterFields="[
          'writeoff_id',
          'ownerName',
          'email',
          'item_id',
          'item_name',
          'item_sn',
        ]"
        class="p-datatable-sm"
        responsiveLayout="scroll"
        style="maring: 15px"
        sortMode="multiple"
        :multiSortMeta="multiSortMeta"
        :sortOrder="1"
        rowHover
      >
        <template #header>
          <div
            class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between"
          >
            <h2 class="p-mb-2 p-m-md-0 p-ml-2 p-as-md-center pull-left">
              Zahtjevi za otpis
            </h2>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Pretraživanje..."
              />
            </span>
          </div>
        </template>

        <template #empty>
          Nažalost, nema podataka.
        </template>
        <template #loading>
          Dohvaćanje zahtjeva...
        </template>

        <Column
          field="writeoff_id"
          header="Id"
          :sortable="true"
          style="min-width:5rem;padding-left: 5px"
          bodyStyle="padding-left: 14px"
        ></Column>
        <Column
          field="reason"
          header="Razlog"
          :sortable="true"
          style="min-width:6rem"
          :showFilterOperator="false"
        >
          <template #body="{data}">
            <span v-if="data.reason" v-tooltip.bottom="data.reason">
              {{
                data.reason.length > 53
                  ? data.reason.substring(0, 50) + "..."
                  : data.reason
              }}
            </span>
            <span v-else></span>
          </template>
        </Column>
        <Column
          field="request_date"
          header="Datum zahtjeva"
          :sortable="true"
          style="min-width:9rem;max-width:9rem"
          :showFilterOperator="false"
          dataType="date"
          filterField="request_date"
          bodyStyle="text-align:center"
        >
          <template #body="{data}">
            {{ formatDate(data.request_date) }}
          </template>
          <template #filter="{filterModel}">
            <Calendar
              v-model="filterModel.value"
              dateFormat="dd.mm.yy"
              placeholder="Npr. 01.01.2021"
            />
          </template>
        </Column>

        <Column
          field="is_active"
          header="Status"
          :sortable="true"
          style="min-width:7rem;max-width:8rem"
          filterField="is_active"
          :showFilterOperator="false"
          :showFilterMatchModes="false"
          :showAddButton="false"
          bodyStyle="text-align: center"
        >
          <template #body="slotProps">
            <Tag
              v-if="slotProps.data.is_active"
              severity="success"
              value="Aktivan"
              stlye="font-size: 15px;"
            ></Tag>
            <Tag
              v-else
              severity="warning"
              value="Neaktivan"
              stlye="font-size: 15px;"
            ></Tag>
          </template>
          <template #filter="{filterModel}">
            <Dropdown
              v-model="filterModel.value"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Odaberite status"
            >
            </Dropdown>
          </template>
        </Column>
        <Column
          field="is_accepted"
          header="Prihv."
          :sortable="true"
          style="min-width:7rem;max-width:7rem"
          filterField="is_accepted"
          :showFilterOperator="false"
          :showFilterMatchModes="false"
          :showAddButton="false"
          bodyStyle="text-align: center"
        >
          <template #body="slotProps">
            <Tag
              v-if="slotProps.data.is_accepted"
              severity="success"
              value="Da"
              stlye="font-size: 15px;"
            ></Tag>
            <Tag
              v-else
              severity="warning"
              value="Ne"
              stlye="font-size: 15px;"
            ></Tag>
          </template>
          <template #filter="{filterModel}">
            <Dropdown
              v-model="filterModel.value"
              :options="scannableOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Odaberite vrijednost"
            >
            </Dropdown>
          </template>
        </Column>
        <Column
          field="ownerName"
          header="Vlasnik artikla"
          :sortable="true"
          style="min-width:7rem"
          :showFilterOperator="false"
        >
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po korisniku"
            />
          </template>
        </Column>
        <Column
          field="email"
          header="Email vlasnika"
          :sortable="true"
          style="min-width:7rem"
          :showFilterOperator="false"
        >
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po emailu"
            />
          </template>
        </Column>
        <Column
          field="item_name"
          header="Artikl"
          :sortable="true"
          style="min-width:8rem;max-width:9rem"
          :showFilterOperator="false"
        >
          <template #body="{data}">
            <span v-tooltip.bottom="data.item_name">
              {{
                data.item_name.length > 33
                  ? data.item_name.substring(0, 30) + "..."
                  : data.item_name
              }}
            </span>
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po artiklu"
            />
          </template>
        </Column>
        <Column
          field="item_sn"
          header="S/N"
          :sortable="true"
          style="min-width:8rem;max-width:9rem"
          :showFilterOperator="false"
        >
          <template #body="{data}">
            <span v-if="data.item_sn" v-tooltip.bottom="data.item_sn">
              {{
                data.item_sn.length > 23
                  ? data.item_sn.substring(0, 20) + "..."
                  : data.item_sn
              }}
            </span>
            <span v-else> -- --</span>
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po S/N"
            />
          </template>
        </Column>
        <Column
          field="item_purchase_price"
          header="Kupovna cijena"
          :sortable="true"
          style="min-width:8rem;max-width:9rem"
          :showFilterOperator="false"
          dataType="numeric"
        >
          <template #body="{data}">
            {{ formatCurrency(data.item_purchase_price) }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po cijeni"
            />
          </template>
        </Column>
        <Column
          field="item_purchase_date"
          header="Datum kupnje"
          :sortable="true"
          style="min-width:8rem;max-width:6rem"
          :showFilterOperator="false"
          dataType="date"
          filterField="item_purchase_date"
          bodyStyle="text-align:center"
        >
          <template #body="{data}">
            {{ formatDate(data.item_purchase_date) }}
          </template>
          <template #filter="{filterModel}">
            <Calendar
              v-model="filterModel.value"
              dateFormat="dd.mm.yy"
              placeholder="Npr. 01.01.2021"
            />
          </template>
        </Column>
        <Column
          :exportable="false"
          header="Akcije"
          style="min-width:14rem;text-align:center"
        >
          <template #body="slotProps">
            <Button
              type="button"
              icon="pi pi-check"
              label="Prihvati"
              class="p-button-raised"
              style="margin-right:3px"
              :disabled="!slotProps.data.is_active"
              @click="acceptRequest(slotProps.data)"
            />
            <Button
              type="button"
              icon="pi pi-times"
              label="Odbij"
              class="p-button-raised p-button-secondary"
              :disabled="!slotProps.data.is_active"
              @click="declineRequest(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="acceptDialog"
      :style="{ width: '450px' }"
      header="Potvrda"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle"
          style="font-size: 1.5rem; margin-right:15px"
        />
        <span
          >Jeste li sigurni da želite <b>prihvatiti</b> zahtjev za otpis artikla
          <b>{{ request.item_name }}</b> korisnika:
          <b>{{ request.ownerName }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="Ne"
          icon="pi pi-times"
          class="p-button-text"
          @click="acceptDialog = false"
        />
        <Button
          label="Da"
          icon="pi pi-check"
          class="p-button"
          @click="acceptanceConfirmed(true)"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="declineDialog"
      :style="{ width: '450px' }"
      header="Potvrda"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle"
          style="font-size: 1.5rem; margin-right:15px"
        />
        <span
          >Jeste li sigurni da želite <b>odbiti</b> zahtjev za otpis artikla
          <b>{{ request.item_name }}</b> korisnika:
          <b>{{ request.ownerName }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="Ne"
          icon="pi pi-times"
          class="p-button-text"
          @click="acceptDialog = false"
        />
        <Button
          label="Da"
          icon="pi pi-check"
          class="p-button"
          @click="acceptanceConfirmed(false)"
        />
      </template>
    </Dialog>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import { FilterMatchMode, FilterOperator } from "primevue/api";
import api from "@/api/api";

export default {
  name: "ZahtjevZaOtpis",
  data() {
    return {
      requests: null,
      request: {},
      acceptDialog: false,
      declineDialog: false,
      selectedRequest: null,
      filters: null,
      loading: false,
      messages: [],
      statusOptions: [
        { label: "Aktivan", value: true },
        { label: "Neaktivan", value: false },
      ],
      scannableOptions: [
        { label: "Da", value: true },
        { label: "Ne", value: false },
      ],
      multiSortMeta: [
        { field: "is_active", order: -1 },
        { field: "request_date", order: 1 },
      ],
    };
  },
  created() {
    this.initFilters();
  },
  mounted() {
    this.loading = true;
    api.getWriteoffRequests().then((data) => {
      this.requests = data;
      this.requests.forEach((request) => {
        request.ownerName = request.first_name + " " + request.last_name;
        request.request_date = new Date(request.request_date);
        request.item_purchase_date = new Date(request.item_purchase_date);
      });
    });
    this.loading = false;
  },

  methods: {
    acceptRequest(request) {
      this.request = { ...request };
      this.acceptDialog = true;
    },
    declineRequest(request) {
      this.request = { ...request };
      this.declineDialog = true;
    },
    async acceptanceConfirmed(isAccepted) {
      if (this.request.writeoff_id) {
        this.request.is_accepted = isAccepted;
        this.request.is_active = false;

        await api.editWriteoff(this.request.writeoff_id, this.request);
        this.$toast.add({
          severity: "success",
          summary: "Spremljeno!",
          detail: `Zahtjev ${isAccepted ? "prihvaćen" : "odbijen"}.`,
          life: 3000,
        });
        this.requests[
          this.requests.findIndex(
            (r) => r.writeoff_id == this.request.writeoff_id
          )
        ] = this.request;
      }
      this.acceptDialog = false;
      this.declineDialog = false;
      this.request = {};
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("hr-HR", {
        style: "currency",
        currency: "HRK",
      }).format(Number(value));
    },
    formatDate(value) {
      if (value) {
        return new Date(value).toLocaleDateString("de-De", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      } else {
        return "--  --";
      }
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ownerName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        email: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        item_name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        item_sn: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        item_purchase_price: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.GREATER_THAN },
          ],
        },
        item_purchase_date: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
        },
        is_active: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        is_accepted: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        request_date: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  margin: 40px 40px 30px 40px;
  box-shadow: 0px 5px 15px 0px rgb(190, 190, 190);
}
.p-datatable-header {
  box-shadow: 0px 0px 15px 0px rgb(200, 200, 200) !important;
  background: #f2f2f2 !important;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 960px) {
    align-items: start;
  }
}

.p-toolbar {
  background: #ffffff;
}

@media screen and (max-width: 960px) {
  ::v-deep(.p-toolbar) {
    flex-wrap: wrap;

    .p-button {
      margin-bottom: 0.25rem;
    }
  }
}
</style>
