<template>
  <div>
    <div class="card">
      <Toolbar class="p-mb-4">
        <template #left>
          <Button
            label="Nova grupa"
            icon="pi pi-plus"
            class="p-button-success p-mr-2"
            @click="openNew"
          />
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
        :value="groups"
        v-model:selection="selectedgroup"
        :paginator="true"
        :rows="10"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 25, 50]"
        :globalFilterFields="['group_id', 'group_name', 'group_description']"
        class="p-datatable-sm"
        responsiveLayout="scroll"
        sortField="group_id"
        :sortOrder="1"
        rowHover
      >
        <template #header>
          <div
            class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between"
          >
            <h2 class="p-mb-2 p-m-md-0 p-ml-2 p-as-md-center pull-left">
              Grupe artikala
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
          Dohvaćanje grupa...
        </template>

        <Column
          field="group_id"
          header="Id"
          :sortable="true"
          style="min-width:5rem;padding-left: 5px"
          bodyStyle="padding-left: 14px"
        ></Column>

        <Column
          field="group_name"
          header="Naziv grupe"
          :sortable="true"
          style="min-width:8rem"
          :showFilterOperator="false"
        >
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po grupi"
            />
          </template>
        </Column>
        <Column
          field="group_description"
          header="Opis"
          :sortable="true"
          style="min-width:6rem"
        >
        </Column>

        <Column
          :exportable="false"
          header="Akcije"
          style="min-width:7rem;text-align:center"
        >
          <template #body="slotProps">
            <Button
              icon="pi pi-user-edit"
              label="Uredi"
              class="p-button-raised"
              style="margin-right:5px"
              @click="editGroup(slotProps.data)"
              v-tooltip.bottom="'Uređivanje grupe'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="editDialog"
      :style="{ width: '450px' }"
      :header="group.user_id ? 'Uređivanje grupe' : 'Nova grupa'"
      :modal="true"
      class="p-fluid"
      @hide="hideDialog"
    >
      <div class="p-field">
        <label for="group_name">Naziv grupe</label>
        <InputText
          id="group_name"
          v-model.trim="group.group_name"
          required="true"
          autofocus
          :class="{ 'p-invalid': error && !group.group_name }"
        />
        <small class="p-error" v-if="error && !group.group_name"
          >Ime je obavezno.</small
        >
      </div>
      <div class="p-field">
        <label for="description">*Opis</label>
        <Textarea
          id="description"
          v-model.trim="group.group_description"
          rows="5"
          cols="30"
        />
      </div>

      <template #footer>
        <Button
          label="Odustani"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Spremi"
          icon="pi pi-check"
          class="p-button"
          @click="saveGroup"
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
  name: "Grupe",
  data() {
    return {
      groups: null,
      group: {},
      editDialog: false,
      selectedgroup: null,
      error: false,
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
        { field: "group_date", order: 1 },
      ],
    };
  },
  created() {
    this.initFilters();
  },
  mounted() {
    this.loading = true;
    api.getItemGroups().then((data) => {
      this.groups = data;
      this.groups.forEach((group) => {
        group.ownerName = group.first_name + " " + group.last_name;
        group.group_date = new Date(group.group_date);
        group.item_purchase_date = new Date(group.item_purchase_date);
      });
    });
    this.loading = false;
  },

  methods: {
    openNew() {
      this.group = {};
      this.error = false;
      this.editDialog = true;
    },
    editGroup(group) {
      this.group = { ...group };
      this.editDialog = true;
    },
    hideDialog() {
      this.group = {};
      this.editDialog = false;
      this.error = false;
    },
    async saveGroup() {
      if (!this.group.group_name) {
        this.error = true;
        return;
      } else {
        if (this.group.group_id) {
          await api.editItemGroup(this.group.group_id, this.group);
          this.$toast.add({
            severity: "success",
            summary: "Spremljeno!",
            detail: "Grupa ažurirana",
            life: 3000,
          });
          this.groups[
            this.groups.findIndex((g) => g.group_id == this.group.group_id)
          ] = this.group;
        } else {
          let response = await api.addItemGroup(this.group);
          this.groups.push(response);
          this.$toast.add({
            severity: "success",
            summary: "Spremljeno!",
            detail: "Grupa dodana",
            life: 3000,
          });
        }
        this.error = false;
        this.editDialog = false;
        this.group = {};
      }
    },

    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        group_name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
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
