<template>
  <div>
    <div class="card">
      <Toolbar class="p-mb-4">
        <template #left>
          <Button
            label="Novi artikl"
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
            label="QR kod"
            icon="pi pi-print"
            class="p-button p-mr-2"
            style="margin-right:12px"
            @click="printCodes()"
          />
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
        :value="items"
        v-model:selection="selectedItems"
        dataKey="item_id"
        :paginator="true"
        :rows="10"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 25, 50]"
        :globalFilterFields="[
          'item_id',
          'item_name',
          'item_sn',
          'group_name',
          'user_name',
        ]"
        class="p-datatable-sm"
        responsiveLayout="scroll"
        style="maring: 15px"
        rowGroupMode="rowspan"
        groupRowsBy="user_name"
        sortMode="multiple"
        :multiSortMeta="multiSortMeta"
        :sortOrder="1"
        rowHover
      >
        <template #header>
          <div
            class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between"
          >
            <h2 class="p-mb-2 p-m-md-0 p-as-md-center pull-left">
              Artikli
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
          Dohvaćanje artikala...
        </template>
        <Column
          selectionMode="multiple"
          style="width: 2rem"
          :exportable="false"
        ></Column>
        <Column
          field="item_id"
          header="Id"
          :sortable="true"
          style="min-width:5rem;padding-left: 5px"
          bodyStyle="padding-left: 14px"
        ></Column>
        <Column
          field="user_name"
          header="Trenutni vlasnik"
          :sortable="true"
          style="min-width:6rem"
          :showFilterOperator="false"
        >
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po vlasniku"
            />
          </template>
        </Column>
        <Column
          field="item_name"
          header="Artikl"
          :sortable="true"
          style="min-width:8rem"
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
          style="min-width:8rem"
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
            <span v-else></span>
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
          field="group_name"
          header="Grupa"
          :sortable="true"
          style="min-width:6rem"
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
          field="item_description"
          header="Opis artikla"
          style="min-width:5rem"
        >
          <template #body="{data}">
            <span
              v-if="data.item_description"
              v-tooltip.bottom="data.item_description"
            >
              {{
                data.item_description.length > 23
                  ? data.item_description.substring(0, 20) + "..."
                  : data.item_description
              }}
            </span>
            <span v-else></span>
          </template>
        </Column>
        <Column
          field="purchase_price"
          header="Kupovna cijena"
          :sortable="true"
          style="min-width:8rem"
          :showFilterOperator="false"
          dataType="numeric"
        >
          <template #body="{data}">
            {{ formatCurrency(data.purchase_price) }}
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
          field="purchase_date"
          header="Datum kupnje"
          :sortable="true"
          style="min-width:6rem"
          :showFilterOperator="false"
          dataType="date"
          filterField="purchase_date"
        >
          <template #body="{data}">
            {{ formatDate(data.purchase_date) }}
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
          style="min-width:5rem"
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
              value="Otpisan"
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
          field="is_scannable"
          header="Sken."
          :sortable="true"
          style="min-width:5rem"
          filterField="is_scannable"
          :showFilterOperator="false"
          :showFilterMatchModes="false"
          :showAddButton="false"
          bodyStyle="text-align: center"
        >
          <template #body="slotProps">
            <Tag
              v-if="slotProps.data.is_scannable"
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
          field="in_possession_from_date"
          header="Vlasnik od"
          :sortable="true"
          style="min-width:6rem"
          :showFilterOperator="false"
          dataType="date"
        >
          <template #body="{data}">
            {{ formatDate(data.in_possession_from_date) }}
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
          field="last_recorded_date"
          header="Zadnja potvrda"
          dataType="date"
          :sortable="true"
          style="min-width:6rem"
          :showFilterOperator="false"
        >
          <template #body="{data}">
            {{ formatDate(data.last_recorded_date) }}
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
          style="min-width:9rem;text-align:center"
        >
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-raised"
              style="margin-right:5px"
              @click="editItem(slotProps.data)"
              :disabled="!slotProps.data.is_active"
              v-tooltip.bottom="'Uređivanje artikla'"
            />
            <Button
              icon="pi pi-users"
              class="p-button-raised p-button-info"
              style="margin-right:5px"
              @click="transferItem(slotProps.data)"
              :disabled="!slotProps.data.is_active"
              v-tooltip.bottom="'Prijenos artikla'"
            />
            <Button
              icon="pi pi-minus-circle"
              class="p-button-raised p-button-secondary"
              @click="writeoffItem(slotProps.data)"
              :disabled="!slotProps.data.is_active || !slotProps.data.user_id"
              v-tooltip.bottom="'Otpis artikla'"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="itemDialog"
      :style="{ width: '450px' }"
      :header="item.item_id ? 'Uređivanje artikla' : 'Novi artikl'"
      :modal="true"
      class="p-fluid"
      @hide="hideDialog"
    >
      <div class="p-field">
        <label for="item_name">*Naziv artikla</label>
        <InputText
          id="item_name"
          v-model.trim="item.item_name"
          required="true"
          autofocus
          :class="{ 'p-invalid': error && !item.item_name }"
        />
        <small class="p-error" v-if="error && !item.item_name"
          >Naziv je obavezan.</small
        >
      </div>
      <div class="p-field">
        <label for="item_sn">S/N (Serijski broj)</label>
        <InputText id="item_sn" v-model.trim="item.item_sn" autofocus />
      </div>
      <div class="p-field">
        <label for="item_description">Opis artikla</label>
        <Textarea
          id="item_description"
          v-model.trim="item.item_description"
          rows="5"
          cols="30"
        />
      </div>
      <div class="p-field">
        <label for="purchase_price">*Kupovna cijena</label>
        <InputNumber
          id="purchase_price-germany"
          v-model="item.purchase_price"
          mode="currency"
          currency="HRK"
          locale="de-DE"
          :min="0"
          placeholder="0,00 HRK"
          :class="{ 'p-invalid': error && !item.purchase_price }"
        />
        <small class="p-error" v-if="error && !item.purchase_price"
          >Cijena je obavezna.</small
        >
      </div>
      <div class="p-field">
        <label for="purchase_date">*Datum kupovine</label>
        <Calendar
          v-model="item.purchase_date"
          dateFormat="dd.mm.yy"
          placeholder="Npr. 01.01.2021"
          :maxDate="todayDate"
        />
        <!-- <InputText id="item_sn" v-model="todayDate" disabled /> -->
      </div>
      <div class="p-field">
        <label for="status">*Mogućnost skeniranja</label>
        <Dropdown
          v-model="item.is_scannable"
          :options="scannableOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Odaberite vrijednost"
          :class="{
            'p-invalid': error && item.is_scannable == undefined,
          }"
        >
        </Dropdown>
        <small v-if="error && item.is_scannable == undefined" class="p-error"
          >Vrijednost je obavezna</small
        >
      </div>
      <div class="p-field">
        <label for="status">*Grupa artikla</label>
        <Dropdown
          v-model="item.fk_groupid"
          :options="itemGroupOptions"
          optionLabel="label"
          optionValue="fk_groupid"
          placeholder="Odaberite grupu"
          :class="{
            'p-invalid': error && !item.fk_groupid,
          }"
        >
        </Dropdown>
        <small v-if="error && !item.fk_groupid" class="p-error"
          >Grupa je obavezna</small
        >
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
          @click="saveItem"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="transferItemDialog"
      :style="{ width: '450px' }"
      :header="
        `Prijenos vlasništva - ${transfer.item ? transfer.item.item_name : ''}`
      "
      :modal="true"
      class="p-fluid"
      @hide="hideDialog"
    >
      <div class="p-field">
        <label for="reason">*Razlog</label>
        <Textarea
          id="reason"
          v-model.trim="transfer.reason"
          rows="5"
          cols="30"
          :class="{ 'p-invalid': error && !transfer.reason }"
        />
        <small v-if="error && !transfer.reason" class="p-error"
          >Razlog je obavezan.</small
        >
      </div>

      <div class="p-field">
        <label for="previousOwner">*Prethodni vlasnik</label>
        <InputText
          id="previousOwner"
          :placeholder="
            transfer.item.user_id
              ? transfer.item.user_name
              : '--Nema vlasnika--'
          "
          disabled
        />
      </div>

      <div class="p-field">
        <label for="newOwner">*Novi vlasnik</label>
        <AutoComplete
          id="newOwner"
          v-model="transfer.newOwner"
          :suggestions="filteredUsers"
          @complete="searchUser($event)"
          :dropdown="true"
          field="label"
          forceSelection
          placeholder="Odaberite korisnika"
          :class="{ 'p-invalid': error && !transfer.newOwner.user_id }"
        >
          <template #item="slotProps">
            {{ slotProps.item.label }}
          </template>
        </AutoComplete>
        <small v-if="error && !transfer.newOwner.user_id" class="p-error"
          >Novi vlasnik je obavezan.</small
        >
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
          @click="transferItemConfirmed"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="writeoffItemDialog"
      :style="{ width: '450px' }"
      :header="
        `Otpis vlasništva - ${writeoff.item ? writeoff.item.item_name : ''}`
      "
      :modal="true"
      class="p-fluid"
      @hide="hideDialog"
    >
      <div class="p-field">
        <label for="previousOwner">Trenutni vlasnik</label>
        <InputText
          id="previousOwner"
          :placeholder="writeoff.item.user_name"
          disabled
        />
      </div>
      <div class="p-field">
        <label for="reason">*Razlog</label>
        <Textarea
          id="reason"
          v-model.trim="writeoff.reason"
          rows="5"
          cols="30"
          :class="{ 'p-invalid': !writeoff.reason }"
        />
        <small v-if="!writeoff.reason" class="p-error"
          >Razlog je obavezan.</small
        >
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
          @click="writeoffItemConfirmed"
        />
      </template>
    </Dialog>
    <Toast position="bottom-right" />
    <Dialog
      v-model:visible="qrPrintDialog"
      :style="{ width: '1000px' }"
      :header="'Ispis QR kodova'"
      :modal="true"
      class="p-fluid"
      @hide="qrPrintDialog = false"
    >
      <qrcodeprint :items="selectedItems"></qrcodeprint>
    </Dialog>
  </div>
</template>

<script>
import { FilterMatchMode, FilterOperator } from "primevue/api";
import api from "@/api/api";
import QRCodePrint from "@/components/QRCodePrint.vue";
import { mapMutations } from "vuex";

export default {
  name: "Artikli",
  components: {
    qrcodeprint: QRCodePrint,
  },
  data() {
    return {
      items: null,
      item: {},
      itemDialog: false,
      writeoffItemDialog: false,
      transferItemDialog: false,
      qrPrintDialog: false,
      transfer: {},
      writeoff: {},
      todayDate: new Date(),
      selectedItems: null,
      filters: null,
      loading: false,
      error: false,
      messages: [],
      itemGroupOptions: [],
      usersOptions: [],
      filteredUsers: null,
      statusOptions: [
        { label: "Aktivan", value: true },
        { label: "Otpisan", value: false },
      ],
      scannableOptions: [
        { label: "Da", value: true },
        { label: "Ne", value: false },
      ],
      multiSortMeta: [
        { field: "is_active", order: -1 },
        { field: "user_name", order: 1 },
      ],
    };
  },
  created() {
    this.initFilters();
  },
  mounted() {
    this.loading = true;
    api.getItems().then((data) => {
      this.items = data;
      this.items.forEach((item) => {
        item.user_name =
          item.user_name == " " ? "--Nema vlasnika--" : item.user_name;
        item.purchase_date = new Date(item.purchase_date);
        item.last_recorded_date = item.last_recorded_date
          ? new Date(item.last_recorded_date)
          : null;
        item.in_possession_from_date = item.in_possession_from_date
          ? new Date(item.in_possession_from_date)
          : null;
      });
    });
    api.getItemGroups().then((data) => {
      data.forEach((group) => {
        this.itemGroupOptions.push({
          label: group.group_name,
          fk_groupid: group.group_id,
        });
      });
    });
    api.getUsers().then((data) => {
      data.forEach((user) => {
        this.usersOptions.push({
          label: user.first_name + " " + user.last_name,
          user_id: user.user_id,
        });
      });
    });
    this.loading = false;
  },

  methods: {
    ...mapMutations(["changeItems"]),
    printCodes() {
      this.changeItems(this.selectedItems);
      this.$router.push("print");
    },
    async updateItem(itemId) {
      let updatedItem = await api.getItemById(itemId);
      //       this.item.group_name = this.itemGroupOptions.find(
      //   (g) => g.fk_groupid == this.item.fk_groupid
      // ).label;

      updatedItem.user_name =
        updatedItem.user_name == " "
          ? "--Nema vlasnika--"
          : updatedItem.user_name;

      updatedItem.purchase_date = new Date(updatedItem.purchase_date);

      updatedItem.last_recorded_date = updatedItem.last_recorded_date
        ? new Date(updatedItem.last_recorded_date)
        : null;

      updatedItem.in_possession_from_date = updatedItem.in_possession_from_date
        ? new Date(updatedItem.in_possession_from_date)
        : null;

      this.items[
        this.items.findIndex((i) => i.item_id == itemId)
      ] = updatedItem;

      return updatedItem;
    },
    hideDialog() {
      this.itemDialog = false;
      this.transferItemDialog = false;
      this.writeoffItemDialog = false;
      this.error = false;
    },
    async saveItem() {
      if (
        !this.item.item_name ||
        !this.item.purchase_price ||
        !this.item.purchase_date ||
        this.item.is_scannable == undefined ||
        !this.item.fk_groupid
      ) {
        this.error = true;
        return;
      } else {
        this.item.purchase_date = new Date(this.item.purchase_date);

        if (this.item.item_id) {
          await api.updateItem(this.item.item_id, this.item);
          this.$toast.add({
            severity: "success",
            summary: "Spremljeno!",
            detail: "Artikl ažuriran",
            life: 3000,
          });
          await this.updateItem(this.item.item_id);
        } else {
          let response = await api.addNewItem(this.item);
          response[0].user_name = "--Nema vlasnika--";
          response[0].group_name = this.itemGroupOptions.find(
            (g) => g.fk_groupid == response[0].fk_groupid
          ).label;
          this.items.push(response[0]);
          this.$toast.add({
            severity: "success",
            summary: "Spremljeno!",
            detail: "Artikl dodan",
            life: 3000,
          });
        }
        this.error = false;
        this.itemDialog = false;
        this.item = {};
      }
    },
    openNew() {
      this.item = {
        user_name: "--Nema vlasnika--",
        item_description: null,
        item_sn: null,
        is_active: true,
      };
      this.item.purchase_date = new Date().toLocaleDateString("hr-HR");
      this.error = false;
      this.itemDialog = true;
    },
    editItem(item) {
      this.item = { ...item };
      this.itemDialog = true;
    },
    transferItem(item) {
      this.transfer = {
        item: item,
        newOwner: null,
        reason: "--Pokrenuo administrator--\nRazlog: ",
      };
      this.transferItemDialog = true;
    },
    async transferItemConfirmed() {
      if (!this.transfer.reason || !this.transfer.newOwner) {
        this.error = true;
        return;
      } else {
        let transferRequest = {
          reason: this.transfer.reason,
          fkItemId: this.transfer.item.item_id,
          fkPreviousOwnerId: this.transfer.item.user_id
            ? this.transfer.item.user_id
            : null,
          fkNewOwenerId: this.transfer.newOwner.user_id,
          isActive: false,
          isAccepted: true,
        };
        await api.createTransferRequest(transferRequest);

        if (this.transfer.item.user_id) {
          let transferOwnershipReq = {
            userId: this.transfer.item.user_id,
            itemId: this.transfer.item.item_id,
            newUserId: this.transfer.newOwner.user_id,
          };
          await api.transferItemsToAnotherUser(transferOwnershipReq);
        } else {
          let addOwnershipReq = {
            userId: this.transfer.newOwner.user_id,
            itemId: this.transfer.item.item_id,
          };
          await api.addItemOwnershipToUser(addOwnershipReq);
        }
        await this.updateItem(this.transfer.item.item_id);
        this.$toast.add({
          severity: "success",
          summary: "Uspješni prijenos",
          detail: "Artikl je uspješno prenesen",
          life: 3000,
        });
        this.transferItemDialog = false;
        this.error = false;
        this.transfer = {};
      }
    },
    writeoffItem(item) {
      this.writeoffItemDialog = true;
      this.writeoff = {
        item: item,
        reason: "--Pokrenuo administrator--\nRazlog: ",
      };
    },
    async writeoffItemConfirmed() {
      let writeoffRequest = {
        reason: this.writeoff.reason,
        fkItemId: this.writeoff.item.item_id,
        fkOwnerId: this.writeoff.item.user_id,
        isAccepted: true,
        isActive: false,
      };
      await api.createWriteoffRequest(writeoffRequest);

      let deleteOwnershipReq = {
        userId: this.writeoff.item.user_id,
        itemId: this.writeoff.item.item_id,
      };
      await api.deleteUserItemOwnership(deleteOwnershipReq);
      await api.disableItem(this.writeoff.item.item_id);

      await this.updateItem(this.writeoff.item.item_id);
      this.$toast.add({
        severity: "success",
        summary: "Uspješni otpis",
        detail: "Artikl je uspješno otpisan",
        life: 3000,
      });
      this.writeoffItemDialog = false;
      this.writeoff = {};
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("hr-HR", {
        style: "currency",
        currency: "HRK",
      }).format(value);
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
    searchUser(event) {
      if (!event.query.trim().length) {
        this.filteredUsers = [...this.usersOptions];
      } else {
        this.filteredUsers = this.usersOptions.filter((user) => {
          return user.label.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        user_name: {
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
        purchase_price: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.GREATER_THAN },
          ],
        },
        purchase_date: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
        },
        is_active: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        is_scannable: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        group_name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        in_possession_from_date: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
        },
        last_recorded_date: {
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
