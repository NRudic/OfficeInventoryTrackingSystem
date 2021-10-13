<template>
  <div>
    <div class="setup-container">
      <div class="p-grid p-fluid">
        <div class="p-field p-col-12 p-md-2"></div>
        <div class="p-field p-col-12 p-md-2">
          <label for="paddingtop">Gornja margina</label>
          <InputNumber
            id="paddingtop"
            v-model="padding.top"
            showButtons
            buttonLayout="horizontal"
            :step="0.1"
            decrementButtonClass="p-button-danger"
            incrementButtonClass="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :min="0"
            :max="100"
            inputStyle="text-align:center"
            suffix=" mm"
          />
        </div>
        <div class="p-field p-col-12 p-md-1"></div>
        <div class="p-field p-col-12 p-md-2">
          <label for="stickerhight">Visina naljepnice</label>
          <InputNumber
            id="stickerhight"
            v-model="sticker.height"
            showButtons
            buttonLayout="horizontal"
            :step="0.1"
            decrementButtonClass="p-button-danger"
            incrementButtonClass="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :min="0"
            :max="100"
            inputStyle="text-align:center"
            suffix=" mm"
          />
        </div>
        <div class="p-field p-col-12 p-md-1"></div>
        <div class="p-field p-col-12 p-md-2">
          <label for="stickersPerPage">Broj naljepnica po stranici</label>
          <InputNumber
            id="stickersPerPage"
            v-model="stickersPerPage"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            decrementButtonClass="p-button-danger"
            incrementButtonClass="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            :min="1"
            :max="100"
            inputStyle="text-align:center"
          />
        </div>
      </div>

      <div class="p-grid p-fluid">
        <div class="p-field p-col-12 p-md-2"></div>
        <div class="p-field p-col-12 p-md-2">
          <label for="paddingleft">Lijeva margina</label>
          <InputNumber
            id="paddingleft"
            v-model="padding.left"
            showButtons
            buttonLayout="horizontal"
            :step="0.1"
            decrementButtonClass="p-button-danger"
            incrementButtonClass="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :min="0"
            :max="100"
            inputStyle="text-align:center"
            suffix=" mm"
          />
        </div>
        <div class="p-field p-col-12 p-md-1"></div>
        <div class="p-field p-col-12 p-md-2">
          <label for="stickerwidth">Širina naljepnice</label>
          <InputNumber
            id="stickerwidth"
            v-model="sticker.width"
            showButtons
            buttonLayout="horizontal"
            :step="0.1"
            decrementButtonClass="p-button-danger"
            incrementButtonClass="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :min="0"
            :max="100"
            inputStyle="text-align:center"
            suffix=" mm"
          />
        </div>
        <div class="p-field p-col-12 p-md-1"></div>
        <div class="p-field p-col-12 p-md-2">
          <label for="offset">Preskoči</label>
          <InputNumber
            id="offset"
            v-model="offset"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            decrementButtonClass="p-button-danger"
            incrementButtonClass="p-button-success"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            :min="0"
            :max="100"
            inputStyle="text-align:center"
          />
        </div>
      </div>
      <Button
        label="Ispis stranice"
        icon="pi pi-print"
        class="p-button p-mr-2"
        style="margin-right:12px"
        @click="print"
      />
      <div class="p-grid p-fluid">
        <div class="p-field p-col-12 p-md-12">
          <Paginator
            v-model:first="offset"
            :rows="stickersPerPage"
            :totalRecords="5"
          >
          </Paginator>
        </div>
      </div>
    </div>

    <!-- <div class="pagination-row">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalSelectedSudioniciLenght"
          :per-page="stickersPerPage"
          first-text="First"
          prev-text="Prev"
          next-text="Next"
          last-text="Last"
          limit="10"
          align="center"
        ></b-pagination>
      </div> -->
  </div>
  <div class="message-container">
    <p>
      Ispod se nalazi pregled stranice za ispis.
      <br />
      Svaka stranica se može individualno prilagođavati. <br />
      Da biste ispisali, pritisnite Ctrl+P ili kliknite Ispis stranice.
    </p>
  </div>
  <div class="flex-container" :style="customPreviewPaddingStyle">
    <div
      class="flex-item"
      :style="customStickerStyle"
      :key="`offset_${i}`"
      v-for="i in offsetRange"
    ></div>
    <div
      class="flex-item"
      :style="customStickerStyle"
      v-for="item in items"
      :key="item.item_id"
    >
      <div class="qrcode-div">
        <vue-qrcode
          class="qr"
          :value="item.item_id"
          :options="{ width: 200 }"
        ></vue-qrcode>
      </div>
      <div class="description-div" v-if="item.item_name">
        <div class="name-div">
          {{
            item.item_name.length > 28
              ? item.item_name.substring(0, 25) + "..."
              : item.item_name
          }}
        </div>
        <div class="sn-div" v-if="item.item_sn">
          {{
            item.item_sn.length > 28
              ? item.item_sn.substring(0, 25) + "..."
              : item.item_sn
          }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "QRCodePrint",
  data() {
    return {
      offset: 0,
      stickersPerPage: 65,
      currentPage: 1,
      padding: {
        top: 10.7,
        left: 9.75,
      },
      sticker: {
        height: 21,
        width: 38,
      },
    };
  },

  computed: {
    ...mapState(["items"]),

    offsetRange() {
      return [...Array(this.offset).keys()];
    },
    customPreviewPaddingStyle() {
      return `padding-left: ${this.padding.left}mm; padding-top: ${this.padding.top}mm; `;
    },
    customStickerStyle() {
      return `height: ${this.sticker.height}mm; width: ${this.sticker.width}mm;`;
    },
  },

  methods: {
    print() {
      window.print();
    },
  },
};
</script>
<style>
.setup-container {
  background-color: #ffffff;
  box-shadow: 0 5px 20px 0 #ddd;
  margin-top: 20px;
  padding: 20px 30px;
}

.setup-container > .pagination-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 30px auto;
  padding-bottom: 10px;
}

.message-container {
  width: 210mm;
  margin: 20px auto;
  background-color: #fff;
  box-shadow: 0px 0px 150px rgba(0, 0, 0, 0.2);
  padding: 3px;
}

.flex-container {
  width: 210mm;
  height: 297mm;
  margin: 40px auto;
  padding-bottom: 10mm;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 0px 150px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: flex-start;
}

.flex-item {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;

  color: black;
  font-weight: bold;
  flex-grow: 0;
  flex-shrink: 0;
  text-align: center;
  outline: 1px solid #a4a4a4;
}

.qrcode-div {
  position: relative;
  width: 100%;
  height: 90%;
  text-align: center;
  margin-top: 1pt;
}
.description-div {
  width: 100%;
  height: 10%;
  text-align: center;
  font-size: 5pt;
  z-index: 99;
}
.name-div {
  margin-top: -8pt;
}
.sn-div {
  margin-top: 0pt;
}
.qr {
  position: relative;
  height: 95% !important;
  width: auto !important;
  text-align: center;
}

#app {
  min-height: unset !important;
}
#nav {
  margin: 0;
  min-height: unset !important;
}

@media print {
  @page {
    size: A4;
  }
  body {
    box-sizing: border-box;
    height: 297mm !important;
    width: 210mm !important;
    margin: 0 !important;
    min-height: unset !important;
    min-width: unset !important;
  }
  .setup-container {
    display: none;
  }
  .message-container {
    display: none;
  }
  .flex-container {
    width: 100%;
    margin: 0 !important;
    background-color: white;
    box-shadow: none;
  }
  .flex-item {
    outline: none;
  }
  .setup-container {
    padding: 0;
    margin: 0;
  }
}
</style>
