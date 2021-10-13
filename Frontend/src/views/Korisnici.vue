<template>
  <div>
    <div class="card">
      <Toolbar class="p-mb-4">
        <template #left>
          <Button
            label="Novi korisnik"
            icon="pi pi-user-plus"
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
        :value="users"
        v-model:selection="selectedUser"
        :paginator="true"
        :rows="10"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 25, 50]"
        :globalFilterFields="[
          'user_id',
          'first_name',
          'last_name',
          'email',
          'phone',
        ]"
        class="p-datatable-sm"
        responsiveLayout="scroll"
        style="maring: 15px"
        sortField="user_id"
        :sortOrder="1"
        rowHover
      >
        <template #header>
          <div
            class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between"
          >
            <h2 class="p-mb-2 p-m-md-0 p-as-md-center pull-left">
              Korisnici
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
          Dohvaćanje korisnika...
        </template>
        <Column
          field="user_id"
          header="Id"
          :sortable="true"
          style="min-width:5rem;padding-left: 10px"
          bodyStyle="padding-left: 14px"
        ></Column>
        <Column
          field="first_name"
          header="Ime"
          :sortable="true"
          style="min-width:16rem"
          :showFilterOperator="false"
        >
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po imenu"
            />
          </template>
        </Column>
        <Column
          field="last_name"
          header="Prezime"
          :sortable="true"
          style="min-width:16rem"
          :showFilterOperator="false"
        >
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po prezimenu"
            />
          </template>
        </Column>
        <Column
          field="email"
          header="Email"
          :sortable="true"
          style="min-width:16rem"
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
          field="phone"
          header="Kontakt br."
          :sortable="true"
          style="min-width:16rem"
          :showFilterOperator="false"
        >
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Pretraživanje po telefonu"
            />
          </template>
        </Column>
        <Column
          field="is_active"
          header="Status"
          :sortable="true"
          style="min-width:8rem"
          filterField="is_active"
          :showFilterOperator="false"
          :showFilterMatchModes="false"
          :showAddButton="false"
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
          field="fk_roleid"
          header="Uloga"
          :sortable="true"
          style="min-width:8rem"
          filterField="fk_roleid"
          :showFilterOperator="false"
          :showFilterMatchModes="false"
          :showAddButton="false"
        >
          <template #body="slotProps">
            <span v-if="slotProps.data.fk_roleid == 1">Administrator</span>
            <span v-else>Korisnik</span>
          </template>
          <template #filter="{filterModel}">
            <Dropdown
              v-model="filterModel.value"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Odaberite ulogu"
            >
            </Dropdown>
          </template>
        </Column>
        <Column
          :exportable="false"
          header="Akcije"
          style="min-width:8rem;text-align:center"
        >
          <template #body="slotProps">
            <Button
              icon="pi pi-user-edit"
              class="p-button-raised"
              style="margin-right:5px"
              @click="editUser(slotProps.data)"
              :disabled="!slotProps.data.is_active"
              v-tooltip.bottom="'Uređivanje korisnika'"
            />
            <Button
              icon="pi pi-key"
              class="p-button-raised p-button-secondary"
              style="margin-right:5px"
              @click="changeUserPw(slotProps.data)"
              :disabled="!slotProps.data.is_active"
              v-tooltip.bottom="'Promjena lozinke'"
            />
            <Button
              icon="pi pi-user-minus"
              class="p-button-raised p-button-info"
              @click="disableUser(slotProps.data)"
              :disabled="!slotProps.data.is_active"
              v-tooltip.bottom="'Deaktiviranje korisnika'"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="userDialog"
      :style="{ width: '450px' }"
      :header="user.user_id ? 'Uređivanje podataka korisnika' : 'Novi korisnik'"
      :modal="true"
      class="p-fluid"
      @hide="hideDialog"
    >
      <div class="p-field">
        <label for="first_name">Ime</label>
        <InputText
          id="first_name"
          v-model.trim="user.first_name"
          required="true"
          autofocus
          :class="{ 'p-invalid': error && !user.first_name }"
        />
        <small class="p-error" v-if="error && !user.first_name"
          >Ime je obavezno.</small
        >
      </div>
      <div class="p-field">
        <label for="last_name">Prezime</label>
        <InputText
          id="last_name"
          v-model.trim="user.last_name"
          required="true"
          autofocus
          :class="{ 'p-invalid': error && !user.last_name }"
        />
        <small class="p-error" v-if="error && !user.last_name"
          >Prezime je obavezno.</small
        >
      </div>
      <div class="p-field">
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model.trim="user.email"
          required="true"
          autofocus
          :class="{
            'p-invalid': error && isEmailWrong,
          }"
        />
        <small class="p-error" v-if="error && isEmailWrong"
          >Email je obavezan.</small
        >
      </div>
      <div class="p-field">
        <label for="phone">Kontakt br.</label>
        <InputText
          id="phone"
          v-model.trim="user.phone"
          required="true"
          autofocus
          :class="{ 'p-invalid': error && !user.phone }"
        />
        <small class="p-error" v-if="error && !user.phone"
          >Kontakt je obavezan.</small
        >
      </div>

      <div class="p-field">
        <label for="status">Uloga</label>
        <Dropdown
          v-model="user.fk_roleid"
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Odaberite ulogu"
          :class="{
            'p-invalid': error && !user.fk_roleid,
          }"
        >
        </Dropdown>
        <small v-if="error && !user.fk_roleid" class="p-error"
          >Uloga je obavezna</small
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
          @click="saveUser"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="changePwDialog"
      :style="{ width: '450px' }"
      :header="`Promjena lozinke - ${user.first_name} ${user.last_name}`"
      :modal="true"
      class="p-fluid"
      @hide="hideDialog"
    >
      <div class="p-field" v-if="user.user_id">
        <label for="password">Lozinka</label>
        <Password
          id="password"
          v-model="user.password"
          :class="{ 'p-invalid': error && isPasswordWeak }"
          toggleMask
        >
          <template #header>
            <h6>Odaberite lozinku</h6>
          </template>
          <template #footer="sp">
            {{ sp.level }}
            <p class="p-mt-2">Zahtjevi</p>
            <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
              <li>Barem jedno malo slovo</li>
              <li>Barem jedno veliko slovo</li>
              <li>Barem jedan broj</li>
              <li>Minimalno 8 znakova</li>
            </ul>
          </template>
        </Password>
        <small v-if="error && isPasswordWeak" class="p-error"
          >Snažna lozinka je obavezna</small
        >
      </div>
      <div class="p-field" v-if="user.user_id">
        <label for="password">Ponovite lozinku</label>
        <Password
          id="password"
          v-model="user.repeatedPassword"
          :class="{
            'p-invalid': error && user.repeatedPassword != user.password,
          }"
        >
        </Password>
        <small
          v-if="error && user.repeatedPassword != user.password"
          class="p-error"
          >Lozinke se trebaju podudarati</small
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
          @click="changeUserPwConfirmed"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="disableUserDialog"
      :style="{ width: '450px' }"
      header="Potvrda"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle"
          style="font-size: 1.5rem; margin-right:15px"
        />
        <span v-if="user"
          >Jeste li sigurni da želite deaktivirati korisnika
          <b>{{ user.first_name }} {{ user.last_name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="Ne"
          icon="pi pi-times"
          class="p-button-text"
          @click="disableUserDialog = false"
        />
        <Button
          label="Da"
          icon="pi pi-check"
          class="p-button"
          @click="disableUserConfirmed"
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
  name: "Korisnici",
  data() {
    return {
      users: null,
      user: {},
      userDialog: false,
      changePwDialog: false,
      disableUserDialog: false,
      selectedUser: null,
      filters: null,
      loading: false,
      error: false,
      messages: [],
      statusOptions: [
        { label: "Aktivan", value: true },
        { label: "Neaktivan", value: false },
      ],
      roleOptions: [
        { label: "Administrator", value: 1 },
        { label: "Korisnik", value: 2 },
      ],
    };
  },
  created() {
    this.initFilters();
  },
  mounted() {
    this.loading = true;
    api.getUsers().then((data) => (this.users = data));
    this.loading = false;
  },
  computed: {
    isPasswordWeak: function() {
      if (this.user.password) {
        return !this.user.password.match(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
        );
      } else {
        return true;
      }
    },
    isEmailWrong: function() {
      if (this.user.email) {
        //eslint-disable-next-line
        return !this.user.email.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,10}$");
      } else {
        return true;
      }
    },
  },
  methods: {
    openNew() {
      this.user = {};
      this.error = false;
      this.userDialog = true;
    },
    hideDialog() {
      this.userDialog = false;
      this.changePwDialog = false;
      this.error = false;
    },
    saveUser() {
      if (
        !this.user.first_name ||
        !this.user.last_name ||
        this.isEmailWrong ||
        !this.user.phone ||
        !this.user.fk_roleid
      ) {
        this.error = true;
        return;
      } else {
        if (this.user.user_id) {
          api.updateUser(this.user, this.user.user_id).then(() => {
            this.$toast.add({
              severity: "success",
              summary: "Spremljeno!",
              detail: "Korisnički podaci spremljeni",
              life: 3000,
            });
          });
          this.users[
            this.users.findIndex((u) => u.user_id == this.user.user_id)
          ] = this.user;
        } else {
          if (
            this.isPasswordWeak ||
            this.user.repeatedPassword != this.user.password
          ) {
            this.error;
            return;
          } else {
            api.addNewUser(this.user).then((userResponse) => {
              this.users.push(userResponse);
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: "Korisnik dodan",
                life: 3000,
              });
            });
          }
        }
        this.error = false;
        this.userDialog = false;
        this.user = {};
      }
    },
    editUser(user) {
      this.user = { ...user };
      this.userDialog = true;
    },
    changeUserPw(user) {
      this.user = { ...user };
      this.changePwDialog = true;
    },
    changeUserPwConfirmed() {
      if (
        this.isPasswordWeak ||
        this.user.repeatedPassword != this.user.password
      ) {
        this.error = true;
        return;
      } else {
        api
          .changeUserPw({ password: this.user.password }, this.user.user_id)
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Lozinka promijenjena",
              life: 3000,
            });
          });
        this.error = false;
        this.changePwDialog = false;
      }
    },
    disableUser(user) {
      this.user = user;
      this.disableUserDialog = true;
    },
    disableUserConfirmed() {
      this.disableUserDialog = false;
      this.user.is_active = false;
      api.disableUser(this.user.user_id).then(() => {
        this.$toast.add({
          severity: "success",
          summary: "Uspješna deaktivacija",
          detail: "Korisnik je uspješno deaktiviran",
          life: 3000,
        });
      });
      this.users[
        this.users.findIndex((u) => u.user_id == this.user.user_id)
      ] = this.user;
    },

    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        first_name: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        last_name: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        email: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        phone: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        is_active: {
          operator: FilterOperator.AND,
          constraints: [
            {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
          ],
        },
        fk_roleid: {
          operator: FilterOperator.AND,
          constraints: [
            {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
          ],
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
